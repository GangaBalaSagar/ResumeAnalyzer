import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";

export function useAuthGate() {
  const { user } = useAuth();
  const { openLoginModal, setPendingAction } = useAuthModal();

  const requireAuth = (callback) => {
    if (user) {
      callback?.();
      return;
    }

    setPendingAction(() => callback);
    openLoginModal();
  };

  return { requireAuth, user };
}
