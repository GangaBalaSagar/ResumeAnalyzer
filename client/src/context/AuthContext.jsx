import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase/client";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCurrentSession() {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error("Error loading Supabase session:", error);
      }

      setSession(data?.session ?? null);
      const authUser = data?.session?.user ?? null;
      setUser(authUser);
      setLoading(false);
    }

    loadCurrentSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) {
        return;
      }
      setSession(newSession);
      const authUser = newSession?.user ?? null;
      setUser(authUser);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    setLoading(false);
    return { data, error };
  };

  const signIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { data, error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUser(null);
      setSession(null);
    }

    setLoading(false);
    return { error };
  };

  const value = useMemo(
    () => ({ user, session, loading, signUp, signIn, signOut }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
