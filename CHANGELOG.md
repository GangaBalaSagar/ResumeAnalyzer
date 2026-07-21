# Changelog

All notable changes to this project will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [Semantic Versioning](https://semver.org/).

## Navigation

[Documentation Home](docs/README.md) | [Previous Document](SECURITY.md) | [Next Document](CONTRIBUTING.md)

---

## [Unreleased]

- Nothing yet.

## [1.0.0] - 2026-07-18

First public release of Resume Analyzer.

### Added

- React/Vite frontend with public pages, auth screens, and protected app routes.
- Express backend with protected analysis endpoints and a `/api/health` check.
- Supabase authentication for sign up, sign in, password reset, and protected route access.
- Session expiry handling, inactivity handling, and cross-tab session synchronization.
- Temporary PDF and DOCX upload flow with server-side text extraction and cleanup.
- Gemini-based resume analysis with structured JSON output.
- MongoDB persistence for user analyses.
- Dashboard, report, history, and account pages.
- Route-specific rate limiting, request validation, Helmet, and CORS allowlisting.
- Client and server environment validation at startup.
- Screenshot assets and repository documentation for local setup and deployment.

### Changed

- Analysis files are stored temporarily and removed after processing instead of being retained.
- Public preview routes are separated from protected `/app/*` routes.
- The upload pipeline now validates file signatures before extraction.

### Security

- Protected analysis routes with Supabase JWT verification.
- Upload validation limited to PDF and DOCX files.
- 5 MB upload limit enforced on the server and client.
- Temporary file cleanup enforced on success and failure paths.

### Documentation

- Documented installation, environment variables, API routes, architecture, and deployment notes.

## Related Documents

- [Documentation Home](docs/README.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
