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

// Trust first proxy (Render, etc.) so req.ip reflects the real client IP
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({
  origin: config.cors.allowedOrigins,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/api", generalApiLimiter);

// Prevent caching of authenticated API responses
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("Pragma", "no-cache");
  next();
});

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


