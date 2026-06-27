/**
 * Analysis model
 *
 * Fields:
 * - userId: String (Supabase user UUID)
 * - userEmail: String (Supabase user email)
 * - resumeFilename: String
 * - jobDescription: String
 * - resumeText: String
 * - matchPercent: Number
 * - matchedSkills: [String]
 * - missingSkills: [String]
 * - suggestions: Mixed (String or Array)
 * - scoreBreakdown: Mixed (object)
 * - createdAt: Date
 */

const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  resumeFilename: { type: String, required: true },
  jobDescription: { type: String, required: true },
  resumeText: { type: String, required: true },
  matchPercent: { type: Number, required: true, min: 0, max: 100 },
  matchedSkills: { type: [String], default: [] },
  missingSkills: { type: [String], default: [] },
  suggestions: { type: mongoose.Schema.Types.Mixed },
  scoreBreakdown: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
