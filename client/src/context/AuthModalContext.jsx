import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthModalContext = createContext(undefined);

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const [pendingAction, setPendingAction] = useState(null);

  const openLoginModal = useCallback(() => {
    setMode("login");
    setIsOpen(true);
  }, []);

  const openSignupModal = useCallback(() => {
    setMode("signup");
    setIsOpen(true);
  }, []);

  const openForgotPasswordModal = useCallback(() => {
    setMode("forgot");
    setIsOpen(true);
  }, []);

  const openAuthModal = useCallback(() => {
    openLoginModal();
  }, [openLoginModal]);

  const closeAuthModal = useCallback(() => setIsOpen(false), []);

  const executePendingAction = useCallback(() => {
    if (typeof pendingAction === "function") {
      pendingAction();
    }
  }, [pendingAction]);

  const clearPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      mode,
      pendingAction,
      openAuthModal,
      openLoginModal,
      openSignupModal,
      openForgotPasswordModal,
      closeAuthModal,
      setPendingAction,
      executePendingAction,
      clearPendingAction,
    }),
    [
      isOpen,
      mode,
      pendingAction,
      openAuthModal,
      openLoginModal,
      openSignupModal,
      openForgotPasswordModal,
      closeAuthModal,
      executePendingAction,
      clearPendingAction,
    ]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
