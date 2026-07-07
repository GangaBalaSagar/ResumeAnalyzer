import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase/client.js";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) console.error("Error loading Supabase session:", error);
      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
      setLoading(false);
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    return () => {
      mounted = false;
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
    const res = await supabase.auth.signOut();
    if (!res.error) {
      setUser(null);
      setSession(null);
    }
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
