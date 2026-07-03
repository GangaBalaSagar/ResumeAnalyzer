import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signOut, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const emailPattern = /^\S+@\S+\.\S+$/;
  const isEmailValid = emailPattern.test(email.trim());
  const canSubmit = isEmailValid && password.length > 0;

  const labelStyle = { display: "block", marginBottom: "0.75rem" };
  const inputStyle = {
    width: "100%",
    height: 44,
    padding: "0 0.95rem",
    marginTop: "0.25rem",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  };

  useEffect(() => {
    const authMessage = sessionStorage.getItem("authMessage");
    if (authMessage) {
      setMessage(authMessage);
      sessionStorage.removeItem("authMessage");
    }
  }, []);

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
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
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
          <label style={labelStyle}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Password
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                style={{ ...inputStyle, paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "0.3rem 0.45rem",
                  fontSize: "0.85rem",
                  lineHeight: 1,
                  background: "transparent",
                  border: "none",
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "1rem",
              cursor: !canSubmit || loading ? "not-allowed" : "pointer",
              opacity: !canSubmit || loading ? 0.65 : 1,
            }}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
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
          </button>
        </form>
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
