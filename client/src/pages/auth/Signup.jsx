import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, signOut } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const emailPattern = /^\S+@\S+\.\S+$/;
  const isEmailValid = emailPattern.test(email.trim());
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const satisfiedCount = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  const strengthLabel =
    satisfiedCount >= 5 ? "Strong" : satisfiedCount >= 3 ? "Medium" : "Weak";

  const confirmTouched = confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword;
  const confirmAttempted = confirmTouched && confirmPassword.length >= 3;
  const confirmMismatchColor =
    confirmAttempted && !passwordsMatch ? "crimson" : "#888";
  const confirmFeedback = confirmPassword.length === 0
    ? "Waiting for confirmation"
    : passwordsMatch
    ? "✓ Passwords match"
    : confirmAttempted
    ? "Passwords do not match"
    : "Waiting for confirmation";

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    isEmailValid &&
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar &&
    passwordsMatch;

  const inputStyle = {
    width: "100%",
    height: 44,
    padding: "0 0.95rem",
    marginTop: "0.25rem",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.7rem",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password;
    const trimmedConfirmPassword = confirmPassword;

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedConfirmPassword
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordPattern.test(trimmedPassword)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      setLoading(false);
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const fullName = `${trimmedFirstName} ${trimmedLastName}`;
    const metadata = {
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      fullName,
      full_name: fullName,
    };

    const result = await signUp(trimmedEmail, trimmedPassword, metadata);

    if (result.error) {
      setError(result.error.message || "Signup failed. Please try again.");
    } else {
      if (result.data?.session) {
        await signOut();
      }
      sessionStorage.setItem("authMessage", "Registration successful");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            marginBottom: "0.75rem",
          }}
        >
          <label style={labelStyle}>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
              style={inputStyle}
            />
          </label>
        </div>

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
              style={{
                ...inputStyle,
                paddingRight: "3rem",
                marginTop: "0.25rem",
              }}
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

        <div
          style={{
            display: "grid",
            gap: "0.25rem",
            fontSize: "0.82rem",
            color: "#444",
            marginBottom: "0.75rem",
            paddingLeft: "0.25rem",
          }}
        >
          <div style={{ fontWeight: 600 }}>Password strength: {strengthLabel}</div>
          <div style={{ display: "grid", gap: "0.15rem", paddingLeft: "0.5rem" }}>
            <div style={{ color: hasMinLength ? "green" : "#999" }}>
              {hasMinLength ? "✓" : "○"} 8 chars
            </div>
            <div style={{ color: hasUppercase ? "green" : "#999" }}>
              {hasUppercase ? "✓" : "○"} Uppercase
            </div>
            <div style={{ color: hasLowercase ? "green" : "#999" }}>
              {hasLowercase ? "✓" : "○"} Lowercase
            </div>
            <div style={{ color: hasNumber ? "green" : "#999" }}>
              {hasNumber ? "✓" : "○"} Number
            </div>
            <div style={{ color: hasSpecialChar ? "green" : "#999" }}>
              {hasSpecialChar ? "✓" : "○"} Special
            </div>
          </div>
        </div>

        <label style={labelStyle}>
          Confirm Password
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              style={{
                ...inputStyle,
                paddingRight: "3rem",
                marginTop: "0.25rem",
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
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
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div
            style={{
              marginTop: "0.35rem",
              color: passwordsMatch ? "green" : confirmMismatchColor,
              fontSize: "0.88rem",
            }}
          >
            {confirmFeedback}
          </div>
        </label>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginTop: "0.75rem",
            cursor: !canSubmit || loading ? "not-allowed" : "pointer",
            opacity: !canSubmit || loading ? 0.65 : 1,
          }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: "0.75rem", color: "green" }}>{message}</div>
      )}
      {error && (
        <div style={{ marginTop: "0.75rem", color: "crimson" }}>{error}</div>
      )}
    </div>
  );
}
