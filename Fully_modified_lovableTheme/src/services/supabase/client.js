import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

function makeStub() {
  const err = {
    message:
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env",
  };
  const noSession = { data: { session: null, user: null }, error: null };
  const listener = { data: { subscription: { unsubscribe: () => {} } } };
  return {
    auth: {
      getSession: async () => noSession,
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => listener,
      signInWithPassword: async () => ({ data: {}, error: err }),
      signUp: async () => ({ data: {}, error: err }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: err }),
      updateUser: async () => ({ data: {}, error: err }),
    },
  };
}

export const supabase =
  url && anon
    ? createClient(url, anon, {
        auth: {
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : makeStub();

export const isSupabaseConfigured = Boolean(url && anon);
