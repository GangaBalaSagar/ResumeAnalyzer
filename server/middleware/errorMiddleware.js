const logger = require("../utils/logger");

const isDevelopment = (process.env.NODE_ENV || "").trim().toLowerCase() === "development";

function errorHandler(err, req, res, next) {
  logger.error(err.message || "Internal Server Error", err);

  const response = {
    error: isDevelopment ? (err.message || "Internal Server Error") : "Internal Server Error",
  };

  if (isDevelopment) {
    response.stack = err.stack;
  }

  res.status(err.statusCode || 500).json(response);
}

module.exports = errorHandler;
