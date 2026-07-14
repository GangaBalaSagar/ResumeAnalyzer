const REQUIRED_VARS = [
  "MONGODB_URI",
  "GEMINI_API_KEY",
  "JWT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const REQUIRED_IN_PRODUCTION = [
  "ALLOWED_ORIGINS",
];

const OPTIONAL_VARS = [
  "PORT",
  "NODE_ENV",
  "GEMINI_API_URL",
];

function validateEnv() {
  const missing = [];
  const invalid = [];

  const isProduction = process.env.NODE_ENV === "production";

  for (const key of REQUIRED_VARS) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      missing.push(key);
    }
  }

  if (isProduction) {
    for (const key of REQUIRED_IN_PRODUCTION) {
      const value = process.env[key];
      if (!value || value.trim() === "") {
        missing.push(key);
      }
    }
  }

  for (const key of OPTIONAL_VARS) {
    const value = process.env[key];
    if (value !== undefined && value !== null && value.trim() === "") {
      invalid.push(key);
    }
  }

  if (missing.length > 0 || invalid.length > 0) {
    const lines = [
      "",
      "❌ Missing or invalid required environment variables:",
      "",
    ];

    if (missing.length > 0) {
      lines.push(
        ...missing.map((key) => `  - ${key}`),
        ""
      );
    }

    if (invalid.length > 0) {
      lines.push(
        "Invalid (empty) optional variables:",
        ...invalid.map((key) => `  - ${key}`),
        ""
      );
    }

    lines.push(
      "Create a .env file in the server directory with the required variables.",
      "See .env.example for reference.",
      ""
    );

    console.error(lines.join("\n"));
    process.exit(1);
  }

  console.info("✅ Server environment validation passed");
}

module.exports = { validateEnv, REQUIRED_VARS, REQUIRED_IN_PRODUCTION, OPTIONAL_VARS };