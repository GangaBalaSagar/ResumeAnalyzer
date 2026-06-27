import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import { setupApiInterceptor } from "../api";

/**
 * useApiAuth Hook
 * 
 * Automatically configures the API client with Supabase authentication token
 * and handles session expiration globally.
 * 
 * Usage:
 *   function MyComponent() {
 *     useApiAuth();  // Just call it once, usually in App.jsx or top-level component
 *     return ...
 *   }
 * 
 * How it works:
 * 1. Subscribes to auth state changes via useAuth()
 * 2. When session changes, updates the API interceptor
 * 3. If user logs in:
 *    - Authorization: Bearer <access_token> is added to all API requests
 * 4. If user logs out:
 *    - Authorization header is no longer added
 * 5. If token is invalid/expired (401):
 *    - Response interceptor detects this
 *    - Saves pending action to retry after re-auth
 *    - Signs out the user
 *    - Opens login modal with expiration message
 *    - After user logs back in, pending action is executed
 */
export function useApiAuth() {
  const { session, signOut } = useAuth();
  const { openLoginModal, setPendingAction } = useAuthModal();

  useEffect(() => {
    // Configure interceptor whenever session changes
    // Pass callbacks for session expiration handling
    setupApiInterceptor(session, signOut, openLoginModal, setPendingAction);

    if (session?.access_token) {
      console.log("🔐 API auth configured with access token");
      console.log("📋 Session expiration handler enabled");
    } else {
      console.log("🔓 API auth cleared (no active session)");
    }
  }, [session, signOut, openLoginModal, setPendingAction]);
}

export default useApiAuth;
