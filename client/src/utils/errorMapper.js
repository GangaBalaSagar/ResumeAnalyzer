import axios from "axios";

/**
 * Maps any system, Axios, or application error to a centralized failure type string.
 * Ensures the app doesn't inspect HTTP status codes directly in page components.
 * 
 * @param {Error|Object} err - The error object to map.
 * @returns {string} One of the failure type keys from failureMessages.js (e.g. 'NETWORK', 'TIMEOUT', etc.).
 */
export function mapErrorToType(err) {
  if (!err) {
    return "UNKNOWN";
  }

  // Handle offline status
  if (typeof window !== "undefined" && !window.navigator.onLine) {
    return "OFFLINE";
  }

  // Handle abort/cancel (usually returns "UNKNOWN" or is handled separately)
  if (
    err.name === "AbortError" ||
    err.name === "CanceledError" ||
    err.message === "canceled" ||
    axios.isCancel?.(err)
  ) {
    return "UNKNOWN";
  }

  // Network error (server is unreachable or DNS failed)
  if (!err.response) {
    const errMsg = String(err.message || "").toLowerCase();
    if (errMsg.includes("timeout")) {
      return "TIMEOUT";
    }
    if (errMsg.includes("network") || errMsg.includes("econnrefused") || errMsg.includes("unable to reach")) {
      return "NETWORK";
    }
    return "NETWORK";
  }

  const status = err.response.status;
  const responseData = err.response.data || {};
  const errorMsg = String(responseData.error || "").toLowerCase();

  // Inspect status codes
  switch (status) {
    case 400:
      if (errorMsg.includes("file type") || errorMsg.includes("unsupported")) {
        return "INVALID_FILE";
      }
      if (errorMsg.includes("corrupt") || errorMsg.includes("invalid pdf") || errorMsg.includes("invalid docx")) {
        return "CORRUPTED_FILE";
      }
      if (errorMsg.includes("password") || errorMsg.includes("protected")) {
        return "CORRUPTED_FILE";
      }
      if (errorMsg.includes("empty") || errorMsg.includes("no text")) {
        return "NO_TEXT_FOUND";
      }
      return "UNKNOWN";
    case 401:
    case 403:
      return "SESSION_EXPIRED";
    case 408:
      return "TIMEOUT";
    case 413:
      return "FILE_TOO_LARGE";
    case 429:
      return "RATE_LIMIT";
    case 502:
    case 503:
    case 504:
      return "AI_UNAVAILABLE";
    case 500:
    default:
      if (errorMsg.includes("database") || errorMsg.includes("mongo")) {
        return "SERVICE_UNAVAILABLE";
      }
      return "UNKNOWN";
  }
}

export default mapErrorToType;
