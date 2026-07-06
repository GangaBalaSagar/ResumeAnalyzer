PROJECT_MEMORY_TRANSFER.md
Resume Analyzer Pro - Project Memory Transfer
1. Project Overview
Aspect	Description
Purpose	Provide an AI‑powered service that compares a candidate’s resume to a job description, delivering an ATS match score, skill‑gap analysis, and concrete improvement suggestions.
Target Users	Job seekers of any experience level (students, career‑switchers, professionals) who want to optimise their resumes for specific roles.
Business Problem Solved	Reduces time spent manually tailoring resumes, improves ATS compatibility, and increases interview chances by delivering data‑driven, actionable feedback.
Scope	• Upload PDF/DOCX resumes (≤ 5 MB)  <br>• Paste any job description  <br>• AI analysis via Google Gemini  <br>• Store analysis history per user  <br>• Visual reports with charts and suggestions  <br>• Full user authentication/authorization via Supabase
What the Application Is	A full‑stack web application (React + Vite front‑end, Express + Node back‑end, MongoDB storage, Supabase auth, Gemini AI) delivering resume‑to‑job analysis with a modern glass‑morphism UI.
What the Application Is NOT	A generic CV builder, a full ATS system, nor a platform that stores or shares resumes with third parties. No server‑side rendering, no heavy data‑processing pipelines beyond the single AI call per analysis.
2. Current Project Status
Metric	Value
Overall Completion	≈ 90 % – Core features (upload, AI analysis, authentication, reporting, history) are functional and deployed locally.
Development Phase	Feature‑complete MVP; stability‑focused polishing, testing, and documentation remain.
Stability Assessment	Production‑ready core flows; known minor UI quirks on resize, limited automated test coverage.
Major Completed Milestones	• Secure authentication (Supabase)  <br>• File upload with validation (Multer)  <br>• PDF/DOCX text extraction (pdf‑parse, mammoth)  <br>• Gemini AI integration with retry‑fallback chain  <br>• Persisted analysis records in MongoDB  <br>• Dashboard, history, and report pages with chart visualisations  <br>• Rate‑limiting per endpoint group  <br>• Comprehensive UI styling (glassmorphism, dark theme)
Remaining Work	• Automated unit/integration tests (backend & frontend)  <br>• Dark‑mode toggle (currently fixed dark)  <br>• Better error UI for analysis failures  <br>• CI/CD pipeline setup  <br>• Documentation (this file) and developer onboarding scripts
3. Technology Stack
Layer	Technologies
Frontend	React 18, Vite, React‑Router v6, Axios, Chart.js + react‑chartjs‑2, custom CSS (glassmorphism)
Backend	Node 18, Express 4, Mongoose 7, Multer, pdf‑parse, mammoth, helmet, cors, express‑rate‑limit
Database	MongoDB Atlas (Mongoose ODM)
Authentication	Supabase (JWT verification on server, client SDK for sign‑up/in/forgot‑password)
AI Integration	Google Gemini (via @google/generative-ai SDK) – model chain gemini‑2.5‑flash → gemini‑2.0‑flash → gemini‑1.5‑flash
Security	Helmet headers, CORS whitelist, JWT auth, file‑type & size validation, rate limiting, environment‑based dev bypass
Deployment	Local dev (npm scripts) – ready for Render (backend) & Vercel (frontend) as described in README
Development Tools	Nodemon (dev server restart), dotenv (env loading), ESLint/Prettier not yet configured, Git for version control
4. Application Architecture
┌─────────────────────────────────────────────────────────────┐
│                         Client (React)                     │
│  ──► UI Components (UploadBox, JobDescriptionInput,…)       │
│  ──► React Router (PublicLayout, AppLayout, ProtectedRoute)│
│  ──► Contexts (AuthContext, AuthModalContext, ReportContext)│
│  ──► Axios instance (api.jsx) with JWT interceptor          │
│  ──► Supabase SDK (auth)                                    │
│  ──► Calls → /api/* endpoints                               │
└───────────────▲───────────────────────▲───────────────────────┘
                │                       │
                │   HTTP (JSON + multipart/form‑data)   │
                ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     Server (Express)                        │
│  ──► Middleware Stack: helmet → cors → rateLimiter → auth   │
│  ──► Multer (file upload → ./uploads)                      │
│  ──► Route: /api/analyze → controller.analyze             │
│        ↳ extractResumeText (pdf‑parse / mammoth)            │
│        ↳ analyzeWithGemini (prompt → Gemini SDK)          │
│        ↳ persist Analysis (Mongoose)                        │
│  ──► Routes: /api/analyses (list, get, delete)             │
│  ──► Error handling middleware (errorMiddleware)          │
│  ──► MongoDB connection (Mongoose)                         │
│  ──► Supabase client (service‑role key) for JWT verification│
└─────────────────────────────────────────────────────────────┘
Data Flow
 1. User uploads a resume file and enters a job description (frontend).  
 2. Axios sends a POST /api/analyze with multipart/form-data.  
 3. authMiddleware validates the Supabase JWT and attaches req.user.  
 4. Multer writes the file to ./uploads.  
 5. extractResumeText reads the file, extracts raw text.  
 6. Gemini Service builds a strict JSON‑only prompt, calls the Gemini model chain, retries on 503/availability errors, parses the JSON response.  
 7. Analysis document is created in MongoDB (fields: userId, userEmail, resumeFilename, jobDescription, resumeText, matchPercent, matchedSkills, missingSkills, suggestions, scoreBreakdown, createdAt).  
 8. Backend returns the analysis ID; frontend stores it in ReportContext and navigates to the report page.  
 9. Report Page fetches /api/analyses/:id (JWT required) and renders charts, skill chips, suggestions, and highlighted JD.  
10. History page loads /api/analyses?page=1&limit=10 and displays past entries; delete calls /api/analyses/:id (DELETE).
Authentication Flow
- Frontend uses Supabase client to sign‑up / sign‑in.  
- Upon successful auth, Supabase returns an access token (session.access_token).  
- Axios request interceptor adds Authorization: Bearer <token> to each request.  
- Server’s authMiddleware calls supabase.auth.getUser(token); on success req.user = { id, email }.  
- If token is missing/invalid → 401. 401 responses trigger the Axios response interceptor to sign the user out and open the login modal.
AI Analysis Flow
- Prompt built with raw resume text & job description.  
- Model chain iterates over three Gemini models; on retryable errors (503 + “service unavailable” / “high demand”) switches to next model after exponential delay.  
- The response is trimmed to the first {…} JSON block, parsed, and returned.  
- If parsing fails, the request is aborted with a 502 error.
File Upload Flow
- Multer saves files to server/uploads.  
- Filenames are prefixed with a timestamp and sanitized.  
- Validation rejects non‑PDF/DOCX or > 5 MB files (error‑status 400).  
- Deleting an analysis also attempts to delete its file from the uploads folder.
Database Interactions
- Analysis.create() on new analysis.  
- Analysis.find(filter).sort(...).skip(...).limit(...) for paginated list.  
- Analysis.findById(id) & ownership check (item.userId === req.user.id).  
- Analysis.findByIdAndDelete(id) on delete.  
- Indexes: { userId: 1, createdAt: -1 } (compound) and { createdAt: -1 } (single) to optimise queries.
5. Folder Structure
ResumeAnalyzer/
├─ client/                         # Front‑end (React + Vite)
│  ├─ src/
│  │  ├─ api.jsx                  # Axios instance + interceptors
│  │  ├─ index.css / styles.css   # Global styling (dark theme, glassmorphism)
│  │  ├─ components/
│  │  │  ├─ navbar/Navbar.jsx
│  │  │  ├─ auth/AuthGate.jsx
│  │  │  ├─ analyze/UploadBox.jsx
│  │  │  ├─ analyze/JobDescriptionInput.jsx
│  │  │  ├─ analyze/ActionControls.jsx
│  │  │  ├─ results/ChartsSection.jsx
│  │  │  ├─ results/SkillsSection.jsx
│  │  │  ├─ results/SuggestionsSection.jsx
│  │  │  ├─ results/ScoreCard.jsx
│  │  │  ├─ AnalysisDetail.jsx
│  │  │  └─ … (modal, FAQ, landing, feature components)
│  │  ├─ pages/
│  │  │  ├─ public/Landing.jsx
│  │  │  ├─ public/Features.jsx
│  │  │  ├─ public/FAQ.jsx
│  │  │  ├─ app/Analyze.jsx, Dashboard.jsx, History.jsx, Report.jsx, Account.jsx
│  │  │  └─ auth/Login.jsx, Signup.jsx, ForgotPassword.jsx, ResetPassword.jsx
│  │  ├─ context/
│  │  │  ├─ AuthContext.jsx
│  │  │  ├─ AuthModalContext.jsx
│  │  │  └─ ReportContext.jsx
│  │  ├─ data/
│  │  │  ├─ landing.js
│  │  │  ├─ features.js
│  │  │  └─ faq.js
│  │  ├─ services/
│  │  │  └─ supabase/client.js
│  │  ├─ layouts/
│  │  │  ├─ PublicLayout.jsx
│  │  │  └─ AppLayout.jsx
│  │  └─ demoReport.json          # Demo data for unauthenticated view
│  ├─ public/
│  │  └─ assets/ (preview images)
│  ├─ vite.config.js
│  ├─ package.json
│  └─ .gitignore
└─ server/                         # Back‑end (Express)
   ├─ server.js                    # Entry point, sets up Express, DB, routes
   ├─ config/index.js               # Env‑derived config (port, DB URI, CORS)
   ├─ middleware/
   │   ├─ authMiddleware.js        # Supabase JWT verification
   │   ├─ upload.js                # Multer config + file‑type/size filter
   │   ├─ validation/analysisValidation.js
   │   ├─ rateLimiter.js           # express-rate-limit per endpoint group
   │   └─ errorMiddleware.js       # Central error formatter
   ├─ routes/analysisRoutes.js      # /api/* routes (analyze, list, get, delete)
   ├─ controllers/analysisController.js
   ├─ services/
   │   ├─ extractText.js           # PDF & DOCX text extraction
   │   └─ geminiService.js         # Gemini prompt builder, retry logic
   │   └─ (future services…)       
   ├─ models/Analysis.js           # Mongoose schema
   ├─ utils/logger.js              # Simple console logger
   ├─ uploads/                     # Persisted uploaded resumes
   ├─ .env.sample
   ├─ package.json
   └─ README.md
Responsibility Summary
- client: UI, routing, authentication flow, API consumption, state management.
- server: API surface, security middleware, data persistence, AI orchestration, file handling.
- uploads/: Temporary storage for raw resumes; cleaned on analysis deletion.
- data/: Static content for public pages (landing, features, FAQ).
6. Core Features
Feature	Implementation Details
Authentication	Supabase JS SDK on client (supabase.auth.signUp, signInWithPassword, resetPasswordForEmail). Server validates JWT via supabase.auth.getUser.
Resume Upload	Multer middleware (upload.single('file')) with MIME & extension whitelist (application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document) and 5 MB size limit.
PDF Parsing	pdf-parse reads file buffer and returns .text.
DOCX Parsing	mammoth.extractRawText extracts plaintext from .docx files.
AI Analysis	geminiService.analyzeWithGemini builds prompt (resume + JD) and expects pure JSON with fields match_percent, matched_skills, missing_skills, suggested_changes, score_breakdown. Uses model chain with retry on 503/High‑Demand errors.
ATS Score	Numeric matchPercent (0‑100) stored in DB and displayed as pie chart.
Charts	react-chartjs-2 renders a Pie chart (match vs gap) and a Bar chart (matched vs missing skill counts).
History	/api/analyses endpoint provides paginated list; UI shows in PastAnalysesList. Delete action removes DB record and associated file.
Dashboard	Summarises total analyses, average ATS score, latest analysis snapshot, and quick navigation actions.
Account Management	Account.jsx displays profile metadata from Supabase user metadata, allows password reset (via /forgot-password) and logout.
Public Pages	Landing, Features, FAQ – all content sourced from client/src/data/*.js.
Report Viewing	Report.jsx loads analysis (/api/analyses/:id) and renders AnalysisDetail with charts, skill chips, suggestions, and job‑description highlight.
Demo Report for Guests	Unauthenticated users see a static demo (demoReport.json).
Rate Limiting	express-rate-limit defines per‑endpoint limits (auth 5/15 min, analysis 15/1 h, dashboard/history/report 300/15 min, etc.). Development environment bypasses limits.
Security	Helmet headers, strict CORS (allowed origins from env or defaults), JWT verification, file validation, error handling, no exposure of stack traces in prod.
Error Handling	Central errorMiddleware returns JSON error with stack trace only in non‑production. Frontend shows user‑friendly messages.
State Persistence	ReportContext stores the currently selected analysis ID in sessionStorage for navigation between pages.
Pending Action Queue	AuthModalContext allows actions that require auth to be saved (setPendingAction) and replayed after login.
Responsive UI	CSS grid/flex layouts adjust for mobile; glass‑morphism styling throughout.
7. API Documentation
Method	Route	Auth	Request	Response
POST	/api/analyze	Required (Bearer JWT)	multipart/form-data<br>• file – PDF/DOCX (≤5 MB)<br>• jobDescription – plain text	200 OK → { id: "<analysisId>", analysis: { …fullAnalysisDocument } }<br>Errors: 400 (missing file / JD / extraction failure), 502 (Gemini error), 401 (auth), 429 (rate‑limit)
GET	/api/analyses	Required	Query params: page (default 1), limit (default 10, max 100)	200 OK → { items: [analysis], pagination: { page, limit, totalItems, totalPages, hasNext, hasPrevious } }
GET	/api/analyses/:id	Required	–	200 OK → full analysis document (same shape as stored).<br>Errors: 404 (not found or not owned), 401, 429
DELETE	/api/analyses/:id	Required	–	200 OK → { success: true }<br>Errors: 404, 401, 429
GET	/api/health	None	–	200 OK → { ok: true, time: "<ISO‑timestamp>" }
All responses are JSON. Errors contain { error: "<message>" } (and stack trace only when NODE_ENV !== "production").
8. Database Design
Collection: analyses
Field	Type	Description	Required
_id	ObjectId	MongoDB primary key	–
userId	String	Supabase UUID of the owner	✔
userEmail	String	Owner email (snapshot)	✔
resumeFilename	String	Stored filename in uploads/	✔
jobDescription	String	Raw JD text submitted by user	✔
resumeText	String	Extracted plain‑text resume	✔
matchPercent	Number (0‑100)	ATS match percentage	✔
matchedSkills	[String]	Skills present in both resume & JD	✔
missingSkills	[String]	Skills present in JD but not resume	✔
suggestions	Mixed (String or Array)	AI‑generated improvement text	✔
scoreBreakdown	Mixed (Object)	Detailed scores (e.g., skills, experience, keywords)	✔
createdAt	Date	Creation timestamp (default Date.now)	✔
Indexes
- { userId: 1, createdAt: -1 } – optimises “list a user’s analyses, newest first”.
- { createdAt: -1 } – supports generic sort queries.
Relationships
- One‑to‑many: User → Analyses (via userId). No foreign‑key constraints; ownership checked in controller (item.userId === req.user.id).
9. Authentication System
1. Signup – supabase.auth.signUp({ email, password, options: { data: metadata } }). After successful sign‑up, the user is signed out (service‑role key) to force a fresh login, then redirected to login page.
2. Login – supabase.auth.signInWithPassword. Returns a session containing access_token.
3. JWT Verification (Backend) – authMiddleware extracts Bearer <token> header, calls supabase.auth.getUser(token). On success attaches { id, email } to req.user; otherwise response 401.
4. Protected Routes – All /api/analyses* routes declare authMiddleware. The UI uses ProtectedRoute to guard SPA routes.
5. Session Handling (Frontend) – AuthProvider subscribes to onAuthStateChange to keep user & session in React state. setupApiInterceptor adds the Authorization header automatically.
6. Password Reset – ForgotPassword sends reset email via supabase.auth.resetPasswordForEmail. ResetPassword validates recovery session, updates password, signs out the temporary session, and redirects to login.
7. Logout – Calls supabase.auth.signOut(); client clears state; server automatically rejects subsequent requests (401).
10. AI Integration
Aspect	Details
SDK	@google/generative-ai – creates GoogleGenerativeAI instance using GEMINI_API_KEY.
Prompt	Template includes explicit instructions to return only valid JSON with keys: match_percent, matched_skills, missing_skills, suggested_changes, score_breakdown. No explanatory text.
Model Chain	Attempts gemini‑2.5‑flash → gemini‑2.0‑flash → gemini‑1.5‑flash. Each fallback used if previous call returns a 503 with “service unavailable” or “high demand”.
Retry Logic	Delays of 2 s, 4 s, 8 s between retries (RETRY_DELAYS_MS). After exhausting the chain, the last error is thrown.
Response Validation	Extracts the first { and the last } from the model response, trims whitespace, parses JSON. On parse failure logs the raw response and returns a 502 error.
Error Handling	Propagates network & parsing errors up to the controller, which returns appropriate HTTP status (502).
Security	Prompt never includes user‑provided data that could break JSON format; all user input is interpolated verbatim but the model is forced to output strict JSON.
Result Structure	<aiResult> object shape aligns with the Analysis schema fields (match_percent → matchPercent, etc.).
11. Security
Mechanism	Implementation
HTTP Headers	helmet() sets CSP, HSTS, X‑Frame‑Options, etc.
CORS	Configured via config.cors.allowedOrigins. In production ALLOWED_ORIGINS must be set; development falls back to http://localhost:5173 and http://localhost:3000.
JWT Verification	Server‑side authMiddleware validates Supabase JWTs; unauthorized requests receive 401.
Rate Limiting	express-rate-limit creates per‑endpoint limiters (auth, signup, analysis, dashboard, history, report, general). Development requests bypass limits (isDevelopmentRequest).
File Validation	Multer fileFilter restricts MIME type and extension; size limited to 5 MB. Errors returned with status 400.
Error Sanitisation	errorMiddleware returns generic messages in production; stack traces only in non‑production.
Environment Variables	Sensitive creds (GEMINI_API_KEY, SUPABASE_SERVICE_ROLE_KEY) stored in .env; not committed.
Data Encryption	Supabase handles encryption at rest for auth data; uploaded resume files are stored on the server filesystem without additional encryption – this is a known limitation (documented under Known Issues).
Session Expiry	Axios response interceptor catches 401, signs out user, opens login modal, and stores a pending action.
Secure Links	Password reset links include the origin (window.location.origin) and are limited‑time via Supabase.
12. UI Structure
- Pages (src/pages/*) – Entry points for routes: public (Landing, Features, FAQ), auth (Login, Signup, Forgot, Reset), app (Analyze, Dashboard, History, Report, Account).
- Layouts – PublicLayout (navbar + footer) and AppLayout (navbar + placeholder sidebar + main outlet).
- Routing – AppRoutes.jsx defines routes, uses ProtectedRoute for dashboard/account, and useApiAuth hook to silently refresh auth status.
- Navigation – Navbar.jsx provides top‑level navigation links; active state styling applied.
- Contexts – AuthContext (user/session), AuthModalContext (modal navigation & pending actions), ReportContext (current report ID persisted in sessionStorage).
- State Management – React useState, useEffect, useMemo; no external state library.
- Components – Small, purpose‑focused components (UploadBox, JobDescriptionInput, ActionControls, ChartsSection, SkillsSection, SuggestionsSection, ScoreCard, AnalysisDetail, PastAnalysesList, HistoryItem, DeleteConfirmation, ConfirmationModal, various landing/feature/FAQ UI blocks).
- Hooks – useApiAuth (auto‑fetches session on mount), useAuthGate (requires auth, saves pending action).
- Styling – Global CSS (styles.css) defines colour tokens, layout grids, glass‑morphism effects, responsive breakpoints, component utility classes (.card, .btn, .chip, etc.).
- Responsiveness – CSS grid/flex adapt to viewport widths (e.g., .analysis-grid switches to single column on ≤ 1200 px).
13. Public Website
- Landing Page (/) – Hero → Trust Bar → Product Intro → How It Helps → Capabilities → Benefits → Process Steps → Final CTA. Content sourced from data/landing.js.
- Features Page (/features) – Hero → Product Overview → Core Capabilities (six cards) → Final CTA. Data from data/features.js.
- FAQ Page (/faq) – Intro, popular questions (POPULAR_QUESTIONS), accordion categories (FAQ_CATEGORIES), and a “Need More Help?” CTA linking to signup/login.
- Marketing Goals – Explain value proposition, build trust (security, AI, speed), encourage account creation, and provide clear calls‑to‑action (Analyze, Sign Up). All copy is user‑facing and does not expose internal implementation details.
14. Business Rules (Non‑Negotiable)
 1. API Contract – All /api/analyses* endpoints must remain protected, accept/return JSON as defined. Changing request/response shapes requires a version bump. |
 2. Database Schema – Fields in Analysis cannot be renamed or removed without migration. Additional fields may be added but must not alter existing ones. |
 3. Authentication Flow – JWTs are mandatory for any analysis‑related request. The token must be sent via Authorization: Bearer <token> header. |
 4. File Handling – Only PDF and DOCX files ≤ 5 MB may be accepted. Any deviation must result in a 400 error and not be stored. |
 5. Ownership Checks – Users may only access or delete analyses where analysis.userId === req.user.id. |
 6. Rate Limits – Must not be disabled in production; limits defined in rateLimiter.js are enforced. |
 7. AI Prompt – Must always request pure JSON as specified; included in geminiService.buildPrompt. |
 8. Error Responses – Must never expose internal stack traces in production (errorMiddleware). |
 9. Routing Paths – Frontend route names (/app/analyze, /app/report, etc.) and API prefixes (/api/...) must be kept in sync. |
10. Static Data – Content for public pages must only be edited via the data/*.js files. |
11. Session Persistence – ReportContext ID stored in sessionStorage must be cleared on logout to avoid cross‑user leakage. |
12. Security – No changes that would expose uploaded resume files publicly (e.g., serve /uploads statically) are allowed. |
15. Current Known Issues
Issue	Location	Details
Resume files stored unencrypted	server/uploads/	Files are saved to the local filesystem without encryption; they are only protected by server file‑system permissions.
No automated test suite	—	No unit or integration tests exist for either backend or frontend; manual testing only.
Fixed dark theme	CSS (styles.css)	No toggle to switch to light mode.
Potential race condition when deleting analysis	analysisController.deleteAnalysis	File deletion is best‑effort; failure to delete the file does not abort the DB deletion.
ErrorBoundary navigation bug	ErrorBoundary.jsx – fallback uses useNavigate inside a non‑hook context (invalid React hook usage, though not currently triggered).	 
Missing pagination UI	Dashboard/History – pagination controls not exposed; only first page (limit 10) is fetched.	 
No backend validation of jobDescription length	analysisValidation.js only checks non‑empty; extremely long JD may cause performance issues.	 
Hard‑coded client API base URL	client/.env (not committed) – must match server URL; mismatches cause CORS failures.	 
Upload directory may not be cleaned	Deleted analyses only remove their own file; orphan files could accumulate if analysis creation fails after upload.	 
Supabase service‑role key exposure risk	server/.env.sample shows placeholder; real key must remain secret.	 
Limited error messages from Gemini	When Gemini returns malformed JSON, only a generic “Gemini did not return valid JSON” is sent.	 
All entries are derived from the current source code; no assumptions beyond the repository.
16. Development Roadmap
Phase	Goal	Status
Completed	Core MVP – upload, analysis, reporting, auth, history, rate limiting.	✅
In Progress	• Add automated test suite (Jest + Supertest for backend, React Testing Library for frontend).<br>• Implement dark‑mode toggle with CSS variables.<br>• Refactor error handling to provide richer user feedback (e.g., Gemini parse errors).	🚧
Future	• Encrypt uploaded resume files at rest (e.g., using crypto or a cloud storage bucket with server‑side encryption).<br>• CI/CD pipelines (GitHub Actions) for lint, test, build, and deploy to Render/Vercel.<br>• Add pagination UI + infinite scroll for history.<br>• Provide export of analysis reports (PDF/HTML).<br>• Introduce role‑based access (admin panel for usage analytics).<br>• Migrate to TypeScript for stricter type safety.<br>• Internationalisation (i18n) support for UI strings.	🗓️
17. Code Quality Assessment
Aspect	Evaluation
Architecture	Clear separation: routes → controllers → services → models. Middleware handles cross‑cutting concerns (auth, rate‑limit, error). Frontend uses context + routing.
Maintainability	Files are modest in size; naming follows camelCase for functions, PascalCase for components. However, lack of type safety (no TypeScript) and missing tests reduce long‑term confidence.
Scalability	Backend stateless apart from MongoDB; can be scaled horizontally. Rate limiter is in‑memory; for scaling across instances a distributed store (Redis) would be needed.
Readability	Code is well‑commented (especially AI prompt, retry logic). Some redundancy exists (e.g., duplicate error handling in controller).
Separation of Concerns	Good: UI components are small; API logic is isolated. Auth logic lives in a dedicated context and middleware.
Production Readiness	Mostly ready: security headers, CORS, rate limiting, env‑based config. Missing elements: comprehensive tests, encrypted file storage, CI/CD, monitoring/logging beyond console.
Potential Risks	• Unencrypted stored resumes may violate data‑privacy expectations.<br>• Hard‑coded rate‑limit values may need tuning under load.<br>• Supabase service‑role key usage on server – ensure it never leaks.
18. Developer Notes
- Environment Setup  
1. Copy server/.env.sample to server/.env and fill in MongoDB URI, Gemini API key, Supabase URL & service‑role key.  
2. Create client/.env (or .env.local) with VITE_API_BASE_URL=http://localhost:5000 (or production URL) and Supabase keys (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).  
3. Run npm install in both server/ and client/.  
4. Start backend: npm run dev (nodemon).  
5. Start frontend: npm run dev (Vite).
- Naming Patterns  
- Files: camelCase for utilities (extractText.js), PascalCase for React components.  
- Functions: camelCase.  
- API routes: /api/<resource>.
- Folder Conventions  
- src/components/ – UI pieces, organised by feature (navbar, analyze, results).  
- src/pages/ – route‑level containers.  
- src/context/ – React context providers.  
- src/data/ – static content for marketing pages.
- Build Commands  
- Backend: npm run dev (development) → node server.js (production).  
- Frontend: npm run dev (dev), npm run build (production build to dist).
- Run Commands  
- npm run dev in each workspace (server/client).  
- Test MongoDB connection by running node -e "require('./server/models/Analysis')" after env vars are set.
- Debugging Tips  
- Server logs via logger.info/error (simple console).  
- Client network requests visible in browser devtools; auth token attached automatically.  
- If analysis fails, inspect server console for Gemini raw response (logged on error).
- Code Style  
- Use async/await consistently.  
- Prefer early returns for validation errors (if (!condition) return res.status(...).json({ error })).  
- Keep UI logic (state) inside components; avoid heavy computations in render.
- Versioning  
- Frontend version displayed in Account page (v1.0.0). Update package.json version when releasing.
19. AI Assistant Guidelines
1. Read Architecture First – Understand the separation of concerns (client ↔ server, auth flow, AI service) before modifying any file.  
2. Prefer Incremental Changes – Extend existing components/services rather than rewriting; keep API contracts intact.  
3. Preserve Backward Compatibility – Do not rename fields in the Analysis schema or change API routes without a version bump.  
4
▣  Build · GPT-OSS-120B · 3m 12s