import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase/client.js";
import AuthLayout, {
  AuthField,
  AuthInput,
  AuthMessage,
  AuthPrimaryButton,
} from "../../components/auth/AuthLayout.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : undefined,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message || "We couldn't send the reset link.");
      return;
    }
    setNotice(
      "If that email is on file, a reset link is on its way. Check your inbox."
    );
  };

  return (
    <AuthLayout
      eyebrow="Forgotten password"
      title="Enter your email, and we'll send a reset link."
      lede="We'll email you a single-use link to set a new password."
      footer={
        <span>
          Remembered it?{" "}
          <Link to="/login" className="text-ink hover:underline underline-offset-4">
            Return to sign in
          </Link>
          .
        </span>
      }
      note={
        <div className="text-[13px] leading-snug">
          <div className="eyebrow text-[10px]">Note</div>
          <div className="mt-1 font-serif">
            Reset links expire quickly — use it soon after it arrives.
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        <AuthField label="Email on file" htmlFor="email">
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

        <AuthMessage kind="error">{error}</AuthMessage>
        <AuthMessage kind="success">{notice}</AuthMessage>

        <div className="pt-2">
          <AuthPrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Sending link…" : "Send reset link"}
          </AuthPrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}
