/**
 * analysisRoutes.js
 *
 * Routes:
 * - POST /api/analyze (PROTECTED - requires Supabase authentication)
 * - GET  /api/analyses (PROTECTED - returns only user's analyses)
 * - GET  /api/analyses/:id (PROTECTED - returns only user's analysis)
 * - DELETE /api/analyses/:id (PROTECTED - deletes only user's analysis)
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/analysisController');
const analysisValidation = require('../middleware/validation/analysisValidation');
const { analysisLimiter, dashboardLimiter, historyLimiter, reportLimiter } = require('../middleware/rateLimiter');
const { cleanupUploadedFile } = require("../utils/uploadCleanup");

// POST analyze: PROTECTED - requires authentication
router.post('/analyze', authMiddleware, analysisLimiter, (req, res, next) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      // Return JSON error for unsupported file types
      const message = err.message || 'Only PDF (.pdf) and Word (.docx) files are supported.';
      const status = err.status || 400;
      cleanupUploadedFile(req.file?.path, "multer upload error").finally(() => {
        res.status(status).json({ error: message });
      });
      return;
    }
    next();
  });
}, analysisValidation, controller.analyze);

// GET list: PROTECTED - returns only authenticated user's analyses
router.get('/analyses', authMiddleware, dashboardLimiter, controller.listAnalyses);

// GET by id: PROTECTED - returns only authenticated user's analysis
router.get('/analyses/:id', authMiddleware, reportLimiter, controller.getAnalysis);

// DELETE: PROTECTED - deletes only authenticated user's analysis
router.delete('/analyses/:id', authMiddleware, historyLimiter, controller.deleteAnalysis);

module.exports = router;
