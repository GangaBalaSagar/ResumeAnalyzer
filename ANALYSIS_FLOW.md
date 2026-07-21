# Analysis Flow

## 1. Purpose

```mermaid
flowchart TD
  Doc[ANALYSIS_FLOW.md] --> Scope[Resume analysis lifecycle]
  Scope --> Start[User starts an analysis]
  Start --> End[Final report is displayed and persisted]
```

This document describes the implemented lifecycle of a resume analysis from submission through extraction, Gemini processing, persistence, and report display. It focuses on one workflow only.

## 2. Analysis Lifecycle Overview

```mermaid
flowchart TD
  Start[Analyze page] --> Validate[Client validation]
  Validate --> Auth[Authenticated request]
  Auth --> Upload[Temporary file upload]
  Upload --> Extract[Server-side extraction]
  Extract --> Gemini[Gemini analysis]
  Gemini --> Store[MongoDB persistence]
  Store --> Report[Report display]
```

The analysis lifecycle starts on the Analyze page, moves through authenticated API processing, and ends when the saved report is rendered in the UI. The backend keeps the uploaded file temporary and deletes it after processing.

## 3. End-to-End Analysis Sequence

```mermaid
sequenceDiagram
  actor User
  participant Browser as Browser
  participant Frontend as React Frontend
  participant API as Express API
  participant AuthMW as Authentication Middleware
  participant Controller as Controller
  participant Extract as Document Extraction
  participant Gemini as Gemini
  participant MongoDB as MongoDB
  participant ReportUI as Frontend Report

  User->>Browser: Select resume and enter job description
  Browser->>Frontend: Submit analysis form
  Frontend->>Frontend: Validate file and job description
  Frontend->>API: POST /api/analyze with bearer token and file
  API->>AuthMW: Verify Supabase token
  AuthMW-->>API: Authenticated user or 401
  API->>Controller: Continue analysis request
  Controller->>Controller: Validate file signature
  Controller->>Extract: Extract text from PDF or DOCX
  Extract-->>Controller: Resume text or extraction error
  Controller->>Gemini: Build prompt and analyze resume text
  Gemini-->>Controller: Structured JSON analysis or Gemini error
  Controller->>MongoDB: Save analysis for authenticated user
  MongoDB-->>Controller: Saved analysis record
  Controller-->>Frontend: Return analysis id and analysis payload
  Frontend->>ReportUI: Set current report id and navigate to report
  ReportUI->>API: GET /api/analyses/:id when needed
  API->>AuthMW: Verify token for report fetch
  AuthMW-->>API: Authenticated user
  API-->>ReportUI: Saved analysis record
```

The browser submits the analysis request only after the frontend validation passes. The API authenticates the request, the controller runs extraction and Gemini analysis, MongoDB stores the result, and the frontend report displays the saved analysis.

## 4. Frontend Flow

```mermaid
flowchart TD
  Start[User on Analyze page] --> Pick[Select PDF or DOCX resume]
  Pick --> LocalValidate[Client-side file validation]
  LocalValidate --> JD[Enter job description]
  JD --> JDValidate[Check required text and length]
  JDValidate --> Guest{Signed in?}
  Guest -->|No| Modal[Sign-in modal]
  Guest -->|Yes| Request[Create FormData request]
  Request --> Interceptor[Axios auth interceptor adds bearer token]
  Interceptor --> Submit[POST /api/analyze]
  Submit --> Loading[Progress and staged reading UI]
  Loading --> Success[Store report id and navigate to report]
  Loading --> Failure[StatusSheet or inline error]
```

The frontend validates the selected file and job description before sending the request. If the user is not signed in, the Analyze page opens the sign-in modal instead of submitting. After a successful response, the page stores the report id and navigates to the report view.

## 5. Backend Flow

```mermaid
flowchart TD
  Request[POST /api/analyze] --> AuthMW[authMiddleware]
  AuthMW --> Upload[upload.single('file')]
  Upload --> RequestCheck[analysisValidation]
  RequestCheck --> Signature[validateFileSignature]
  Signature --> Extract[extractResumeText]
  Extract --> Gemini[analyzeWithGemini]
  Gemini --> Parse[JSON validation]
  Parse --> Save[Analysis.create]
  Save --> Cleanup[cleanupUploadedFile]
  Cleanup --> Response[Return analysis id and analysis]
```

