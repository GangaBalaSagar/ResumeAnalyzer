/**
 * rateLimiter.js
 *
 * Simple rate-limiter using express-rate-limit.
 * Limits to 60 requests per 15 minutes per IP (adjust as needed).
 */

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // limit each IP to 60 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = limiter;
