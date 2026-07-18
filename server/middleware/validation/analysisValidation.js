/**
 * Validation middleware for the Analyze endpoint.
 * Ensures a resume file is provided and a non-empty job description exists.
 * Trims whitespace from the job description.
 */

const { cleanupUploadedFile } = require("../../utils/uploadCleanup");

module.exports = async function (req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: "Resume file is required" });
  }

  const jobDescription = req.body?.jobDescription;
  if (!jobDescription?.trim()) {
    await cleanupUploadedFile(req.file.path, "analysis validation");
    return res.status(400).json({ error: "Job description is required" });
  }

  req.body.jobDescription = jobDescription.trim();
  next();
};
