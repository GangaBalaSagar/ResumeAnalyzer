const AUTH_NOTICE_KEY = "ra_auth_notice_v1";
const AUTH_SESSION_STARTED_AT_KEY = "ra_session_started_at_v1";
const MAX_SESSION_LIFETIME_MS = 24 * 60 * 60 * 1000;

export function isProtectedAppRoute(pathname = "") {
  const path = String(pathname || "");
  return path === "/app" || path.startsWith("/app/");
}

function base64UrlToBase64(input) {
  const normalized = String(input || "").replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(padLength);
}

export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = base64UrlToBase64(parts[1]);
    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getSessionExpiryMs(session) {
  if (!session) return null;

  const expiresAt = typeof session.expires_at === "number" ? session.expires_at * 1000 : null;
  const tokenPayload = decodeJwtPayload(session.access_token);
  const tokenExpiresAt = typeof tokenPayload?.exp === "number" ? tokenPayload.exp * 1000 : null;

  if (expiresAt && tokenExpiresAt) return Math.min(expiresAt, tokenExpiresAt);
  return expiresAt || tokenExpiresAt;
}

export function isSessionExpired(session, now = Date.now()) {
  const expiryMs = getSessionExpiryMs(session);
  return typeof expiryMs === "number" ? now >= expiryMs : false;
}

export function getAbsoluteSessionExpiryMs() {
  if (typeof window === "undefined") return null;
  try {
    const startedAt = Number(localStorage.getItem(AUTH_SESSION_STARTED_AT_KEY));
    if (!Number.isFinite(startedAt) || startedAt <= 0) return null;
    return startedAt + MAX_SESSION_LIFETIME_MS;
  } catch {
    return null;
  }
}

export function isAbsoluteSessionExpired(now = Date.now()) {
  const expiryMs = getAbsoluteSessionExpiryMs();
  return typeof expiryMs === "number" ? now >= expiryMs : false;
}

export function ensureSessionStartTimestamp(session) {
  if (typeof window === "undefined" || !session) return;
  try {
    const existing = Number(localStorage.getItem(AUTH_SESSION_STARTED_AT_KEY));
    if (Number.isFinite(existing) && existing > 0) return;
    localStorage.setItem(AUTH_SESSION_STARTED_AT_KEY, String(Date.now()));
  } catch {
    // Best effort only.
  }
}

export function clearSessionStartTimestamp() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_SESSION_STARTED_AT_KEY);
  } catch {
    // Best effort only.
  }
}

export function setAuthNotice(message) {
  if (!message || typeof window === "undefined") return;
  try {
    sessionStorage.setItem(AUTH_NOTICE_KEY, message);
  } catch {
    // Best effort only.
  }
}

export function consumeAuthNotice() {
  if (typeof window === "undefined") return "";
  try {
    const message = sessionStorage.getItem(AUTH_NOTICE_KEY) || "";
    sessionStorage.removeItem(AUTH_NOTICE_KEY);
    return message;
  } catch {
    return "";
  }
}

export function clearAuthSessionArtifacts() {
  clearSessionStartTimestamp();
}
