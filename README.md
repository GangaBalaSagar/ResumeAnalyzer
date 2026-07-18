<p align="center">
  <img src="client/public/favicon.svg" alt="Resume Analyzer logo" width="96" />
</p>

<h1 align="center">Resume Analyzer</h1>
<p align="center"><strong>AI-Powered ATS Resume Analysis Platform</strong></p>
<p align="center">
  Review a resume against a job description, generate structured AI feedback, and keep every analysis in a private archive.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black" alt="React badge" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite badge" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white" alt="Express badge" />
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js badge" />
  <img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB Atlas badge" />
  <img src="https://img.shields.io/badge/Supabase_Auth-3ECF8E?logo=supabase&logoColor=white" alt="Supabase Auth badge" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75FF?logo=google&logoColor=white" alt="Google Gemini badge" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" alt="MIT license badge" />
</p>

## Table of Contents

- [Live Demo](#live-demo)
- [Project Overview](#project-overview)
- [Why This Project?](#why-this-project)
- [Key Features](#key-features)
- [Application Screenshots](#application-screenshots)
- [Architecture](#architecture)
- [Resume Upload Lifecycle](#resume-upload-lifecycle)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Production Highlights](#production-highlights)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Live Demo

| Target | Status |
| --- | --- |
| Frontend | Not published yet |
| Backend | Not published yet |
| Demo Video | Not published yet |

## Project Overview

Resume Analyzer is a production-oriented web application for comparing a resume with a job description. It helps candidates understand fit, identify skill gaps, and revise their resumes with clear, structured feedback.

It exists to solve a simple problem:

- A resume is usually reviewed against a role with limited time.
- Job seekers need a faster way to understand fit before applying.
- Recruiters and hiring teams benefit from a consistent, readable analysis format.

What makes it different is the workflow:

- The resume is uploaded temporarily and never treated as permanent file storage.
- The server extracts resume text and sends only the extracted content to Gemini.
- The resulting analysis is saved privately per authenticated user in MongoDB.

## Why This Project?

Resume Analyzer was built to make resume screening more structured and more useful than a quick visual scan. It gives candidates a practical ATS-style review before they apply, and it gives reviewers a consistent format for seeing fit, gaps, and suggested improvements.

Temporary uploads were implemented so the application can process resumes without turning the browser experience into long-term file storage. That keeps the upload lifecycle narrow, reduces retention risk, and ensures only the extracted text and analysis result are persisted.

The backend follows a production-oriented shape because the workflow crosses several concerns at once: authentication, file handling, AI analysis, data persistence, and cleanup. Keeping those stages separate makes the system easier to secure, reason about, and maintain.

## Key Features

### Authentication

- Supabase-based sign up, sign in, and password reset
- Protected dashboard routes
- Session expiry and inactivity handling
- Cross-tab session sync

### Resume Analysis

- Upload PDF or DOCX resumes
- Require both a resume and a job description
- Extract text on the server before analysis
- Store results against the signed-in user

### AI

- Gemini-powered analysis of resume and role fit
- Structured JSON output for:
  - Match percentage
  - Matched skills
  - Missing skills
  - Suggested changes
  - Score breakdown
- Fallback model chain for analysis requests

### Dashboard

- Private dashboard for authenticated users
- Resume analysis history and summary views
- Account management and session details

### Archive

- Paginated archive of previous analyses
- Individual report view for each analysis
- Delete saved analyses from a private archive

### Security

- Supabase JWT validation on protected backend routes
- Helmet and CORS on the API server
- Rate limiting by route group
- Temporary file cleanup after upload processing

### Responsive Design

- Responsive public and authenticated layouts
- Mobile navigation
- Reusable paper-style UI primitives
- Built with Vite and React for fast local development

### Production Features

- Environment validation on client and server
- MongoDB persistence
- Automatic upload cleanup
- Health endpoint for backend checks

## Application Screenshots

The user will upload screenshots later. Add the relative image path for each section when the files are available.

### Landing Page

> Screenshot placeholder: add relative path here.

Caption: Public homepage and hero section.

### Features Page

> Screenshot placeholder: add relative path here.

Caption: Product feature overview.

### Analyze Resume

> Screenshot placeholder: add relative path here.

Caption: Resume upload and job description entry flow.

### Analysis Report

> Screenshot placeholder: add relative path here.

Caption: AI-generated match report and recommendations.

### Dashboard

> Screenshot placeholder: add relative path here.

Caption: Private workspace and recent activity.

### Archive

> Screenshot placeholder: add relative path here.

Caption: Saved analysis history and archive controls.

### Account

> Screenshot placeholder: add relative path here.

Caption: Profile, password, and session management.

### Authentication

> Screenshot placeholder: add relative path here.

Caption: Login, sign-up, and password reset flows.

## Architecture

```text
Browser (React + Vite)
        |
        v
Express REST API
        |
        v
Supabase JWT Verification
        |
        v
Temporary Resume Upload
        |
        v
Resume Text Extraction
 (pdf-parse / mammoth)
        |
        v
Google Gemini
        |
        v
Structured Analysis
        |
        v
MongoDB Atlas
        |
        v
Dashboard and Archive
```

### How the flow works

- Browser (React + Vite): renders the public site, auth screens, and authenticated app pages.
- Express REST API: accepts upload and archive requests, applies middleware, and coordinates the analysis flow.
- Supabase JWT Verification: protects authenticated routes before the backend processes user data.
- Temporary Resume Upload: stores the incoming file on disk only long enough for processing.
- Resume Text Extraction: uses `pdf-parse` for PDF files and `mammoth` for DOCX files.
- Google Gemini: compares the extracted resume text with the job description and returns structured JSON.
- Structured Analysis: normalizes the AI output into a shape the app can store and render.
- MongoDB Atlas: persists each analysis record per authenticated user.
- Dashboard and Archive: display the saved results in the private app experience.

## Resume Upload Lifecycle

```text
User uploads resume + job description
  ->
Temporary file stored on disk
  ->
Validation checks file type and required input
  ->
Text extraction from PDF or DOCX
  ->
Gemini analysis
  ->
MongoDB persistence
  ->
Temporary file cleanup
```

### Notes

- Resume files are stored temporarily during processing.
- The extracted text is what the AI analyzes.
- Temporary files are deleted after success or failure handling.
- The application does not rely on permanent resume file storage.
- This architecture is production friendly because it keeps the storage surface small, limits sensitive file retention, and leaves the database responsible only for structured analysis data.

## Technology Stack

| Area | Stack |
| --- | --- |
| Frontend | React, Vite, React Router, Framer Motion, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB Atlas via Mongoose |
| Authentication | Supabase Auth |
| AI | Google Gemini via `@google/generative-ai` |
| Charts | Recharts |
| Deployment | Static frontend build, Node/Express backend, MongoDB Atlas, Supabase |
| Security | Helmet, CORS, rate limiting, JWT validation |

## Folder Structure

```text
ResumeAnalyzer/
|-- README.md
|-- client/
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   |-- vite.config.js
|   |-- eslint.config.js
|   |-- jsconfig.json
|   |-- public/
|   |   `-- favicon.svg
|   `-- src/
|       |-- App.jsx
|       |-- api.js
|       |-- main.jsx
|       |-- styles.css
|       |-- components/
|       |   |-- app/
|       |   |-- auth/
|       |   |-- charts/
|       |   |-- hero/
|       |   |-- landing/
|       |   |-- public/
|       |   |-- ErrorBoundary.jsx
|       |   |-- ScrollToTop.jsx
|       |   `-- paper.jsx
|       |-- contexts/
|       |-- hooks/
|       |-- pages/
|       |   |-- app/
|       |   |-- auth/
|       |   |-- FAQ.jsx
|       |   |-- Features.jsx
|       |   |-- LandingV2.jsx
|       |   `-- NotFound.jsx
|       |-- routes/
|       |-- services/
|       `-- utils/
`-- server/
    |-- package.json
    |-- package-lock.json
    |-- server.js
    |-- config/
    |   `-- index.js
    |-- controllers/
    |   `-- analysisController.js
    |-- middleware/
    |   |-- authMiddleware.js
    |   |-- errorMiddleware.js
    |   |-- rateLimiter.js
    |   |-- upload.js
    |   `-- validation/
    |       `-- analysisValidation.js
    |-- models/
    |   `-- Analysis.js
    |-- routes/
    |   `-- analysisRoutes.js
    |-- services/
    |   |-- extractText.js
    |   `-- geminiService.js
    `-- utils/
        |-- envValidation.js
        |-- logger.js
        `-- uploadCleanup.js
```

## Installation

### Clone the repository

```bash
git clone <repo-url>
cd ResumeAnalyzer
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Run locally

- Start the backend first.
- Start the frontend in a second terminal.
- Open the Vite development URL in your browser.

## Environment Variables

### client/.env.example

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL for the backend API |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase public anonymous key |

### server/.env.example

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `JWT_SECRET` | Yes | Secret used for JWT-related server logic |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key for the server |
| `ALLOWED_ORIGINS` | Yes in production | Comma-separated list of allowed frontend origins |
| `PORT` | No | Backend port, defaults to `5000` |
| `NODE_ENV` | No | Runtime environment |
| `GEMINI_API_URL` | No | Optional Gemini endpoint override |

## API Overview

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/analyze` | Upload a resume and create a new analysis |
| `GET` | `/api/analyses` | List the signed-in user's analyses |
| `GET` | `/api/analyses/:id` | Fetch a single analysis by ID |
| `DELETE` | `/api/analyses/:id` | Delete one saved analysis |
| `GET` | `/api/health` | Backend health check |

## Production Highlights

- [x] Temporary Upload Pipeline
- [x] Automatic Upload Cleanup
- [x] MongoDB Persistence
- [x] Supabase Authentication
- [x] Protected Routes
- [x] Cross-Tab Session Synchronization
- [x] Environment Validation
- [x] Helmet Security
- [x] Rate Limiting
- [x] Responsive Design

## Deployment

This repository does not include Render or Vercel deployment manifests, so deployment is driven by the application code and environment variables that are already in the repo.

### Frontend

- Build the client with `npm run build` inside `client/`
- Deploy the generated `client/dist` directory to a static host
- Set the frontend environment variables in the hosted environment

### Backend

- Run the Express server from `server/server.js`
- Set the backend environment variables from `server/.env.example`
- Allow the backend to reach MongoDB Atlas and Supabase

### Database

- Use MongoDB Atlas or another MongoDB-compatible deployment
- Ensure the backend can connect from the deployed environment

### Environment Variables

- Keep frontend and backend secrets separate
- Never expose the Supabase service role key in the browser

## Roadmap

Realistic next steps for the current codebase:

- Resume comparison between multiple job descriptions
- PDF export for reports
- Interview preparation helpers based on analysis results
- Keyword heatmap in the report view
- Basic analytics for archive trends

## Contributing

The repository does not currently include a `CONTRIBUTING.md` file.

If you add one later, it should describe:

- Local setup
- Branching and commit conventions
- Testing expectations
- Pull request review guidelines

## Security

The repository does not currently include a `SECURITY.md` file.

If you add one later, it should describe:

- How to report vulnerabilities
- Expected response process
- Sensitive data handling

## License

The repository does not currently include a standalone `LICENSE` file.

The backend `package.json` declares the project license as MIT.
