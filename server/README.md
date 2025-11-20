# Resume Analyzer Pro - Backend

This backend provides endpoints for analyzing resumes against job descriptions using a Generative AI (Gemini) model and storing analysis history in MongoDB Atlas.

## Features implemented in this step
- Express server with security middleware (helmet, CORS)
- File upload (multer) with validation (PDF/DOCX) and size limit (5 MB)
- Text extraction for PDF (pdf-parse) and DOCX (mammoth)
- Gemini service wrapper (placeholder) to call a generative model and get structured JSON
- Mongoose model `Analysis` for persistence
- Endpoints:
  - `POST /api/analyze` -- multipart/form-data: file (resume) + jobDescription (text)
  - `GET  /api/analyses` -- list saved analyses (supports `limit` & `page`)
  - `GET  /api/analyses/:id` -- retrieve a specific analysis
  - `DELETE /api/analyses/:id` -- delete a single analysis
- Basic rate-limiting with `express-rate-limit`

## How to run locally
1. Copy `.env.sample` to `.env` and fill required values:
   - `MONGODB_URI` — get from MongoDB Atlas (connection string)
   - `GEMINI_API_KEY` — your AI provider key (if any)
   - `GEMINI_API_URL` — the provider endpoint or your proxy
   - `ALLOWED_ORIGINS` — comma-separated origins allowed for CORS

2. Install dependencies:
   ```bash
   npm install
