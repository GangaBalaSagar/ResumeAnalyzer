# Contributing to Resume Analyzer

Thanks for taking the time to improve Resume Analyzer.

Contributions of all sizes are welcome, including bug fixes, documentation updates, accessibility improvements, and small reliability fixes.

## Ways to Contribute

You can help with bug fixes, documentation improvements, accessibility improvements, performance optimizations, UI/UX refinements, refactoring, security improvements, testing, feature enhancements, and issue reporting.

## Discuss Major Changes

Please open an issue before working on major architectural changes such as authentication, the database schema, the resume analysis pipeline, the upload lifecycle, routing, or folder restructuring.

Early discussion helps avoid duplicated work and keeps the architecture consistent with the rest of the project.

## Project Guidelines

- Do not commit secrets.
- Do not permanently store uploaded resumes.
- Keep the temporary upload pipeline intact.
- Reuse existing UI components before creating new ones.
- Keep pull requests focused.
- Avoid mixing unrelated changes.

## Before You Start

Please read:

- [README.md](README.md)
- [CHANGELOG.md](CHANGELOG.md)

This project has a production-style frontend and backend with Supabase authentication, MongoDB persistence, Gemini analysis, and a temporary upload pipeline. Please understand the existing architecture before proposing changes.

## Development Environment

Resume Analyzer is split into two applications:

- `client/` - Vite + React frontend
- `server/` - Express + Node backend

### Clone the repository

```bash
git clone <repo-url>
cd ResumeAnalyzer
```

### Install frontend dependencies

```bash
cd client
npm install
```

### Install backend dependencies

```bash
cd ../server
npm install
```

### Run the frontend

```bash
cd client
npm run dev
```

### Run the backend

```bash
cd server
npm run dev
```

### Environment variables

Use the example files as the source of truth:

- `client/.env.example`
- `server/.env.example`

Do not commit secrets. Keep Supabase keys, MongoDB credentials, and Gemini API keys in local environment files or your deployment environment.

## Repository Structure

- `client/` contains the React app, routing, layouts, pages, reusable UI components, and browser metadata.
- `server/` contains the Express API, route handlers, middleware, services, MongoDB model, and upload cleanup utilities.
- The frontend and backend are separate runtimes, but they work together through the API and shared authentication state.

Make frontend UI changes in `client/src/`.

Make backend API, auth, upload, validation, and persistence changes in `server/`.

## Branching Strategy

Use short-lived branches for focused changes:

- `feature/<feature-name>`
- `fix/<bug-name>`
- `docs/<documentation>`
- `refactor/<feature>`

Avoid committing directly to `main`.

## Commit Messages

Use Conventional Commits.

Examples:

- `feat: add analysis export`
- `fix: handle missing resume file`
- `docs: update README installation steps`
- `refactor: simplify report layout`
- `style: adjust spacing in header`
- `test: add upload validation coverage`
- `chore: update dependencies`

## Coding Guidelines

- Match the existing code style in the file you are editing.
- Reuse existing components and utilities before adding new ones.
- Avoid duplicate logic across pages, components, controllers, and services.
- Keep components focused and readable.
- Prefer small, reusable helpers over one-off inline logic when it improves clarity.
- Do not hardcode secrets or environment-specific values.
- Follow the current folder organization in `client/src/` and `server/`.

## Frontend Guidelines

- Keep React components focused and composable.
- Respect the existing route structure in `client/src/routes/AppRoutes.jsx`.
- Preserve the paper-themed UI language already used across the app.
- Keep layouts responsive for desktop and mobile.
- Maintain accessible markup, labels, button text, and focus states.
- Reuse shared UI primitives instead of introducing conflicting patterns.

## Backend Guidelines

- Keep middleware order intentional in `server/server.js`.
- Validate inputs before calling Gemini or writing to MongoDB.
- Keep request logic in controllers thin and move reusable logic into services.
- Keep upload handling temporary.
- Never store uploaded resumes permanently.
- Continue using cleanup logic for both success and failure paths.
- Preserve the auth boundary around protected analysis routes.

## Testing Before Opening a Pull Request

Before opening a pull request, verify the following locally:

- `npm run build` in `client/`
- The frontend loads successfully
- The backend starts successfully
- Authentication flows still work
- Resume upload still works
- Report generation still works
- Archive views still work
- Mobile layout behaves correctly
- The browser console has no errors
- No build warnings remain

## Documentation

If your change affects any of the following, update the relevant docs in the same pull request:

- `README.md`
- `CHANGELOG.md`
- API behavior
- Environment variables
- Architecture

## Pull Request Checklist

- [ ] Build passes
- [ ] Tested locally
- [ ] No secrets committed
- [ ] Documentation updated if required
- [ ] No unrelated code changes
- [ ] Commit messages follow Conventional Commits

## Reporting Issues

When reporting a bug, please:

- Search existing issues first
- Describe the problem clearly
- Include reproduction steps
- Include logs or console output when relevant
- Include screenshots for UI issues

## Security

Please do not disclose vulnerabilities publicly.

If a security concern is discovered, report it responsibly and wait for guidance before sharing details broadly. See [SECURITY.md](SECURITY.md) for the reporting process and disclosure guidance.

## Thank You

Thanks again for helping improve Resume Analyzer. Clear reports, small fixes, and careful documentation all help keep the project production-ready.
