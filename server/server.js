require("dotenv").config();
const { validateEnv } = require("./utils/envValidation.js");
validateEnv();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { generalApiLimiter } = require("./middleware/rateLimiter");
const analysisRoutes = require("./routes/analysisRoutes");
const logger = require("./utils/logger");
const config = require("./config");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.cors.allowedOrigins
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/api", generalApiLimiter);

// API routes
app.use("/api", analysisRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use(errorHandler);

mongoose.connect(config.database.mongoUri)
  .then(() => {
    logger.info("Connected to MongoDB Atlas");
    app.listen(config.server.port, () => {
      logger.info("Server running on port", config.server.port);
    });
  })
  .catch(err => {
    logger.error("MongoDB connection failed:", err);
    process.exit(1);
  });


