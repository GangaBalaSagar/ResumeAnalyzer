import { useEffect, useState } from "react";
import { useAuthModal } from "../../context/AuthModalContext";
import Login from "../../pages/auth/Login";
import Signup from "../../pages/auth/Signup";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import ModalContainer from "./modal/ModalContainer";
import ModalHeader from "./modal/ModalHeader";
import AuthMessage from "./modal/AuthMessage";
import ModalActions from "./modal/ModalActions";

export default function AuthModal() {
  const {
    isOpen,
    mode,
    openLoginModal,
    openSignupModal,
    openForgotPasswordModal,
    closeAuthModal,
  } = useAuthModal();
  const [authMessage, setAuthMessage] = useState(null);

  // Check for session expiration message when modal opens
  useEffect(() => {
    if (isOpen) {
      const message = sessionStorage.getItem("authMessage");
      if (message) {
        setAuthMessage(message);
        // Clear the message after displaying it once
        sessionStorage.removeItem("authMessage");
      }
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalContainer>
      <ModalHeader mode={mode} />
      <AuthMessage authMessage={authMessage} />

      {mode === "login" ? (
        <Login />
      ) : mode === "signup" ? (
        <Signup />
      ) : (
        <ForgotPassword onBack={openLoginModal} />
      )}

      <ModalActions
        mode={mode}
        openSignupModal={openSignupModal}
        openLoginModal={openLoginModal}
        closeAuthModal={closeAuthModal}
      />
    </ModalContainer>
  );
}
