import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";

export default function Signup() {
  const { signUp, signOut } = useAuth();
  const { openLoginModal } = useAuthModal();
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

    const result = await signUp(email, password);

    if (result.error) {
      setError(result.error.message || "Signup failed. Please try again.");
    } else {
      if (result.data?.session) {
        await signOut();
      }
      sessionStorage.setItem("authMessage", "Registration successful");
      setEmail("");
      setPassword("");
      openLoginModal();
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "1rem" }}>
      <h2>Signup</h2>
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: "1rem", color: "green" }}>{message}</div>
      )}
      {error && (
        <div style={{ marginTop: "1rem", color: "crimson" }}>{error}</div>
      )}
    </div>
  );
}
