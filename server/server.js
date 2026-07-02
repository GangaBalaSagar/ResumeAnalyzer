require("dotenv").config();
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", generalApiLimiter);

// API routes
app.use("/api", analysisRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use(errorHandler);

mongoose.connect(config.database.mongoUri)
  .then(() => logger.info("Connected to MongoDB Atlas"))
  .catch(err => logger.error("MongoDB error:", err));

app.listen(config.server.port, () => {
  logger.info("Server running on port", config.server.port);
});


