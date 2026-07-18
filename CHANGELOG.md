# Changelog

All notable changes to this project will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Nothing yet.

### Changed

- Nothing yet.

### Fixed

- Nothing yet.

## [1.0.0] - 2026-07-18

This is the first public production release of Resume Analyzer. It introduces authenticated AI-powered resume analysis, a production-ready upload pipeline with automatic cleanup, MongoDB persistence, and a responsive React + Express architecture.

### Added

- Vite + React frontend with public pages, auth screens, dashboard views, and analysis/report/archive routes.
- Express backend with protected analysis endpoints and a `/api/health` check.
- Supabase authentication for sign in, sign up, password reset, and protected route access.
- Cross-tab session synchronization and session expiry handling.
- Resume upload flow for PDF and DOCX files.
- Server-side text extraction for uploaded resumes using `pdf-parse` and `mammoth`.
- Gemini-based resume analysis with structured JSON output.
- MongoDB persistence for user analyses.
- Private dashboard, report, history, and account pages.
- Reusable paper-style UI system and editorial landing pages.
- Browser favicon and metadata updates for the production frontend.

### Changed

- Introduced temporary file-based resume processing instead of permanent browser-side file storage.
- Organized the application around public and protected route groups.
- Centralized the analysis flow through a single Express route pipeline.

### Improved

- Added environment validation on both client and server startup.
- Added reusable app layout, auth layout, and error boundary handling.
- Added route-specific rate limiting and upload validation.
- Added temporary upload cleanup after success and failure paths.
- Added fallback model handling in the Gemini service.
- Added a cleaner production README and repository documentation.

### Security

- Protected analysis routes with Supabase JWT verification.
- Enabled Helmet on the Express server.
- Enabled CORS allowlist handling through server configuration.
- Added rate limiting for analysis and user-facing API routes.
- Restricted resume uploads to supported file types and size limits.

### Performance

- Kept resume uploads temporary so only extracted text and structured analysis results are persisted.
- Used a temporary upload architecture to avoid permanent resume storage and reduce server disk usage.
- Extracted resume text on the server before analysis so the AI receives only the content it needs.
- Automatically cleaned up uploaded files after processing to keep the workflow production-friendly.
- Used route-level throttling to reduce repeated analysis requests.
- Built the frontend with Vite for fast local development and production bundling.

### Documentation

- Rewrote the root `README.md` for the production release.
- Documented installation, environment variables, API routes, architecture, and resume processing flow.
- Added this changelog for the v1.0.0 release.

### Fixed

- Removed legacy landing page components that were no longer referenced by the live app.
- Simplified browser branding by adding the production favicon and updating page metadata.
