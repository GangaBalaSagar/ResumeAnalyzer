import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useAuthModal } from "../contexts/AuthModalContext.jsx";
import { setupApiInterceptor } from "../api.js";
import {
  clearSessionStartTimestamp,
  ensureLastActivityTimestamp,
  getAbsoluteSessionExpiryMs,
  getSessionExpiryMs,
  isInactivityExpired,
  isAbsoluteSessionExpired,
  isSessionExpired,
  isProtectedAppRoute,
  setLastActivityTimestamp,
  setAuthNotice,
} from "../utils/authSession.js";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const IDLE_EVENTS = [
  "mousemove",
  "click",
  "keydown",
  "scroll",
  "touchstart",
  "touchmove",
];

/**
 * Wires the axios interceptor to the current Supabase session and replays
 * a pending action (if any) as soon as a fresh session becomes available.
 * Direct port of the uploaded useApiAuth hook.
 */
export default function useApiAuth() {
  const location = useLocation();
  const { session, signOut } = useAuth();
  const {
    openLoginModal,
    setPendingAction,
    pendingAction,
    executePendingAction,
    clearPendingAction,
  } = useAuthModal();
  const expiryTimerRef = useRef(null);
  const absoluteTimerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const logoutInFlightRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
    if (absoluteTimerRef.current) {
      clearTimeout(absoluteTimerRef.current);
      absoluteTimerRef.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const logoutToLogin = useCallback(
    async (message) => {
      if (logoutInFlightRef.current) return;
      logoutInFlightRef.current = true;
      try {
        clearTimers();
        clearPendingAction();
        setAuthNotice(message);
        await signOut();
        clearSessionStartTimestamp();
        openLoginModal(message);
      } finally {
        logoutInFlightRef.current = false;
      }
    },
    [clearPendingAction, clearTimers, openLoginModal, signOut]
  );

  useEffect(() => {
    setupApiInterceptor(
      session,
      signOut,
      openLoginModal,
      setPendingAction,
      location.pathname
    );
    if (session?.access_token && pendingAction) {
      executePendingAction();
      clearPendingAction();
    }
  }, [
    session,
    signOut,
    openLoginModal,
    setPendingAction,
    pendingAction,
    executePendingAction,
    clearPendingAction,
    location.pathname,
  ]);

  useEffect(() => {
    if (!session) {
      clearTimers();
      return undefined;
    }

    ensureLastActivityTimestamp(session);

    if (isSessionExpired(session) || isAbsoluteSessionExpired() || isInactivityExpired(session)) {
      if (isProtectedAppRoute(location.pathname)) {
        logoutToLogin("Your session has expired. Please sign in again.");
      } else {
        clearTimers();
        clearPendingAction();
        signOut();
        clearSessionStartTimestamp();
      }
      return undefined;
    }

    const absoluteExpiryMs = getAbsoluteSessionExpiryMs();
    const absoluteRemainingMs =
      typeof absoluteExpiryMs === "number" ? absoluteExpiryMs - Date.now() : null;
    if (typeof absoluteRemainingMs === "number") {
      if (absoluteRemainingMs <= 0) {
        if (isProtectedAppRoute(location.pathname)) {
          logoutToLogin("Your session has expired. Please sign in again.");
        } else {
          clearTimers();
          clearPendingAction();
          signOut();
          clearSessionStartTimestamp();
        }
        return undefined;
      }
      absoluteTimerRef.current = setTimeout(() => {
        if (isProtectedAppRoute(location.pathname)) {
          logoutToLogin("Your session has expired. Please sign in again.");
        } else {
          clearTimers();
          clearPendingAction();
          signOut();
          clearSessionStartTimestamp();
        }
      }, absoluteRemainingMs);
    }

    const expiryMs = getSessionExpiryMs(session);
    const remainingMs = typeof expiryMs === "number" ? expiryMs - Date.now() : null;
    if (typeof remainingMs === "number") {
      if (remainingMs <= 0) {
        if (isProtectedAppRoute(location.pathname)) {
          logoutToLogin("Your session has expired. Please sign in again.");
        } else {
          clearTimers();
          clearPendingAction();
          signOut();
          clearSessionStartTimestamp();
        }
        return undefined;
      }
      expiryTimerRef.current = setTimeout(() => {
        if (isProtectedAppRoute(location.pathname)) {
          logoutToLogin("Your session has expired. Please sign in again.");
        } else {
          clearTimers();
          clearPendingAction();
          signOut();
          clearSessionStartTimestamp();
        }
      }, remainingMs);
    }

    const scheduleIdleLogout = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (isProtectedAppRoute(location.pathname)) {
          logoutToLogin("Signed out due to inactivity.");
        } else {
          clearTimers();
          clearPendingAction();
          signOut();
          clearSessionStartTimestamp();
        }
      }, IDLE_TIMEOUT_MS);
    };

    const onActivity = () => {
      if (logoutInFlightRef.current || !session) return;
      setLastActivityTimestamp();
      scheduleIdleLogout();
    };

    scheduleIdleLogout();
    IDLE_EVENTS.forEach((eventName) =>
      window.addEventListener(eventName, onActivity, { passive: true })
    );

    return () => {
      clearTimers();
      IDLE_EVENTS.forEach((eventName) =>
        window.removeEventListener(eventName, onActivity)
      );
    };
  }, [
    session,
    logoutToLogin,
    clearTimers,
    clearPendingAction,
    signOut,
    location.pathname,
  ]);
}
