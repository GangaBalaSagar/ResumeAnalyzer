# Environment Configuration

## 1. Purpose

```flowchart TD
    PurposeDoc["ENVIRONMENT_CONFIGURATION.md"]
    PurposeDoc --> AuthRef["Authoritative Environment Reference"]
    PurposeDoc --> ParamRules["Defines Runtime Variables & Validation Rules"]
    PurposeDoc --> BoundaryDoc["Establishes Client vs Server Security Boundaries"]
```

The purpose of this document is to serve as the authoritative reference for all environment variables, runtime configurations, and external service bindings implemented within Resume Analyzer. It documents the exact configuration properties required by the frontend application and backend server, their validation logic, default behaviors, and security constraints.

---

## 2. Configuration Overview

```flowchart TD
    subgraph Frontend ["Client Environment (Vite / Browser)"]
        ClientVars["VITE_API_URL<br/>VITE_SUPABASE_URL<br/>VITE_SUPABASE_ANON_KEY"]
    end

    subgraph Backend ["Backend Environment (Express / Node.js)"]
        ServerVars["PORT<br/>MONGODB_URI<br/>GEMINI_API_KEY<br/>GEMINI_API_URL<br/>NODE_ENV<br/>JWT_SECRET<br/>ALLOWED_ORIGINS<br/>SUPABASE_URL<br/>SUPABASE_SERVICE_ROLE_KEY"]
    end

    subgraph External ["External Infrastructure"]
        Supa["Supabase Auth"]
        Mongo["MongoDB Atlas"]
        Gemini["Google Gemini AI"]
    end

    Frontend -- "HTTP / REST API" --> Backend
    Frontend -. "Client Auth SDK" .-> Supa
    Backend -- "Admin Token Verification" --> Supa
    Backend -- "Mongoose Persistence" --> Mongo
    Backend -- "Generative AI SDK" --> Gemini
```

Configuration in Resume Analyzer is strictly segmented into two isolated runtime boundaries:

1. **Frontend Environment**: Read at build/dev time via Vite (`import.meta.env`). All variables must be prefixed with `VITE_` and are bundled into client-side browser code.
2. **Backend Environment**: Loaded at runtime by Node.js using `dotenv` into `process.env`. Contains private infrastructure URIs, administrative keys, and database secrets that must never be exposed to the browser.

---

## 3. Frontend Configuration

```flowchart LR
    ViteEnv["import.meta.env"]
    ViteEnv --> V1["VITE_API_URL"]
    ViteEnv --> V2["VITE_SUPABASE_URL"]
    ViteEnv --> V3["VITE_SUPABASE_ANON_KEY"]
```

The frontend application (`client/`) consumes three environment variables validated during application initialization in `client/src/utils/envValidation.js`:

### `VITE_API_URL`

* **Purpose**: Defines the base URL for the backend Express REST API.
* **Required**: Yes
* **Used By**: `client/src/api.js` to configure the Axios HTTP client instance (`baseURL`).
* **Default Behavior**: None; validation fails if missing.
* **Validation**: Verified by `client/src/utils/envValidation.js` at startup. Throws an error if missing or empty string.

### `VITE_SUPABASE_URL`

* **Purpose**: The project URL endpoint for Supabase authentication service.
* **Required**: Yes
* **Used By**: `client/src/services/supabase/supabaseClient.js` to initialize the client-side Supabase JS SDK.
* **Default Behavior**: None; validation fails if missing.
* **Validation**: Verified by `client/src/utils/envValidation.js` at startup. Throws an error if missing or empty string.

### `VITE_SUPABASE_ANON_KEY`

* **Purpose**: Public anonymous API key used to authenticate client-side Supabase SDK requests.
* **Required**: Yes
* **Used By**: `client/src/services/supabase/supabaseClient.js` to initialize client authentication sessions.
* **Default Behavior**: None; validation fails if missing.
* **Validation**: Verified by `client/src/utils/envValidation.js` at startup. Throws an error if missing or empty string.

---

## 4. Backend Configuration

