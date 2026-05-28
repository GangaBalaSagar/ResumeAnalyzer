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

// IMPORTANT: this MUST MATCH exactly what your Google AI Studio shows
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

async function analyzeWithGemini({ resumeText, jobDescription }) {
  const prompt = buildPrompt(resumeText, jobDescription);

  console.log("🔑 Using Gemini Key (first 5 chars):", API_KEY?.slice(0,5));
console.log("🤖 Using model: gemini-2.5-flash");
console.log("📄 Prompt length:", prompt.length);

  const result = await model.generateContent(prompt);
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
}

module.exports = { analyzeWithGemini };
