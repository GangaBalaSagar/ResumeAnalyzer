/**
 * Centralized catalog of user-friendly failure messages for the Recruiter's Desk theme.
 * Messages are calm, professional, reassuring, and completely devoid of technical jargon
 * (avoiding references to API, database, backend, server, Gemini, MongoDB, etc.).
 */
export const failureMessages = {
  NETWORK: {
    title: "Connection Lost",
    description: "We are unable to connect to the server. Please check your internet connection and try again."
  },
  OFFLINE: {
    title: "You are Offline",
    description: "Please check your network connection. Once you are back online, we will be ready to continue."
  },
  TIMEOUT: {
    title: "Request Timed Out",
    description: "The request took longer than expected to process. Please try a simpler document or try again."
  },
  SERVICE_UNAVAILABLE: {
    title: "Service Temporarily Unavailable",
    description: "We are undergoing routine maintenance or experiencing high traffic. Please check back in a few minutes."
  },
  AI_UNAVAILABLE: {
    title: "Review System Offline",
    description: "The resume review system is temporarily offline. We are working to restore it as quickly as possible."
  },
  SESSION_EXPIRED: {
    title: "Session Expired",
    description: "For your security, your session has timed out. Please sign in again to continue."
  },
  RATE_LIMIT: {
    title: "Too Many Requests",
    description: "You have reached the request limit. Please take a brief break and try again in a few minutes."
  },
  INVALID_FILE: {
    title: "Unsupported File Type",
    description: "We could not read this document format. Please upload your resume as a PDF or Word (.docx) file."
  },
  FILE_TOO_LARGE: {
    title: "File Too Large",
    description: "This document exceeds the size limit. Please upload a file smaller than 5 MB."
  },
  CORRUPTED_FILE: {
    title: "Unable to Read Document",
    description: "The uploaded file appears to be corrupted or password-protected. Please check the file and try again."
  },
  NO_TEXT_FOUND: {
    title: "Empty Document",
    description: "We could not find any text in this document. Please verify it contains text and try again."
  },
  UNKNOWN: {
    title: "Something Went Wrong",
    description: "We encountered an unexpected issue while processing your request. Please try again in a moment."
  }
};

export default failureMessages;