The backend requires a valid Supabase bearer token before it accepts the upload. It validates the request body, checks the uploaded file signature, extracts text, runs Gemini analysis, stores the result in MongoDB, and cleans up the temporary file in both success and failure paths.

## 6. Analysis Pipeline

```mermaid
flowchart TD
  Upload[Resume upload] --> Validate[Request validation]
  Validate --> Temp[Temporary storage on disk]
  Temp --> Signature[File signature validation]
  Signature --> Extract[PDF or DOCX extraction]
  Extract --> Prompt[Prompt construction]
  Prompt --> Gemini[Gemini model chain]
  Gemini --> JSON[JSON structure validation]
  JSON --> Persist[MongoDB persistence]
  Persist --> Response[Analysis response]
```

The implemented pipeline processes one uploaded resume at a time. PDF extraction uses `pdf-parse`; DOCX extraction uses `mammoth`. Gemini returns structured JSON, which the controller parses before persisting the analysis record.

## 7. Error & Recovery Flow

```mermaid
flowchart TD
  Start[Analysis request] --> Check{Where did it fail?}
  Check -->|Client validation| Inline[Inline validation error]
  Check -->|Authentication| Login[Redirect to login or session expiry notice]
  Check -->|Upload| UploadErr[Upload error response]
  Check -->|Signature or extraction| ExtractErr[Extraction status sheet]
  Check -->|Gemini| GeminiErr[Gemini status sheet]
  Check -->|Report load| ReportErr[Report status sheet]
  Inline --> Retry[Edit and retry]
  Login --> Retry
  UploadErr --> Retry
  ExtractErr --> Retry
  GeminiErr --> Retry
  ReportErr --> Retry
  Retry --> Cleanup[Temporary file cleanup when applicable]
```

Implemented recovery behavior includes client-side validation messages, guest sign-in prompting, API status sheets, retry actions, session-expiry handling, and guaranteed cleanup of temporary uploads. Gemini failures are classified and mapped to user-facing error states. Retryable provider failures trigger the configured model fallback path before the request fails.

## 8. Data Produced

```mermaid
flowchart TD
  Inputs[Resume + job description] --> AnalysisRecord[MongoDB analysis record]
  AnalysisRecord --> Report[Saved report]
  AnalysisRecord --> History[History entry]
  AnalysisRecord --> Dashboard[Dashboard summary data]
  AnalysisRecord --> Score[Match percent]
  AnalysisRecord --> Skills[Matched and missing skills]
  AnalysisRecord --> Suggestions[Suggestions]
  AnalysisRecord --> Breakdown[Score breakdown]
```

The analysis lifecycle produces a persisted analysis record and UI-visible outputs derived from that record. The stored analysis includes the match percent, matched skills, missing skills, suggestions, score breakdown, the original job description, the extracted resume text, the user identity, and the uploaded filename.

## 9. Related Components

```mermaid
flowchart LR
  subgraph Frontend
    Analyze[Analyze.jsx]
    Report[Report.jsx]
    Dashboard[Dashboard.jsx]
    History[History.jsx]
    AuthCtx[AuthContext]
    ReportCtx[ReportContext]
    Api[api.js]
    Hook[useApiAuth]
  end

  subgraph Backend
    Routes[analysisRoutes.js]
    AuthMW[authMiddleware.js]
    Upload[upload.js]
    Validation[analysisValidation.js]
    Controller[analysisController.js]
    Extract[extractText.js]
    Gemini[geminiService.js]
    Model[Analysis.js]
  end

  Analyze --> Api
  Report --> Api
  Dashboard --> Api
  History --> Api
  Hook --> Api
  Api --> Routes
  Routes --> AuthMW
  Routes --> Upload
  Routes --> Validation
  Routes --> Controller
  Controller --> Extract
  Controller --> Gemini
  Controller --> Model
```

The analysis lifecycle involves the Analyze, Report, Dashboard, and History pages on the frontend, the shared Axios client and auth hook, and the backend route, middleware, controller, extraction, Gemini, and model modules.

## 10. Summary

```mermaid
flowchart TD
  Start[User submits analysis] --> Frontend[Frontend validates and sends request]
  Frontend --> Backend[Backend authenticates and processes upload]
  Backend --> AI[Gemini produces structured analysis]
  AI --> DB[MongoDB stores analysis]
  DB --> Report[Report is displayed]
```

The implemented analysis workflow validates input in the browser, authenticates the request on the API, extracts resume text on the server, runs Gemini analysis, stores the result in MongoDB, and returns the saved analysis for report display.
