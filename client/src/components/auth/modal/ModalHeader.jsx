export default function ModalHeader({ mode }) {
  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>
        {mode === "login"
          ? "Login Required"
          : mode === "signup"
          ? "Create Account"
          : "Forgot Password"}
      </h2>

      <p style={{ marginBottom: "1rem", color: "#555" }}>
        {mode === "forgot"
          ? "Enter your email to receive a password reset link."
          : "Please login or create an account to continue."}
      </p>
    </>
  );
}
