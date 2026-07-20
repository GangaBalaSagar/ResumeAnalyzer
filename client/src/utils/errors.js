import axios from "axios";

/**
 * Standardizes backend and network errors into user-friendly messages.
 * Maps HTTP status codes to specific strings per production hardening guidelines.
 * Returns null if the request was cancelled/aborted.
 *
 * @param {Error|Object} err - The error object to parse.
 * @returns {string|null} The standardized error message, or null if the error is due to cancellation.
 */
export function getStandardErrorMessage(err) {
  if (!err) {
    return "Something went wrong on our side. Please try again.";
  }

  // Handle request cancellation / abort
  if (
    err.name === "AbortError" ||
    err.name === "CanceledError" ||
    err.message === "canceled" ||
    axios.isCancel?.(err)
  ) {
    return null;
  }

  // Network failure: backend unreachable (no response received from server)
  if (!err.response) {
    return "Unable to reach the server. Check your internet connection and try again.";
  }

  const status = err.response.status;
  switch (status) {
    case 400:
      return "Please check the information you entered.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested analysis could not be found.";
    case 408:
      return "The request took too long. Please try again.";
    case 413:
      return "The uploaded document is too large to analyze.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "Something went wrong on our side. Please try again.";
    case 502:
    case 503:
    case 504:
      return "The AI service is temporarily unavailable. Please try again later.";
    default:
      // Prevent leaking internal message/traces in case of other unexpected status codes
      return "Something went wrong on our side. Please try again.";
  }
}
