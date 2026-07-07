import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import AuthLayout, {
  AuthField,
  AuthInput,
  AuthMessage,
  AuthPrimaryButton,
} from "../../components/auth/AuthLayout.jsx";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setSubmitting(true);
    const { data, error } = await signUp(email, password, { full_name: name });
    setSubmitting(false);
    if (error) {
      setError(error.message || "We couldn't create your account.");
      return;
    }
    if (data?.session) {
      navigate("/upload", { replace: true });
    } else {
      setNotice(
        "Check your inbox — we've sent a confirmation link to complete your registration."
      );
    }
  };

  return (
    <AuthLayout
      eyebrow="Request a seat"
      title={
        <>
          Reserve a place at{" "}
          <span className="italic font-normal">the desk.</span>
        </>
      }
      lede="Create an account to save analyses, keep a private archive and pick up where you left off."
      footer={
        <span>
          Already a member?{" "}
          <Link to="/login" className="text-ink hover:underline underline-offset-4">
            Sign in
          </Link>
          .
        </span>
      }
      note={
        <div className="text-[13px] leading-snug">
          <div className="eyebrow text-[10px]">Fine print</div>
          <div className="mt-1 font-serif">
            Just an email and a password. No committees, no lengthy forms.
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        <AuthField label="Full name" htmlFor="name">
          <AuthInput
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Elena Marsh"
          />
        </AuthField>

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

        <div className="grid md:grid-cols-2 gap-6">
          <AuthField label="Password" htmlFor="password" hint="At least 6 characters.">
            <AuthInput
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </AuthField>
          <AuthField label="Confirm password" htmlFor="confirm">
            <AuthInput
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </AuthField>
        </div>

        <AuthMessage kind="error">{error}</AuthMessage>
        <AuthMessage kind="success">{notice}</AuthMessage>

        <div className="pt-2">
          <AuthPrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Preparing your desk…" : "Create account"}
          </AuthPrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}
