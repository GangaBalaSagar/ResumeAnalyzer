const REQUIRED_VARS = [
  "VITE_API_URL",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
];

const OPTIONAL_VARS = [];

function validateEnv() {
  const missing = [];
  const invalid = [];

  for (const key of REQUIRED_VARS) {
    const value = import.meta.env[key];
    if (!value || value.trim() === "") {
      missing.push(key);
    }
  }

  for (const key of OPTIONAL_VARS) {
    const value = import.meta.env[key];
    if (value !== undefined && value !== null && value.trim() === "") {
      invalid.push(key);
    }
  }

  if (missing.length > 0 || invalid.length > 0) {
    const lines = [
      "",
      "❌ Missing required environment variables:",
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
      "Create a .env file in the project root with the required variables.",
      "See .env.example for reference.",
      ""
    );

    console.error(lines.join("\n"));
    throw new Error("Environment validation failed. See errors above.");
  }

  console.info("✅ Environment validation passed");
}

export function initEnvValidation() {
  if (typeof window !== "undefined" && import.meta.env.DEV) {
    console.info("🔍 Validating environment variables...");
  }
  validateEnv();
}

export function getEnv(key) {
  return import.meta.env[key];
}