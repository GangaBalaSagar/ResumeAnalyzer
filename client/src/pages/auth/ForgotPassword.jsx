import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase/client";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message || "Unable to send reset link. Please try again.");
    } else {
      setMessage("Password reset link has been sent to your email.");
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "1rem" }}>
      <h2>Forgot Password</h2>
      <p style={{ marginBottom: "1rem", color: "#555" }}>
        Enter your email address and we will send you a password reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "0.75rem" }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
          {loading ? "Sending reset link..." : "Send reset link"}
        </button>
      </form>

      {message && <div style={{ marginTop: "1rem", color: "green" }}>{message}</div>}
      {error && <div style={{ marginTop: "1rem", color: "crimson" }}>{error}</div>}

      <button
        type="button"
        onClick={() => navigate("/login")}
        style={{
          width: "100%",
          padding: "0.75rem",
          marginTop: "1rem",
          cursor: "pointer",
          border: "1px solid #ccc",
          background: "#fff",
        }}
      >
        Back to Login
      </button>
    </div>
  );
}
