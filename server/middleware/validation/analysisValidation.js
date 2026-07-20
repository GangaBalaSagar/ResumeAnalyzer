/**
 * Validation middleware for the Analyze endpoint.
 * Ensures a resume file is provided and a non-empty job description exists.
 * Trims whitespace from the job description.
 * Enforces a maximum length to prevent oversized payloads.
 */

const { cleanupUploadedFile } = require("../../utils/uploadCleanup");

const MAX_JOB_DESCRIPTION_LENGTH = 10000;

module.exports = async function (req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: "Resume file is required" });
  }

  const jobDescription = req.body?.jobDescription;
  if (typeof jobDescription !== "string" || !jobDescription.trim()) {
    await cleanupUploadedFile(req.file.path, "analysis validation");
    return res.status(400).json({ error: "Job description is required" });
  }

  const trimmed = jobDescription.trim();
  if (trimmed.length > MAX_JOB_DESCRIPTION_LENGTH) {
    await cleanupUploadedFile(req.file.path, "analysis validation");
    return res.status(400).json({ error: `Job description must be ${MAX_JOB_DESCRIPTION_LENGTH.toLocaleString()} characters or less` });
  }

  req.body.jobDescription = trimmed;
  next();
};
