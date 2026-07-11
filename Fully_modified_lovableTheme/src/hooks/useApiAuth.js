import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useAuthModal } from "../contexts/AuthModalContext.jsx";
import { setupApiInterceptor } from "../api.js";
import {
  clearSessionStartTimestamp,
  getAbsoluteSessionExpiryMs,
  getSessionExpiryMs,
  isAbsoluteSessionExpired,
  isSessionExpired,
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
    setupApiInterceptor(session, signOut, openLoginModal, setPendingAction);
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
  ]);

  useEffect(() => {
    if (!session) {
      clearTimers();
      return undefined;
    }

    if (isSessionExpired(session) || isAbsoluteSessionExpired()) {
      logoutToLogin("Your session has expired. Please sign in again.");
      return undefined;
    }

    const absoluteExpiryMs = getAbsoluteSessionExpiryMs();
    const absoluteRemainingMs =
      typeof absoluteExpiryMs === "number" ? absoluteExpiryMs - Date.now() : null;
    if (typeof absoluteRemainingMs === "number") {
      if (absoluteRemainingMs <= 0) {
        logoutToLogin("Your session has expired. Please sign in again.");
        return undefined;
      }
      absoluteTimerRef.current = setTimeout(() => {
        logoutToLogin("Your session has expired. Please sign in again.");
      }, absoluteRemainingMs);
    }

    const expiryMs = getSessionExpiryMs(session);
    const remainingMs = typeof expiryMs === "number" ? expiryMs - Date.now() : null;
    if (typeof remainingMs === "number") {
      if (remainingMs <= 0) {
        logoutToLogin("Your session has expired. Please sign in again.");
        return undefined;
      }
      expiryTimerRef.current = setTimeout(() => {
        logoutToLogin("Your session has expired. Please sign in again.");
      }, remainingMs);
    }

    const scheduleIdleLogout = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        logoutToLogin("Signed out due to inactivity.");
      }, IDLE_TIMEOUT_MS);
    };

    const onActivity = () => {
      if (logoutInFlightRef.current || !session) return;
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
  ]);
}