```flowchart TD
    ProcEnv["process.env"]
    ProcEnv --> ServerCfg["Server & Network:<br/>PORT, NODE_ENV, ALLOWED_ORIGINS"]
    ProcEnv --> DBCfg["Database & Storage:<br/>MONGODB_URI"]
    ProcEnv --> SecurityCfg["Auth & Security:<br/>JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"]
    ProcEnv --> AICfg["AI Provider:<br/>GEMINI_API_KEY, GEMINI_API_URL"]
```

The backend server (`server/`) reads environment variables via `process.env`. All variables are validated at server startup by `server/utils/envValidation.js`:

### `PORT`

* **Purpose**: Network port on which the Express HTTP server listens.
* **Required**: No (Optional)
* **Used By**: `server/config/index.js` and `server/server.js`.
* **Validation**: Validated as non-empty if provided; defaults to `5000` if omitted.
* **Security Notes**: Binds network port listener.

### `MONGODB_URI`

* **Purpose**: Full MongoDB Atlas connection string URI, including host and database user credentials.
* **Required**: Yes
* **Used By**: `server/config/index.js` and `server/server.js` (`mongoose.connect()`).
* **Validation**: Validated by `server/utils/envValidation.js`. Server terminates (`process.exit(1)`) if missing or empty.
* **Security Notes**: Contains database authentication credentials. Must never be exposed to the client or committed to public repositories.

### `GEMINI_API_KEY`

* **Purpose**: API authentication key for accessing Google Generative AI (Gemini 2.0 / 2.5 / 1.5 Flash models).
* **Required**: Yes
* **Used By**: `server/services/geminiService.js` to instantiate `@google/generative-ai`.
* **Validation**: Checked in `server/utils/envValidation.js` and double-checked in `server/services/geminiService.js`. Process exits if missing.
* **Security Notes**: Highly sensitive AI service credential. Handled strictly server-side.

### `GEMINI_API_URL`

* **Purpose**: Optional custom endpoint override URL for Google Gemini API services.
* **Required**: No (Optional)
* **Used By**: `server/utils/envValidation.js` optional variables list.
* **Validation**: Checked for non-emptiness if specified.
* **Security Notes**: External API route configuration.

### `NODE_ENV`

* **Purpose**: Specifies the runtime mode (`development`, `production`, `test`).
* **Required**: No (Optional)
* **Used By**: `server/config/index.js` and `server/utils/envValidation.js`.
* **Validation**: Alters validation strictness for `ALLOWED_ORIGINS` when set to `production`.
* **Security Notes**: Controls strict CORS enforcement rules.

### `JWT_SECRET`

* **Purpose**: Cryptographic secret key configured for JWT signing and token operations.
* **Required**: Yes
* **Used By**: Backend runtime configuration (`server/utils/envValidation.js`).
* **Validation**: Validated as required at server startup.
* **Security Notes**: Must be a strong, high-entropy secret string.

### `ALLOWED_ORIGINS`

* **Purpose**: Comma-separated list of allowed origins for Cross-Origin Resource Sharing (CORS).
* **Required**: Required in `production` (`REQUIRED_IN_PRODUCTION`); optional in `development`.
* **Used By**: `server/config/index.js` to configure Express CORS middleware in `server/server.js`.
* **Validation**: Parsed into an array. In development mode, defaults to `["http://localhost:5173", "http://localhost:3000"]` if unset. In production, throws an error if missing.
* **Security Notes**: Restricts API request access to trusted web domain origins.

### `SUPABASE_URL`

* **Purpose**: Supabase project URL used by the backend to verify user JWT access tokens.
* **Required**: Yes
* **Used By**: `server/middleware/authMiddleware.js` (`createClient`).
* **Validation**: Validated as required by `server/utils/envValidation.js`.
* **Security Notes**: Endpoint identifier for Supabase service instance.

### `SUPABASE_SERVICE_ROLE_KEY`

