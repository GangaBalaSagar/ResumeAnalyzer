const mongoose = require("mongoose");
const logger = require("../utils/logger");
const { extractResumeText, ExtractionError, isExtractionError } = require("../services/extractText");
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

function mapExtractionErrorToStatus(error) {
  if (!isExtractionError(error)) return 400;
  switch (error.code) {
    case "EXTRACTION_TIMEOUT":
      return 408;
    case "TEXT_TOO_LONG":
      return 413;
    case "PASSWORD_PROTECTED":
    case "CORRUPTED_PDF":
    case "CORRUPTED_DOCX":
    case "TRUNCATED_PDF":
    case "EMPTY_FILE":
    case "EMPTY_DOCUMENT":
    case "UNSUPPORTED_TYPE":
    case "TOO_MANY_PAGES":
    case "FILE_NOT_FOUND":
    case "MISSING_FILEPATH":
      return 400;
    case "FILE_READ_ERROR":
    case "PDF_PARSE_ERROR":
    case "DOCX_PARSE_ERROR":
    case "INVALID_PDF_RESULT":
    case "INVALID_DOCX_RESULT":
    case "EXTRACTION_EMPTY":
      return 500;
    default:
      return 400;
  }
}

function getExtractionUserMessage(error) {
  if (!isExtractionError(error)) return "Failed to extract text from document";
  switch (error.code) {
    case "EXTRACTION_TIMEOUT":
      return "Document processing timed out. Please try a smaller file.";
    case "TEXT_TOO_LONG":
      return "The uploaded document contains too much text to analyze. Please use a shorter document.";
    case "PASSWORD_PROTECTED":
      return "Password-protected documents are not supported. Please remove protection and try again.";
    case "CORRUPTED_PDF":
      return "The PDF file appears to be corrupted. Please try a different file.";
    case "CORRUPTED_DOCX":
      return "The DOCX file appears to be corrupted. Please try a different file.";
    case "TRUNCATED_PDF":
      return "The PDF file is incomplete or truncated. Please try a different file.";
    case "EMPTY_FILE":
      return "The uploaded file is empty.";
    case "EMPTY_DOCUMENT":
      return "The document contains no extractable text.";
    case "UNSUPPORTED_TYPE":
      return "Unsupported file type. Please upload a PDF or DOCX file.";
    case "TOO_MANY_PAGES":
      return `Document exceeds maximum page limit (${error.details?.pageCount || '50'}). Please use a shorter document.`;
    case "FILE_NOT_FOUND":
    case "MISSING_FILEPATH":
      return "File not found. Please try uploading again.";
    case "FILE_READ_ERROR":
      return "Failed to read the uploaded file. Please try again.";
    default:
      return "Failed to extract text from document. Please try a different file.";
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
      if (isExtractionError(err)) {
        logger.error("Text extraction error:", { code: err.code, message: err.message, status: err.status, details: err.details });
        const status = mapExtractionErrorToStatus(err);
        return res.status(status).json({ error: getExtractionUserMessage(err) });
      }
      logger.error("Text extraction error:", err.message);
      return res.status(500).json({ error: "Failed to extract resume text" });
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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  const item = await Analysis.findOne({ _id: req.params.id, userId: req.user.id });

  if (!item) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  res.json(item);
}

async function deleteAnalysis(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  const item = await Analysis.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

  if (!item) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  res.json({ success: true });
}

module.exports = { analyze, listAnalyses, getAnalysis, deleteAnalysis };
