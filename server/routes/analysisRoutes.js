/**
 * analysisRoutes.js
 *
 * Routes:
 * - POST /api/analyze
 * - GET  /api/analyses
 * - GET  /api/analyses/:id
 * - DELETE /api/analyses/:id
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/analysisController');

// POST analyze: single file under field name 'file'
router.post('/analyze', upload.single('file'), controller.analyze);

// GET list
router.get('/analyses', controller.listAnalyses);

// GET by id
router.get('/analyses/:id', controller.getAnalysis);

// DELETE
router.delete('/analyses/:id', controller.deleteAnalysis);

module.exports = router;
