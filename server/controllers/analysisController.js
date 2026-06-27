const fs = require("fs");
const path = require("path");
const { extractResumeText } = require("../services/extractText");
const { analyzeWithGemini } = require("../services/geminiService");
const Analysis = require("../models/Analysis");

async function analyze(req, res) {
  console.log("📥 /api/analyze called");
  console.log("Authenticated User:", req.user);

  try {
    console.log("🔎 Body:", req.body);
    console.log("📄 File:", req.file);

    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ error: "Resume file is required" });
    }

    const jobDescription = req.body.jobDescription;
    if (!jobDescription?.trim()) {
      console.log("❌ No job description provided");
      return res.status(400).json({ error: "Job description is required" });
    }

    // Extract text
    let resumeText = "";
    try {
      resumeText = await extractResumeText(req.file.path, req.file.mimetype);
      console.log("📝 Extracted resume text length:", resumeText.length);
    } catch (err) {
      console.log("❌ Text extraction error:", err.message);
      return res.status(400).json({ error: "Failed to extract resume text" });
    }

    // Call Gemini
    console.log("🤖 Calling Gemini...");
    let aiResult;
    try {
      aiResult = await analyzeWithGemini({ resumeText, jobDescription });
      console.log("🤖 Gemini success:", aiResult);
    } catch (err) {
      console.error("❌ FULL Gemini error:", err);
      return res.status(502).json({ error: "AI analysis failed", details: err.message });
    }

    // Save to DB
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
      scoreBreakdown: aiResult.score_breakdown ?? {}
    });

    console.log("💾 Saved Analysis ID:", analysis._id);

    return res.json({ id: analysis._id, analysis });
  } catch (err) {
    console.error("❌ Controller Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function listAnalyses(req, res) {
  console.log(`📋 Listing analyses for user: ${req.user.email}`);
  const items = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
  console.log(`✅ Found ${items.length} analyses`);
  res.json({ items });
}

async function getAnalysis(req, res) {
  console.log(`🔍 Fetching analysis ${req.params.id} for user: ${req.user.email}`);
  const item = await Analysis.findById(req.params.id);
  
  // Check if analysis exists AND belongs to the authenticated user
  if (!item || item.userId !== req.user.id) {
    console.log("❌ Analysis not found or not owned by user");
    return res.status(404).json({ error: "Analysis not found" });
  }
  
  console.log("✅ Analysis found and user is owner");
  res.json(item);
}

async function deleteAnalysis(req, res) {
  console.log(`🗑️  Deleting analysis ${req.params.id} for user: ${req.user.email}`);
  const item = await Analysis.findById(req.params.id);
  
  // Check if analysis exists AND belongs to the authenticated user
  if (!item || item.userId !== req.user.id) {
    console.log("❌ Analysis not found or not owned by user");
    return res.status(404).json({ error: "Analysis not found" });
  }
  
  // Delete the document
  await Analysis.findByIdAndDelete(req.params.id);

  // Delete the associated file
  const filePath = path.join(__dirname, "..", "uploads", item.resumeFilename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  console.log("✅ Analysis deleted");
  res.json({ success: true });
}

module.exports = { analyze, listAnalyses, getAnalysis, deleteAnalysis };
