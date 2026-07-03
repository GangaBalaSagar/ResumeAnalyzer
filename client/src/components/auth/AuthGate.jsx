import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import { useNavigate } from "react-router-dom";

export function useAuthGate() {
  const { user } = useAuth();
  const { setPendingAction } = useAuthModal();
  const navigate = useNavigate();

  const requireAuth = (callback) => {
    if (user) {
      callback?.();
      return;
    }

    setPendingAction(() => callback);
    navigate("/login");
  };

  return { requireAuth, user };
}
