import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthNotice } from "../utils/authSession.js";

const AuthModalContext = createContext(undefined);

export function AuthModalProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingAction, setPendingAction] = useState(null);

  const openLoginModal = useCallback((message) => {
    if (message) setAuthNotice(message);
    navigate("/login", {
      replace: true,
      state: {
        from: { pathname: location.pathname, search: location.search },
        message,
      },
    });
  }, [navigate, location.pathname, location.search]);

  const openSignupModal = useCallback(() => navigate("/signup"), [navigate]);
  const openForgotPasswordModal = useCallback(
    () => navigate("/forgot-password"),
    [navigate]
  );

  const executePendingAction = useCallback(() => {
    if (typeof pendingAction === "function") pendingAction();
  }, [pendingAction]);

  const clearPendingAction = useCallback(() => setPendingAction(null), []);

  const value = useMemo(
    () => ({
      pendingAction,
      openLoginModal,
      openSignupModal,
      openForgotPasswordModal,
      setPendingAction,
      executePendingAction,
      clearPendingAction,
    }),
    [
      pendingAction,
      openLoginModal,
      openSignupModal,
      openForgotPasswordModal,
      executePendingAction,
      clearPendingAction,
    ]
  );

  return (
    <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (ctx === undefined)
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  return ctx;
}
