/**
 * rateLimiter.js
 *
 * Creates endpoint-specific limiters for auth, analysis, dashboard/history/report,
 * and general API traffic. Development environments bypass the limits to avoid
 * blocking local testing, while production keeps sensible quotas.
 */

const rateLimit = require('express-rate-limit');

const DEFAULT_MESSAGE = { error: 'Too many requests, please try again later.' };

function isDevelopmentRequest(req) {
  const env = process.env.NODE_ENV || '';
  const host = req.hostname || '';

  return env === 'development' || env === 'test' || host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '::1';
}

function createLimiter(options = {}) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    message: DEFAULT_MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || req.ip,
    skip: (req) => isDevelopmentRequest(req),
    ...options,
  });
}

const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const signupLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
});

const analysisLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 15,
});

const dashboardLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

const historyLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

const reportLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

const generalApiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

module.exports = {
  authLimiter,
  signupLimiter,
  analysisLimiter,
  dashboardLimiter,
  historyLimiter,
  reportLimiter,
  generalApiLimiter,
};
