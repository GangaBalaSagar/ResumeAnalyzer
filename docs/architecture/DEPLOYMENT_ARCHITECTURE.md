# Deployment Architecture

## Navigation

[Documentation Home](../README.md) | [Previous Document](DATABASE_SCHEMA.md) | [Next Document](UI_ARCHITECTURE.md)

---

## 1. Purpose

```mermaid
flowchart LR
  Doc[DEPLOYMENT_ARCHITECTURE.md] --> Topology[Production topology]
  Topology --> Services[Deployed services and communication]
  Topology --> Boundaries[Environment and security boundaries]
```

This document describes the production deployment topology used by Resume Analyzer and how the deployed services communicate. It does not provide deployment instructions.

## 2. Deployment Overview

```mermaid
flowchart LR
  Browser[Browser] --> Frontend[Static React frontend]
  Frontend --> API[Express API]
  API --> Supabase[Supabase Auth]
  API --> Gemini[Google Gemini]
  API --> MongoDB[MongoDB Atlas]
```

Resume Analyzer is deployed as two application surfaces plus external production services:

- A React frontend built with Vite and served as static assets.
- An Express API that handles authentication-gated analysis requests.
- Supabase for authentication.
- Google Gemini for analysis generation.
- MongoDB Atlas for persisted analysis records.

The repository does not include Vercel, Render, Docker, or similar deployment manifests.

## 3. Production Components

```mermaid
flowchart TD
  Frontend[Frontend] --> UI[Public pages, auth pages, app pages]
  API[Backend API] --> Routing[Protected analysis routes and health endpoint]
  Auth[Authentication] --> Sessions[Supabase sessions and JWT verification]
  DB[Database] --> Store[Analysis persistence]
  AI[AI provider] --> Analyze[Structured resume analysis]
```

**Frontend**

- Renders the public site and the authenticated application.
- Sends API requests through the shared Axios client.
- Manages Supabase session state, route access, and report navigation.

**Backend API**

- Receives the analysis upload request.
- Verifies Supabase access tokens.
- Handles upload validation, text extraction, Gemini analysis, persistence, reads, and deletes.
- Exposes the `/api/health` endpoint.

**Authentication**

- Supabase provides sign up, sign in, password reset, and session verification.
- The frontend stores and refreshes the user session.
- The backend validates bearer tokens on protected routes.

**Database**

- MongoDB Atlas stores completed analysis records.
- The backend persists one analysis document per successful request.

**AI Provider**

- Google Gemini generates the structured analysis payload from extracted resume text and the job description.

## 4. Request Flow

```mermaid
flowchart TD
  User[User] --> Browser[Browser]
  Browser --> Frontend[React frontend]
  Frontend --> Auth[Supabase session/token]
  Frontend --> API[POST /api/analyze]
  API --> AuthMW[JWT verification middleware]
  AuthMW --> Controller[Analysis controller]
  Controller --> Extract[Document extraction]
  Controller --> Gemini[Gemini analysis]
  Controller --> MongoDB[MongoDB Atlas]
  MongoDB --> Frontend[Analysis id and saved analysis]
  Frontend --> Report[Report view]
```

The production analysis request is initiated in the browser, authenticated by the API, processed on the backend, persisted in MongoDB, and then displayed in the report view.

## 5. Service Communication

```mermaid
flowchart LR
  Browser[Browser] --> Frontend[Frontend]
  Frontend --> API[Backend API]
  API --> Supabase[Supabase]
  API --> Gemini[Google Gemini]
  API --> MongoDB[MongoDB Atlas]
```

- **Browser to Frontend:** The browser loads the static frontend bundle and interacts with the React application.
- **Frontend to Backend:** The frontend sends authenticated requests to the Express API through the configured API base URL.
- **Backend to Supabase:** The backend verifies bearer tokens using Supabase authentication services.
- **Backend to Gemini:** The backend sends extracted resume text and the job description to Gemini for analysis.
- **Backend to MongoDB:** The backend stores and retrieves analysis records from MongoDB Atlas.

