import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../services/supabase/client.js";
import {
  clearAuthSessionArtifacts,
  ensureSessionStartTimestamp,
  isAbsoluteSessionExpired,
  isSessionExpired,
  setAuthNotice,
} from "../utils/authSession.js";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);
  const validationInFlightRef = useRef(false);

  const clearSessionState = () => {
    setUser(null);
    setSession(null);
  };

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
      }
      if (
        currentSession &&
        (isSessionExpired(currentSession) || isAbsoluteSessionExpired())
      ) {
        await performLocalLogout({
          notice: "Your session has expired. Please sign in again.",
        });
        return;
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mountedRef.current) return;
        if (newSession) {
          ensureSessionStartTimestamp(newSession);
        }
        if (newSession && (isSessionExpired(newSession) || isAbsoluteSessionExpired())) {
          performLocalLogout({
            notice: "Your session has expired. Please sign in again.",
          });
          return;
        }
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      mountedRef.current = false;
      authListener?.subscription?.unsubscribe?.();
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
