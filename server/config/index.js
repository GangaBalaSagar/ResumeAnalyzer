const normalizedNodeEnv = (process.env.NODE_ENV || "").trim().toLowerCase();
const isProduction = normalizedNodeEnv === "production";
const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultDevelopmentOrigins = ["http://localhost:5173", "http://localhost:3000"];

const allowedOrigins = isProduction
  ? configuredOrigins
  : configuredOrigins.length > 0
    ? configuredOrigins
    : defaultDevelopmentOrigins;

if (isProduction && configuredOrigins.length === 0) {
  throw new Error("ALLOWED_ORIGINS must be set in production with a comma-separated list of allowed origins.");
}

module.exports = {
  server: {
    port: process.env.PORT || 5000,
  },
  database: {
    mongoUri: process.env.MONGODB_URI,
  },
  cors: {
    allowedOrigins,
  },
};