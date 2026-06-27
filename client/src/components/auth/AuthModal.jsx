import { useEffect, useState } from "react";
import { useAuthModal } from "../../context/AuthModalContext";
import Login from "../../pages/auth/Login";
import Signup from "../../pages/auth/Signup";
import ForgotPassword from "../../pages/auth/ForgotPassword";

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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 360,
          padding: "1.5rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "0.5rem" }}>
          {mode === "login"
            ? "Login Required"
            : mode === "signup"
            ? "Create Account"
            : "Forgot Password"}
        </h2>

        {/* Session Expiration Message */}
        {authMessage && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "1rem",
              color: "#856404",
              fontSize: "0.95rem",
            }}
          >
            {authMessage}
          </div>
        )}

        <p style={{ marginBottom: "1rem", color: "#555" }}>
          {mode === "forgot"
            ? "Enter your email to receive a password reset link."
            : "Please login or create an account to continue."}
        </p>

        {mode === "login" ? <Login /> : mode === "signup" ? <Signup /> : <ForgotPassword onBack={openLoginModal} />}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
          {mode === "login" ? (
            <button
              type="button"
              onClick={openSignupModal}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Don't have an account? Sign Up
            </button>
          ) : mode === "signup" ? (
            <button
              type="button"
              onClick={openLoginModal}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Already have an account? Login
            </button>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          )}
          <button
            type="button"
            onClick={closeAuthModal}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#f5f5f5",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
