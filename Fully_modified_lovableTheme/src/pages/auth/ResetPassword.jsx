import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase/client.js";
import AuthLayout, {
  AuthField,
  AuthInput,
  AuthMessage,
  AuthPrimaryButton,
} from "../../components/auth/AuthLayout.jsx";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase places the recovery session in the URL hash. The client picks it
    // up automatically when detectSessionInUrl is on; we just wait for it.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Also check current session (in case event already fired).
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setReady(true);
    });
    return () => listener?.subscription?.unsubscribe?.();
  }, []);

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
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setError(error.message || "We couldn't update your password.");
      return;
    }
    setNotice("Password updated. Redirecting you to the desk…");
    setTimeout(() => navigate("/app/analyze", { replace: true }), 1200);
  };

  return (
    <AuthLayout
      eyebrow="Set a new password"
      title={
        <>
          A fresh key for{" "}
          <span className="italic font-normal">your desk.</span>
        </>
      }
      lede="Choose a new password. It'll take effect immediately."
      footer={
        <span>
          Back to{" "}
          <Link to="/login" className="text-ink hover:underline underline-offset-4">
            sign in
          </Link>
          .
        </span>
      }
    >
      {!ready ? (
        <AuthMessage kind="info">
          Waiting for a valid recovery link… If you arrived here directly, request
          a new link from the <Link to="/forgot-password" className="text-ink underline underline-offset-4">forgotten password</Link> page.
        </AuthMessage>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-7">
          <AuthField label="New password" htmlFor="password" hint="At least 6 characters.">
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
          <AuthField label="Confirm new password" htmlFor="confirm">
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

          <AuthMessage kind="error">{error}</AuthMessage>
          <AuthMessage kind="success">{notice}</AuthMessage>

          <div className="pt-2">
            <AuthPrimaryButton type="submit" disabled={submitting}>
              {submitting ? "Updating…" : "Update password"}
            </AuthPrimaryButton>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
