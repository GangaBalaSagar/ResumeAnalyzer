const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error(err.message || "Internal Server Error", err);

  const response = {
    error: err.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(err.statusCode || 500).json(response);
}

module.exports = errorHandler;