## 6. Environment Boundaries

```mermaid
flowchart TD
  FrontendEnv[Frontend environment] --> BrowserConfig[Vite client config and Supabase anon key]
  BackendEnv[Backend environment] --> ServerConfig[Express config and service credentials]
  BrowserConfig --> Frontend[React frontend]
  ServerConfig --> API[Express API]
```

Frontend and backend configuration are separated by runtime boundary:

- The frontend reads its own Vite environment values at build and browser runtime.
- The backend reads server environment values at process startup.
- The frontend uses the public Supabase anon key and backend API URL.
- The backend uses the MongoDB URI, Supabase service role credentials, Gemini API key, and production CORS allowlist.
- The repository does not define a shared deployment manifest; configuration is supplied separately for each runtime.

## 7. External Dependencies

```mermaid
flowchart TD
  Supabase[Supabase] --> Auth[Authentication and token verification]
  Gemini[Google Gemini] --> Analyze[Resume analysis generation]
  MongoDB[MongoDB Atlas] --> Store[Persistent analysis storage]
```

**Supabase**

- Purpose: authentication and session verification.
- Interaction: the frontend creates sessions; the backend verifies access tokens and fetches the current user.
- Failure impact: sign in, sign up, password reset, and all protected API requests fail.

**Google Gemini**

- Purpose: generate structured analysis from the extracted resume text and job description.
- Interaction: the backend calls Gemini from the analysis controller through the Gemini service.
- Failure impact: analysis requests fail or return a Gemini-specific error state.

**MongoDB Atlas**

- Purpose: store completed analysis records.
- Interaction: the backend creates, reads, and deletes analysis documents.
- Failure impact: dashboard, history, and report retrieval fail, and new analyses cannot be persisted.

## 8. Reliability Considerations

```mermaid
flowchart TD
  Health[GET /api/health] --> Ready[Basic process readiness]
  Upload[Temporary upload] --> Cleanup[cleanupUploadedFile]
  Gemini[Gemini service] --> Retry[Retryable model fallback]
  Routes[API routes] --> Limits[Route-specific rate limiting]
```

- The API exposes `/api/health` and returns a simple JSON readiness response.
- Temporary uploaded files are deleted after analysis success or failure paths.
- The Gemini service retries retryable failures and falls back across the configured model chain.
- The API applies route-specific rate limiting and a general API limiter.
- The server validates environment variables at startup and exits when required values are missing.

## 9. Security Boundaries

```mermaid
flowchart TD
  Browser[Browser] --> Frontend[Frontend]
  Frontend --> API[Express API]
  API --> CORS[CORS allowlist]
  API --> JWT[Supabase JWT verification]
  API --> AuthZ[User-scoped MongoDB queries]
```

- Authentication is based on Supabase bearer tokens.
- The backend verifies JWT-backed access before protected analysis and archive routes run.
- CORS is restricted by the configured frontend origin allowlist.
- The backend treats the API as the trust boundary for protected data access.
- MongoDB queries are filtered by authenticated user id so records remain user-scoped.
- The backend uses Helmet and no-cache headers on authenticated API responses.

## 10. Current Deployment Summary

```mermaid
flowchart LR
  Browser[Browser] --> Frontend[Static React frontend]
  Frontend --> API[Express API]
  API --> Supabase[Supabase Auth]
  API --> Gemini[Google Gemini]
  API --> MongoDB[MongoDB Atlas]
```

Resume Analyzer is deployed as a statically served React frontend backed by an Express API. The API is the production trust boundary for authentication, analysis processing, and persistence, while Supabase, Gemini, and MongoDB Atlas provide the external services required for the application to operate.

---

## Related Documentation

- [System Overview](SYSTEM_OVERVIEW.md)
- [Architecture](ARCHITECTURE.md)
- [Environment Configuration](../reference/ENVIRONMENT_CONFIGURATION.md)

