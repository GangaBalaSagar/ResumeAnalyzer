import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase/client";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function checkRecoverySession() {
      console.log("URL:", window.location.href);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("Recovery Session:", session);

      if (!session) {
        setError(
          "This password reset link is invalid or has expired. Please request a new one."
        );
      }

      setChecking(false);
    }

    checkRecoverySession();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Password updated successfully. Redirecting to login...");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  }

  if (checking) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Checking reset link...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>Reset Password</h2>

      {error && (
        <div style={{ color: "crimson", marginBottom: 15 }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ color: "green", marginBottom: 15 }}>
          {success}
        </div>
      )}

      {!success && !error.includes("invalid") && (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 15 }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 20 }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}