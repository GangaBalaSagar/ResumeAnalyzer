require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const rateLimiter = require("./middleware/rateLimiter");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// API routes
app.use("/api", analysisRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB error:", err));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT || 5000);
});


