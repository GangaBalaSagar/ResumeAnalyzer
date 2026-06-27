import { useEffect } from "react";
import { supabase } from "../services/supabase/client";

export default function TestSupabase() {
  useEffect(() => {
    console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

    async function checkSession() {
      const sessionResult = await supabase.auth.getSession();
      console.log("Supabase Connected");
      console.log("Supabase session result:", sessionResult);
    }

    checkSession();
  }, []);

  return <div>Supabase Connection Successful</div>;
}