* **Purpose**: Privileged Supabase service role secret key used for administrative token verification on the backend.
* **Required**: Yes
* **Used By**: `server/middleware/authMiddleware.js` (`supabase.auth.getUser(token)`).
* **Validation**: Validated as required by `server/utils/envValidation.js`. Server terminates if missing.
* **Security Notes**: Highly privileged service key that bypasses Row Level Security (RLS). Must never be sent to the frontend or exposed publicly.

---

## 5. External Services

```flowchart LR
    subgraph Services ["Implemented External Services"]
        SupaSvc["Supabase Auth<br/>(User Authentication)"]
        MongoSvc["MongoDB Atlas<br/>(Analysis Persistence)"]
        GeminiSvc["Google Gemini AI<br/>(Resume LLM Analysis)"]
    end
```

### Supabase Auth

* **Purpose**: Authentication provider managing user signups, logins, session persistence, and issuing JWT access tokens.
* **Required Configuration**:
  * Frontend: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  * Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
* **Interaction**: The frontend client SDK initiates user authentication and receives a JWT token. This token is passed in HTTP headers (`Authorization: Bearer <token>`) to the backend. `server/middleware/authMiddleware.js` uses the server-side Supabase client initialized with `SUPABASE_SERVICE_ROLE_KEY` to verify token authenticity and retrieve the user's UUID and email.

### MongoDB Atlas

* **Purpose**: Database engine storing structured resume analysis reports, score breakdowns, matched/missing skills, and historical records.
* **Required Configuration**: `MONGODB_URI`
* **Interaction**: Mongoose connects to MongoDB Atlas at backend startup using `MONGODB_URI`. Controller logic persists structured analysis documents (`Analysis.js`) and fetches historical analysis reports for authenticated users.

### Google Gemini AI

* **Purpose**: Generative AI inference engine that analyzes resume text against job descriptions and outputs structured JSON evaluations.
* **Required Configuration**: `GEMINI_API_KEY`, optional `GEMINI_API_URL`
* **Interaction**: The backend service `server/services/geminiService.js` initializes `@google/generative-ai` with `GEMINI_API_KEY`. It constructs structured prompts and executes fallback model chaining (`gemini-2.5-flash` -> `gemini-2.0-flash` -> `gemini-1.5-flash`) to guarantee response delivery.

---

## 6. Configuration Flow

```flowchart TD
    EnvFiles[".env Files / System Environment"]
    EnvFiles --> AppLaunch["Application Startup"]
    
    subgraph ValidationPhase ["Validation Phase"]
        AppLaunch --> RunVal{"Run envValidation.js"}
        RunVal -- "Missing Required Vars" --> Fail["Log Error & Terminate"]
        RunVal -- "Validation Passed" --> Pass["Proceed to Runtime Config"]
    end
    
    subgraph RuntimePhase ["Runtime Phase"]
        Pass --> ConfigLoad["Load Config Objects<br/>(client/src/api.js, server/config/index.js)"]
        ConfigLoad --> AppServices["Initialize Services<br/>(Mongoose, Supabase, Gemini SDK)"]
    end
```

Configuration loading follows a sequential lifecycle:

1. **Environment Injection**: `.env` files are parsed by Vite on the frontend and by `dotenv` on the backend.
2. **Startup Trigger**: Entry scripts (`client/src/main.jsx` and `server/server.js`) immediately call their respective `initEnvValidation()` / `validateEnv()` functions before starting application logic.
3. **Validation Gate**: Required variables are checked against defined schemas. If validation fails, execution halts immediately with error logging.
4. **Configuration Assembly**: Validated values are loaded into central modules (`server/config/index.js` for server CORS and port settings; `client/src/api.js` for Axios base URL).
5. **Service Initialization**: Database connections (Mongoose), auth SDKs (Supabase), and AI client instances (Gemini) consume the validated configuration objects to begin runtime operations.

---

## 7. Startup Validation

