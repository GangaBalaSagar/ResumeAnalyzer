/**
 * Gemini 2.0 Flash - Production Integration
 * Uses official Google Generative AI Node SDK
 */





const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];
const RETRY_DELAYS_MS = [2000, 4000, 8000];

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

function shouldRetryGeminiError(error) {
  const status = error?.response?.status ?? error?.status;
  const message = String(error?.message ?? "").toLowerCase();

  const is503 = status === 503;
  const hasUnavailable = message.includes("service unavailable");
  const hasHighDemand = message.includes("high demand");

  return is503 && (hasUnavailable || hasHighDemand);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithModel(modelName, prompt) {
  const model = genAI.getGenerativeModel({ model: modelName });

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      if (attempt > 0) {
        console.log(`Retrying Gemini request (${attempt}/${RETRY_DELAYS_MS.length}) for ${modelName}`);
        await delay(RETRY_DELAYS_MS[attempt - 1]);
      }

      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      if (attempt === RETRY_DELAYS_MS.length || !shouldRetryGeminiError(error)) {
        throw error;
      }
    }
  }
}

async function analyzeWithGemini({ resumeText, jobDescription }) {
  const prompt = buildPrompt(resumeText, jobDescription);

  let lastError = null;

  for (const modelName of MODEL_CHAIN) {
    try {
      const result = await generateWithModel(modelName, prompt);
      const rawText = result.response.text().trim();

      // Extract JSON safely
      const start = rawText.indexOf("{");
      const end = rawText.lastIndexOf("}");

      if (start === -1 || end === -1) {
        console.error("❌ Invalid Gemini response:", rawText);
        throw new Error("Gemini did not return valid JSON");
      }

      const jsonStr = rawText.slice(start, end + 1);

      try {
        return JSON.parse(jsonStr);
      } catch (err) {
        console.error("❌ JSON parse error:", err, "\nRaw:", rawText);
        throw new Error("Gemini returned malformed JSON");
      }
    } catch (error) {
      lastError = error;
      const shouldRetry = shouldRetryGeminiError(error);

      if (!shouldRetry) {
        throw error;
      }

      const message = String(error?.message ?? "").toLowerCase();
      const reason = message.includes("high demand") ? "high demand" : "Service Unavailable";
      console.log(`Switching to fallback model: ${modelName} due to ${reason}`);
    }
  }

  throw lastError;
}

module.exports = { analyzeWithGemini };
