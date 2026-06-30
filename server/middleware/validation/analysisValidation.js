/**
 * Validation middleware for the Analyze endpoint.
 * Ensures a resume file is provided and a non‑empty job description exists.
 * Trims whitespace from the job description.
 */
module.exports = function (req, res, next) {
  // Resume file must be present (uploaded via multer)
  if (!req.file) {
    return res.status(400).json({ error: "Resume file is required" });
  }

  const jobDescription = req.body?.jobDescription;
  if (!jobDescription?.trim()) {
    return res.status(400).json({ error: "Job description is required" });
  }

  // Trim whitespace for downstream processing
  req.body.jobDescription = jobDescription.trim();
  next();
};
