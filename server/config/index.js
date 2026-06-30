module.exports = {
  server: {
    port: process.env.PORT || 5000,
  },
  database: {
    mongoUri: process.env.MONGODB_URI,
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  },
};