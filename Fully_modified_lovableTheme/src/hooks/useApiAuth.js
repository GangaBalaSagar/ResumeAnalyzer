import { useLayoutEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useAuthModal } from "../contexts/AuthModalContext.jsx";
import { setupApiInterceptor } from "../api.js";

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

  useLayoutEffect(() => {
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
}