```flowchart TD
    Start["Application Startup Initiated"]
    Start --> CheckClientOrServer{"Runtime Context?"}
    
    CheckClientOrServer -- "Client (Vite)" --> ClientVal["initEnvValidation() in client/src/utils/envValidation.js"]
    ClientVal --> CheckClientVars["Check VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY"]
    CheckClientVars -- "Missing" --> ClientErr["console.error() & throw Error()"]
    CheckClientVars -- "Valid" --> ClientOK["console.info('Environment validation passed')"]
    
    CheckClientOrServer -- "Server (Node)" --> ServerVal["validateEnv() in server/utils/envValidation.js"]
    ServerVal --> CheckServerVars["Check MONGODB_URI, GEMINI_API_KEY, JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"]
    CheckServerVars -- "Missing" --> ServerErr["console.error() & process.exit(1)"]
    CheckServerVars -- "Valid" --> ServerOK["console.info('Server environment validation passed')"]
```

### Implemented Validation Rules

* **Client Startup Validation**:
  * Executed synchronously in `client/src/main.jsx` via `initEnvValidation()`.
  * Verifies `VITE_API_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`.
  * **Failure Behavior**: Outputs formatted error logs to `console.error` detailing missing keys and throws a runtime `Error("Environment validation failed. See errors above.")`, halting frontend rendering.

* **Backend Startup Validation**:
  * Executed synchronously as the first line of `server/server.js` via `validateEnv()`.
  * Verifies `MONGODB_URI`, `GEMINI_API_KEY`, `JWT_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.
  * Verifies `ALLOWED_ORIGINS` when `NODE_ENV=production`.
  * **Failure Behavior**: Logs missing environment variables to stderr via `console.error` and immediately terminates the Node.js process using `process.exit(1)`.

---

## 8. Security Considerations

```flowchart LR
    subgraph PublicBoundary ["Public Boundary (Browser)"]
        PublicVars["VITE_API_URL<br/>VITE_SUPABASE_URL<br/>VITE_SUPABASE_ANON_KEY"]
    end
    
    subgraph SecretBoundary ["Secret Boundary (Server Only)"]
        SecretVars["MONGODB_URI<br/>GEMINI_API_KEY<br/>SUPABASE_SERVICE_ROLE_KEY<br/>JWT_SECRET"]
    end
    
    PublicBoundary -- "Bearer Token in HTTP Header" --> SecretBoundary
```

Resume Analyzer enforces strict environment security patterns across its architecture:

* **Client/Server Secret Isolation**: Private secrets (`MONGODB_URI`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`) exist strictly on the backend. Only variables prefixed with `VITE_` are exposed to client-side JS bundles.
* **Service Role Key Protection**: The `SUPABASE_SERVICE_ROLE_KEY` resides exclusively in `server/.env`. It is utilized by backend middleware (`server/middleware/authMiddleware.js`) to verify tokens with admin authority and is never transmitted to the browser.
* **CORS Origin Enforcement**: In production, `ALLOWED_ORIGINS` enforces explicit cross-origin boundaries, throwing a startup error if unset to prevent wildcards in cross-domain requests.
* **HTTP Security Headers**: Server startup configures `helmet()` for HTTP security headers and sets `Cache-Control: no-store` on API routes to prevent caching of sensitive authenticated data.
* **No Hardcoded Secrets**: Secrets are loaded exclusively from runtime environment variables. Git repositories exclude `.env` files via `.gitignore`.

---

## 9. Configuration Summary

```flowchart LR
    ViteConfig["Client Config<br/>(client/src/utils/envValidation.js)"]
    ServerConfig["Server Config<br/>(server/utils/envValidation.js)"]
    ServicesConfig["Service Providers<br/>(Supabase, MongoDB, Gemini)"]
    
    ViteConfig --> ServicesConfig
    ServerConfig --> ServicesConfig
```

Resume Analyzer uses a dual-environment configuration architecture:

* **Client Environment**: Uses Vite build-time environment injection (`VITE_*`) validated at startup to bind API URLs and public authentication keys.
* **Server Environment**: Uses Node.js runtime environment management (`process.env`), strict startup schema validation (`validateEnv()`), and fail-fast process termination to protect database credentials, service role keys, and AI API credentials.
* **Service Integrations**: Connects client and server to Supabase Auth, MongoDB Atlas, and Google Gemini AI through clearly partitioned public vs. secret key boundaries.
