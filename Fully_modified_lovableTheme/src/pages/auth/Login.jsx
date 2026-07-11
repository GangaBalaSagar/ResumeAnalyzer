import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useAuthModal } from "../../contexts/AuthModalContext.jsx";
import { consumeAuthNotice } from "../../utils/authSession.js";
import AuthLayout, {
  AuthField,
  AuthInput,
  AuthMessage,
  AuthPrimaryButton,
  AuthSecondaryLink,
} from "../../components/auth/AuthLayout.jsx";

export default function Login() {
  const { signIn } = useAuth();
  const { executePendingAction, clearPendingAction } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/app/analyze";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const message = location.state?.message || consumeAuthNotice();
    if (message) setNotice(message);
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error.message || "We couldn't sign you in.");
      return;
    }
    executePendingAction?.();
    clearPendingAction?.();
    navigate(from, { replace: true });
  };

    return (
    <AuthLayout
      eyebrow="Review access"
      title="Welcome back."
      lede="Sign in to reopen your analyses, drafts, and archived reports."
      footer={
        <span>
          New here?{" "}
          <Link to="/signup" className="text-ink hover:underline underline-offset-4">
            Create an account
          </Link>
          .
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        <AuthField label="Email" htmlFor="email">
          <AuthInput
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
          />
        </AuthField>

        <AuthField label="Password" htmlFor="password">
          <AuthInput
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </AuthField>

        <AuthMessage kind="error">{error}</AuthMessage>
        <AuthMessage>{notice}</AuthMessage>

        <div className="flex items-center justify-between pt-2">
          <AuthPrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </AuthPrimaryButton>
          <AuthSecondaryLink to="/forgot-password">
            Forgot your password?
          </AuthSecondaryLink>
        </div>
      </form>
    </AuthLayout>
  );
}
