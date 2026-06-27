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
 *
 * Indexes:
 * - { userId: 1, createdAt: -1 } compound index — supports the primary
 *   listAnalyses query: filter by owner then sort by newest first.
 * - { createdAt: -1 } single-field index — covers any sort-only query path.
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

// Compound index: filter by user, sort by newest — covers listAnalyses perfectly
AnalysisSchema.index({ userId: 1, createdAt: -1 });

// Single-field index on createdAt for any sort-only paths
AnalysisSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Analysis', AnalysisSchema);

