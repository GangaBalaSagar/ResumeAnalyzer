import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../services/supabase/client.js";
import {
  publishAuthSync,
  publishSessionMetadataSync,
  subscribeSessionSync,
} from "../services/sessionSync.js";
import {
  clearAuthSessionArtifacts,
  ensureSessionStartTimestamp,
  ensureLastActivityTimestamp,
  isAbsoluteSessionExpired,
  isInactivityExpired,
  isSessionExpired,
  isProtectedAppRoute,
  setAuthNotice,
} from "../utils/authSession.js";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);
  const validationInFlightRef = useRef(false);
  const pathnameRef = useRef(location.pathname);
  const lastPublishedAuthRef = useRef({ event: null, token: null });

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  const clearSessionState = () => {
    setUser(null);
    setSession(null);
  };

  const syncSessionState = (currentSession) => {
    if (currentSession) {
      ensureSessionStartTimestamp(currentSession);
      ensureLastActivityTimestamp(currentSession);
      publishSessionMetadataSync({
        sessionStartedAt:
          typeof window !== "undefined"
            ? Number(localStorage.getItem("ra_session_started_at_v1")) || null
            : null,
        lastActivityAt:
          typeof window !== "undefined"
            ? Number(localStorage.getItem("ra_last_activity_at_v1")) || null
            : null,
      });
    }
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setLoading(false);
  };

  const getAuthFingerprint = (event, currentSession) => ({
    event: event || null,
    token: currentSession?.access_token || null,
  });

  const performLocalLogout = async ({ notice } = {}) => {
    if (validationInFlightRef.current) return;
    validationInFlightRef.current = true;
    try {
      if (notice) setAuthNotice(notice);
      await supabase.auth.signOut({ scope: "local" });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      clearAuthSessionArtifacts();
      if (mountedRef.current) {
        clearSessionState();
        setLoading(false);
      }
      validationInFlightRef.current = false;
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (!mountedRef.current) return;
      if (error) console.error("Error loading Supabase session:", error);
      const currentSession = data?.session ?? null;
      if (currentSession) {
        ensureSessionStartTimestamp(currentSession);
        ensureLastActivityTimestamp(currentSession);
      }
      if (
        currentSession &&
        (isSessionExpired(currentSession) ||
          isAbsoluteSessionExpired() ||
          isInactivityExpired(currentSession))
      ) {
        await performLocalLogout({
          notice: isProtectedAppRoute(pathnameRef.current)
            ? "Your session has expired. Please sign in again."
            : undefined,
        });
        return;
      }
      syncSessionState(currentSession);
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!mountedRef.current) return;
        const nextFingerprint = getAuthFingerprint(event, newSession);
        const shouldBroadcast =
          nextFingerprint.event !== lastPublishedAuthRef.current.event ||
          nextFingerprint.token !== lastPublishedAuthRef.current.token;

        if (shouldBroadcast && event) {
          publishAuthSync(event, newSession);
          lastPublishedAuthRef.current = nextFingerprint;
        }
        if (newSession) {
          ensureSessionStartTimestamp(newSession);
          ensureLastActivityTimestamp(newSession);
        }
        if (
          newSession &&
          (isSessionExpired(newSession) ||
            isAbsoluteSessionExpired() ||
            isInactivityExpired(newSession))
        ) {
          performLocalLogout({
            notice: isProtectedAppRoute(pathnameRef.current)
              ? "Your session has expired. Please sign in again."
              : undefined,
          });
          return;
        }
        syncSessionState(newSession);
      }
    );

    const unsubscribeSessionSync = subscribeSessionSync((message) => {
      if (!mountedRef.current) return;
      if (message?.kind === "activity") {
        return;
      }
      if (message?.kind !== "auth") return;

      (async () => {
        const { data, error } = await supabase.auth.getSession();
        if (!mountedRef.current) return;
        if (error) console.error("Error syncing Supabase session:", error);
        const currentSession = data?.session ?? null;
        lastPublishedAuthRef.current = getAuthFingerprint(message?.event, currentSession);
        if (
          currentSession &&
          (isSessionExpired(currentSession) ||
            isAbsoluteSessionExpired() ||
            isInactivityExpired(currentSession))
        ) {
          await performLocalLogout({
            notice: isProtectedAppRoute(pathnameRef.current)
              ? "Your session has expired. Please sign in again."
              : undefined,
          });
          return;
        }
        syncSessionState(currentSession);
      })();
    });

    return () => {
      mountedRef.current = false;
      authListener?.subscription?.unsubscribe?.();
      unsubscribeSessionSync?.();
    };
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    setLoading(true);
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    setLoading(false);
    return res;
  };

  const signIn = async (email, password) => {
    setLoading(true);
    const res = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return res;
  };

  const signOut = async () => {
    setLoading(true);
    const res = await supabase.auth.signOut({ scope: "local" });
    clearAuthSessionArtifacts();
    clearSessionState();
    setLoading(false);
    return res;
  };

  const value = useMemo(
    () => ({ user, session, loading, signUp, signIn, signOut }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
