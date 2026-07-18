const logger = require("../utils/logger");
const { extractResumeText } = require("../services/extractText");
const { analyzeWithGemini } = require("../services/geminiService");
const Analysis = require("../models/Analysis");
const { cleanupUploadedFile } = require("../utils/uploadCleanup");

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
      logger.error("Gemini error:", err);
      return res.status(502).json({ error: "AI analysis failed", details: err.message });
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
