import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";

export default function Login() {
  const { signIn, signOut, user } = useAuth();
  const { executePendingAction, clearPendingAction, closeAuthModal, openForgotPasswordModal } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error.message || "Login failed. Please try again.");
    } else {
      setMessage("Login successful.");
      setEmail("");
      setPassword("");
      executePendingAction();
      clearPendingAction();
      closeAuthModal();
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    const result = await signOut();

    if (result.error) {
      setError(result.error.message || "Logout failed. Please try again.");
    } else {
      setMessage("Logged out successfully.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "1rem" }}>
      <h2>Login</h2>
      {user ? (
        <div>
          <div style={{ marginBottom: "1rem", color: "#333" }}>
            Logged in as: {user.email}
          </div>
          <div style={{ marginBottom: "1rem", color: "#333" }}>
            Session status: Active
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={openForgotPasswordModal}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.75rem",
              cursor: loading ? "not-allowed" : "pointer",
              border: "1px solid #ccc",
              background: "#fff",
            }}
          >
            Forgot Password?
          </button>        </form>
      )}

      {message && (
        <div style={{ marginTop: "1rem", color: "green" }}>{message}</div>
      )}
      {error && (
        <div style={{ marginTop: "1rem", color: "crimson" }}>{error}</div>
      )}
    </div>
  );
}
