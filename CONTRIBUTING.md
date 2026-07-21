# Contributing to Resume Analyzer

Thanks for taking the time to improve Resume Analyzer.

## What to Contribute

Bug fixes, documentation updates, accessibility improvements, reliability fixes, and focused code cleanups are all welcome.

Please open an issue before working on major changes to authentication, the database schema, the resume analysis pipeline, the upload lifecycle, or route structure.

## Repository Layout

- `client/` contains the React frontend, routes, pages, components, hooks, and browser-facing services.
- `server/` contains the Express API, middleware, controllers, services, MongoDB model, and upload cleanup utilities.
- The two applications communicate through the API and shared Supabase authentication state.

## Local Development

### Clone the repository

```bash
git clone https://github.com/GangaBalaSagar/ResumeAnalyzer.git
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

## Environment Variables

Use the checked-in example files as the source of truth:

- `client/.env.example`
- `server/.env.sample`

Do not commit secrets. Keep the Supabase service role key, Gemini API key, and MongoDB credentials in local environment files or deployment environment variables.

## Coding Guidelines

- Match the existing code style in the file you are editing.
- Reuse existing components and utilities before adding new ones.
- Keep frontend work in `client/src/`.
- Keep backend work in `server/`.
- Keep the temporary upload pipeline intact.
- Do not store uploaded resumes permanently.
- Preserve auth boundaries around protected routes and API handlers.

## Manual Verification

Before opening a pull request, verify the following locally:

- `npm run build` in `client/`
- `npm run lint` in `client/`
- The backend starts successfully with `npm run dev` in `server/`
- Sign up, sign in, forgot password, and reset password flows still work
- Resume upload still works for PDF and DOCX files
- Report generation still works
- Dashboard and history views still load saved analyses
- Account sign out still works
- Temporary uploads are cleaned up after success and failure paths
- The browser console has no errors

## Branches and Commits

- Use short-lived branches for focused changes.
- Prefer Conventional Commits.
- Avoid mixing unrelated changes in one pull request.

## Documentation

If your change affects routes, environment variables, security behavior, or architecture, update the relevant documentation in the same pull request.

## Security

Do not disclose vulnerabilities publicly. See [SECURITY.md](SECURITY.md) for the reporting process.
