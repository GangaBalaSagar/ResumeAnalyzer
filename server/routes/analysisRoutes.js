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

// POST analyze: PROTECTED - requires authentication
router.post('/analyze', authMiddleware, (req, res, next) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      // Return JSON error for unsupported file types
      const message = err.message || 'Only PDF (.pdf) and Word (.docx) files are supported.';
      const status = err.status || 400;
      return res.status(status).json({ error: message });
    }
    next();
  });
}, controller.analyze);

// GET list: PROTECTED - returns only authenticated user's analyses
router.get('/analyses', authMiddleware, controller.listAnalyses);

// GET by id: PROTECTED - returns only authenticated user's analysis
router.get('/analyses/:id', authMiddleware, controller.getAnalysis);

// DELETE: PROTECTED - deletes only authenticated user's analysis
router.delete('/analyses/:id', authMiddleware, controller.deleteAnalysis);

module.exports = router;
