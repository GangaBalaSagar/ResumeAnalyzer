const logger = require("../utils/logger");
const { extractResumeText } = require("../services/extractText");
const { analyzeWithGemini, GeminiError, isGeminiError } = require("../services/geminiService");
const Analysis = require("../models/Analysis");
const { cleanupUploadedFile } = require("../utils/uploadCleanup");

function mapGeminiErrorToStatus(error) {
  if (!isGeminiError(error)) return 502;
  switch (error.code) {
    case "INVALID_API_KEY":
      return 500;
    case "RATE_LIMITED":
      return 429;
    case "BAD_REQUEST":
    case "SAFETY_BLOCKED":
    case "INVALID_JSON":
    case "MALFORMED_JSON":
      return 400;
    case "MODEL_NOT_FOUND":
    case "SERVICE_UNAVAILABLE":
    case "UPSTREAM_ERROR":
    case "TIMEOUT":
    case "NETWORK_ERROR":
    case "EMPTY_RESPONSE":
    case "MISSING_RESPONSE_OBJECT":
    case "NO_CANDIDATES":
    case "EMPTY_CONTENT":
      return 502;
    default:
      return 502;
  }
}

function getUserFacingMessage(error) {
  if (!isGeminiError(error)) return "AI analysis failed";
  switch (error.code) {
    case "INVALID_API_KEY":
      return "AI service configuration error";
    case "RATE_LIMITED":
      return "Too many requests. Please try again later.";
    case "SAFETY_BLOCKED":
      return "Content was blocked by safety filters. Please try a different resume.";
    case "INVALID_JSON":
    case "MALFORMED_JSON":
      return "AI returned an invalid response. Please try again.";
    case "SERVICE_UNAVAILABLE":
    case "UPSTREAM_ERROR":
    case "TIMEOUT":
    case "NETWORK_ERROR":
      return "AI service temporarily unavailable. Please try again.";
    case "MODEL_NOT_FOUND":
      return "AI model unavailable. Please try again later.";
    default:
      return "AI analysis failed";
  }
}

async function analyze(req, res) {
  const filePath = req.file?.path;

  try {
    const jobDescription = req.body.jobDescription;

    let resumeText = "";
    try {
      resumeText = await extractResumeText(req.file.path, req.file.mimetype);
    } catch (err) {
      logger.error("Text extraction error:", err.message);
      return res.status(400).json({ error: "Failed to extract resume text" });
    }

    let aiResult;
    try {
      aiResult = await analyzeWithGemini({ resumeText, jobDescription });
    } catch (err) {
      logger.error("Gemini error:", { code: err?.code, message: err?.message, status: err?.status, retryable: err?.retryable });
      const status = mapGeminiErrorToStatus(err);
      return res.status(status).json({ error: getUserFacingMessage(err) });
    }

    const analysis = await Analysis.create({
      userId: req.user.id,
      userEmail: req.user.email,
      resumeFilename: req.file.filename,
      jobDescription,
      resumeText,
      matchPercent: aiResult.match_percent ?? 0,
      matchedSkills: aiResult.matched_skills ?? [],
      missingSkills: aiResult.missing_skills ?? [],
      suggestions: aiResult.suggested_changes ?? "",
      scoreBreakdown: aiResult.score_breakdown ?? {},
    });

    return res.json({ id: analysis._id, analysis });
  } catch (err) {
    logger.error("Controller error:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await cleanupUploadedFile(filePath, "analysis controller");
  }
}

async function listAnalyses(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = { userId: req.user.id };

  const [totalItems, items] = await Promise.all([
    Analysis.countDocuments(filter),
    Analysis.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  res.json({
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  });
}

async function getAnalysis(req, res) {
  const item = await Analysis.findById(req.params.id);

  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  res.json(item);
}

async function deleteAnalysis(req, res) {
  const item = await Analysis.findById(req.params.id);

  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  await Analysis.findByIdAndDelete(req.params.id);

  res.json({ success: true });
}

module.exports = { analyze, listAnalyses, getAnalysis, deleteAnalysis };
