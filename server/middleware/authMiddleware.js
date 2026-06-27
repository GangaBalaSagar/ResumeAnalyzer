/**
 * authMiddleware.js
 * 
 * Verifies Supabase JWT tokens from the Authorization header.
 * 
 * Expected header:
 * Authorization: Bearer <access_token>
 * 
 * Flow:
 * 1. Extract token from "Bearer <token>" format
 * 2. Verify using Supabase JWT verification
 * 3. Attach user info to req.user if valid
 * 4. Return 401 if invalid or missing
 */

const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client with server key
// The server key allows token verification
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Middleware to verify Supabase JWT token
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * On success:
 *   req.user = { id, email }
 * 
 * On failure:
 *   Returns 401 with error message
 */
async function authMiddleware(req, res, next) {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }

    // Extract Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Missing authorization header" });
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid authorization format. Use: Bearer <token>" });
    }

    const token = parts[1];

    // Verify token using Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user info to request
    req.user = {
      id: data.user.id,          // Supabase user UUID
      email: data.user.email     // User email from Supabase
    };

    // Continue to next middleware/route handler
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err);
    return res.status(401).json({ error: "Authentication failed" });
  }
}

module.exports = authMiddleware;
