/**
 * Gemini 2.0 Flash - Production Integration
 * Uses official Google Generative AI Node SDK
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../utils/logger");

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY || API_KEY.trim() === "") {
  logger.error("❌ ERROR: GEMINI_API_KEY missing or empty in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];
const RETRY_DELAYS_MS = [2000, 4000, 8000];

class GeminiError extends Error {
  constructor(message, code, status, retryable = false, originalError = null) {
    super(message);
    this.name = "GeminiError";
    this.code = code;
    this.status = status;
    this.retryable = retryable;
    this.originalError = originalError;
  }
}

function isGeminiError(error) {
  return error instanceof GeminiError;
}

function buildPrompt(resumeText, jobDescription) {
  return `
You are an expert resume analysis engine. Compare the RESUME with the JOB DESCRIPTION.

Return ONLY valid JSON in this structure:

{
  "match_percent": number,
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "suggested_changes": "string or bullet list",
  "score_breakdown": {
    "skills_score": number,
    "experience_score": number,
    "keywords_score": number
  }
}

NO explanation.
NO extra text.
ONLY pure JSON.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`.trim();
}

function classifyError(error) {
  const status = error?.response?.status ?? error?.status;
  const message = String(error?.message ?? "").toLowerCase();
  const errorCode = error?.code;

  if (status === 401 || errorCode === 401 || message.includes("api key") || message.includes("unauthorized") || message.includes("authentication")) {
    return new GeminiError("Invalid or missing API key", "INVALID_API_KEY", 401, false, error);
  }

  if (status === 429 || errorCode === 429 || message.includes("quota") || message.includes("rate limit") || message.includes("too many requests")) {
    return new GeminiError("Rate limit or quota exceeded", "RATE_LIMITED", 429, true, error);
  }

  if (status === 400 || errorCode === 400) {
    if (message.includes("safety") || message.includes("blocked") || message.includes("harmful")) {
      return new GeminiError("Content blocked by safety filters", "SAFETY_BLOCKED", 400, false, error);
    }
    if (message.includes("model") && message.includes("not found")) {
      return new GeminiError("Model not found", "MODEL_NOT_FOUND", 400, false, error);
    }
    return new GeminiError("Bad request", "BAD_REQUEST", 400, false, error);
  }

  if (status === 404 || errorCode === 404) {
    if (message.includes("model") && message.includes("not found")) {
      return new GeminiError("Model not found", "MODEL_NOT_FOUND", 404, false, error);
    }
  }

  if (status === 503 || errorCode === 503) {
    const isUnavailable = message.includes("service unavailable") || message.includes("unavailable");
    const isHighDemand = message.includes("high demand");
    if (isUnavailable || isHighDemand) {
      return new GeminiError("Service temporarily unavailable", "SERVICE_UNAVAILABLE", 503, true, error);
    }
    return new GeminiError("Upstream service error", "UPSTREAM_ERROR", 503, true, error);
  }

  if (status === 500 || errorCode === 500) {
    return new GeminiError("Internal server error from provider", "UPSTREAM_ERROR", 500, true, error);
  }

  if (status === 504 || errorCode === 504 || message.includes("timeout") || message.includes("deadline exceeded")) {
    return new GeminiError("Request timeout", "TIMEOUT", 504, true, error);
  }

  if (!error?.response && (message.includes("network") || message.includes("econnrefused") || message.includes("enotfound") || message.includes("socket") || message.includes("dns"))) {
    return new GeminiError("Network error", "NETWORK_ERROR", 0, true, error);
  }

  if (message.includes("candidate") || message.includes("finish reason")) {
    return new GeminiError("Unexpected response structure", "MISSING_RESPONSE_OBJECT", 502, false, error);
  }

  return new GeminiError(error?.message ?? "Unknown Gemini error", "UNKNOWN_ERROR", status ?? 502, false, error);
}

function shouldRetryGeminiError(error) {
  const geminiError = error instanceof GeminiError ? error : classifyError(error);
  return geminiError.retryable;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithModel(modelName, prompt) {
  const model = genAI.getGenerativeModel({ model: modelName });

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      if (attempt > 0) {
        logger.info(`Retrying Gemini request (${attempt}/${RETRY_DELAYS_MS.length}) for ${modelName}`);
        await delay(RETRY_DELAYS_MS[attempt - 1]);
      }

      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      const classified = error instanceof GeminiError ? error : classifyError(error);

      if (attempt === RETRY_DELAYS_MS.length || !classified.retryable) {
        throw classified;
      }
    }
  }
}

function validateResponseStructure(result) {
  if (!result) {
    throw new GeminiError("No response object returned", "MISSING_RESPONSE_OBJECT", 502, false, null);
  }

  if (!result.response) {
    throw new GeminiError("Missing response in result", "MISSING_RESPONSE_OBJECT", 502, false, null);
  }

  const response = result.response;
  const candidates = response?.candidates;

  if (!candidates || candidates.length === 0) {
    throw new GeminiError("No candidates in response", "NO_CANDIDATES", 502, false, null);
  }

  const candidate = candidates[0];

  if (candidate?.finishReason && candidate.finishReason !== "STOP") {
    const reason = candidate.finishReason;
    if (reason === "SAFETY") {
      throw new GeminiError("Content blocked by safety filters", "SAFETY_BLOCKED", 400, false, null);
    }
    if (reason === "MAX_TOKENS") {
      throw new GeminiError("Response truncated due to token limit", "MAX_TOKENS_EXCEEDED", 502, false, null);
    }
    throw new GeminiError(`Generation stopped: ${reason}`, "GENERATION_INCOMPLETE", 502, false, null);
  }

  const content = candidate?.content;
  if (!content || !content.parts || content.parts.length === 0) {
    throw new GeminiError("Empty content in response", "EMPTY_CONTENT", 502, false, null);
  }

  return true;
}

async function analyzeWithGemini({ resumeText, jobDescription }) {
  const prompt = buildPrompt(resumeText, jobDescription);

  let lastError = null;

  for (const modelName of MODEL_CHAIN) {
    try {
      const result = await generateWithModel(modelName, prompt);

      validateResponseStructure(result);

      const rawText = result.response.text().trim();

      if (!rawText) {
        throw new GeminiError("Empty text response", "EMPTY_RESPONSE", 502, false, null);
      }

      const start = rawText.indexOf("{");
      const end = rawText.lastIndexOf("}");

      if (start === -1 || end === -1) {
        logger.error("❌ Invalid Gemini response - no JSON object found:", rawText);
        throw new GeminiError("Gemini did not return valid JSON", "INVALID_JSON", 502, false, null);
      }

      const jsonStr = rawText.slice(start, end + 1);

      try {
        const parsed = JSON.parse(jsonStr);

        if (!parsed || typeof parsed !== "object") {
          throw new GeminiError("Parsed JSON is not an object", "MALFORMED_JSON", 502, false, null);
        }

        return parsed;
      } catch (err) {
        if (err instanceof GeminiError) throw err;
        logger.error("❌ JSON parse error:", err, "\nRaw:", rawText);
        throw new GeminiError("Gemini returned malformed JSON", "MALFORMED_JSON", 502, false, err);
      }
    } catch (error) {
      lastError = error instanceof GeminiError ? error : classifyError(error);

      if (!lastError.retryable) {
        throw lastError;
      }

      const message = String(lastError.message ?? "").toLowerCase();
      const reason = message.includes("high demand") ? "high demand" : "Service Unavailable";
      logger.info(`Switching to fallback model: ${modelName} due to ${reason}`);
    }
  }

  throw lastError;
}

module.exports = {
  analyzeWithGemini,
  GeminiError,
  isGeminiError,
};