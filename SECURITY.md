# Security Policy

Resume Analyzer processes authenticated user data and uploaded resumes, so security and privacy matter at every stage of the workflow. This policy explains how to report issues, what the project supports, and the security practices contributors should follow.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x | Yes |
| < 1.0.0 | No |

## Reporting a Vulnerability

Do not open a public GitHub issue for a suspected security vulnerability.

Please report security concerns privately to `security@example.com`.

> NOTE: The repository owner should replace this placeholder before publishing.

When possible, include:

- A clear description of the issue
- Steps to reproduce
- Expected and actual impact
- Your environment details
- Screenshots, if relevant
- Logs or error output, if applicable

## Responsible Disclosure

We ask security researchers and contributors to give maintainers time to investigate and remediate issues before public disclosure. Please avoid sharing details publicly until a fix is available and disclosure has been coordinated.

## Security Features Implemented

The repository currently includes the following security controls and safeguards:

- Supabase Authentication for sign-up, sign-in, password reset, and protected application access
- Backend JWT verification for protected API routes using Supabase access tokens
- Protected analysis routes that restrict reads, writes, and deletes to the authenticated user
- Helmet on the Express server
- CORS allowlisting driven by `ALLOWED_ORIGINS`
- Route-specific rate limiting for auth, analysis, dashboard, history, report, and general API traffic
- Client-side and server-side environment validation at startup
- Temporary resume uploads with PDF and DOCX file-type validation and a 5 MB size limit
- Automatic cleanup of temporary upload files after validation, processing, and error paths
- No permanent storage of uploaded resume files
- Server-side text extraction before sending only extracted content to Google Gemini
- MongoDB Atlas persistence for structured analysis records
- Production error handling that omits stack traces outside non-production environments

## Security Best Practices

Contributors should follow these project-specific practices:

- Never commit secrets, API keys, or `.env` files
- Use the provided `.env.example` files as the source of truth for local setup
- Keep the Supabase service role key server-side only
- Keep the Supabase anon key limited to the frontend
- Keep the Gemini API key in the backend environment only
- Do not bypass authentication middleware or relax protected route checks
- Do not disable or weaken upload validation
- Keep the temporary upload cleanup logic intact on both success and failure paths
- Preserve the CORS allowlist and rate limiting behavior unless there is a reviewed security reason to change them
- Avoid storing uploaded resumes permanently
- Keep environment validation in place so missing secrets fail fast at startup

## Third-Party Services

This repository uses the following external services:

- Supabase
- MongoDB Atlas
- Google Gemini

Treat all credentials for these services as sensitive. Contributors should avoid exposing them in client-side code, logs, screenshots, or issue reports.

## Security Updates

Future security fixes and notable security-related changes will be documented in `CHANGELOG.md`.

## Acknowledgements

Thank you to security researchers and contributors who report issues responsibly and help keep Resume Analyzer safe for users.
