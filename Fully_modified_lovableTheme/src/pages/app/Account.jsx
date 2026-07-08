import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, Eyebrow, StickyNote, PaperClip } from "../../components/paper.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { supabase } from "../../services/supabase/client.js";

/**
 * Account — a personal dossier.
 *
 * Reuses the editorial paper primitives exactly. Does not modify
 * AuthContext, Supabase integration, session handling, password reset flow,
 * or backend contracts. Password reset uses the same
 * `supabase.auth.resetPasswordForEmail(...)` + `/reset-password` route
 * pattern as the existing ForgotPassword page.
 */

function fmt(iso, opts) {
  if (!iso) return "—";
  const d = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(
    undefined,
    opts || { month: "short", day: "numeric", year: "numeric" }
  );
}

function fmtDateTime(iso) {
  return fmt(iso, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initialsFor(user) {
  const meta = user?.user_metadata || {};
  const name = meta.full_name || meta.name || "";
  if (name) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "·";
  }
  return (user?.email?.[0] || "·").toUpperCase();
}

export default function Account() {
  const { user, session, signOut } = useAuth();
  const navigate = useNavigate();

  const [resetStatus, setResetStatus] = useState("idle"); // idle | sending | sent | error
  const [resetError, setResetError] = useState(null);
  const [signingOut, setSigningOut] = useState(false);

  const meta = user?.user_metadata || {};
  const displayName = meta.full_name || meta.name || null;
  const email = user?.email || "—";
  const provider =
    user?.app_metadata?.provider ||
    (user?.identities && user.identities[0]?.provider) ||
    "email";

  const sessionMeta = useMemo(() => {
    return {
      createdAt: user?.created_at,
      lastSignIn: user?.last_sign_in_at,
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000) : null,
      userId: user?.id,
    };
  }, [user, session]);

  async function handleResetPassword() {
    if (!email || email === "—") return;
    setResetStatus("sending");
    setResetError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : undefined,
    });
    if (error) {
      setResetStatus("error");
      setResetError(error.message || "Could not send reset instructions.");
      return;
    }
    setResetStatus("sent");
  }

  async function handleSignOut() {
    setSigningOut(true);
    const res = await signOut();
    setSigningOut(false);
    if (!res?.error) navigate("/", { replace: true });
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <Eyebrow>The dossier · Your account</Eyebrow>
          <h1 className="mt-3 font-serif text-[44px] md:text-[52px] leading-[1.02] tracking-tight">
            On file, <span className="italic font-normal">in your name.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted max-w-xl">
            A quiet record of who's signed in, when the desk last saw you, and
            the tools that keep the ledger yours.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* MAIN — dossier body */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Identity card */}
          <Sheet className="relative p-6 md:p-8" lift>
            <PaperClip />
            <Eyebrow>Profile</Eyebrow>
            <div className="mt-4 flex items-center gap-5 flex-wrap">
              <div className="relative h-16 w-16 shrink-0">
                <div className="absolute inset-0 bg-paper border border-rule shadow-paper rounded-sm" />
                <div className="absolute inset-0 flex items-center justify-center font-serif text-[24px] text-ink">
                  {initialsFor(user)}
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-serif text-[28px] leading-tight truncate">
                  {displayName || email.split("@")[0]}
                </div>
                <div className="mt-1 text-[13px] text-ink-muted font-mono truncate">
                  {email}
                </div>
              </div>
            </div>
            <div className="rule-line my-6" />
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <FieldRow label="Display name" value={displayName || "— not set —"} muted={!displayName} />
              <FieldRow label="Email" value={email} />
              <FieldRow label="Sign-in method" value={provider} mono />
              <FieldRow label="Member since" value={fmt(sessionMeta.createdAt)} />
            </dl>
          </Sheet>

          {/* Security */}
          <Sheet className="relative p-6 md:p-8">
            <Eyebrow>Security · Password</Eyebrow>
            <div className="mt-2 font-serif text-[24px] leading-tight">
              A new key, sent to your inbox.
            </div>
            <div className="rule-line my-5" />
            <p className="text-[14.5px] leading-relaxed text-ink-muted max-w-lg">
              We'll email you a private link. Follow it to set a new password on
              this account. The link opens the desk's password page and expires
              shortly after it's sent.
            </p>

            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetStatus === "sending" || resetStatus === "sent"}
                className="px-4 py-2.5 text-sm bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resetStatus === "sending"
                  ? "Sending…"
                  : resetStatus === "sent"
                  ? "Sent ✓"
                  : "Send reset instructions →"}
              </button>
              {resetStatus === "sent" && (
                <span className="text-[13px] font-serif italic text-ink-muted">
                  Check {email} for the link.
                </span>
              )}
              {resetStatus === "error" && (
                <span className="text-[13px] font-serif italic text-destructive">
                  {resetError}
                </span>
              )}
            </div>
          </Sheet>

          {/* Sign out */}
          <Sheet className="relative p-6 md:p-8">
            <Eyebrow>Leave the desk</Eyebrow>
            <div className="mt-2 font-serif text-[22px] leading-tight">
              Sign out of this browser.
            </div>
            <div className="rule-line my-5" />
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-[14px] text-ink-muted max-w-md">
                Ends this session on this device. Your archive stays intact and
                is waiting when you return.
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="px-4 py-2.5 text-sm border border-ink/20 hover:border-ink/60 rounded-sm transition-colors disabled:opacity-60"
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </Sheet>
        </div>

        {/* RIGHT RAIL */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <Sheet className="relative p-6">
            <Eyebrow>Session</Eyebrow>
            <div className="mt-2 font-serif text-xl leading-tight">
              This visit, on the record.
            </div>
            <div className="rule-line my-4" />
            <dl className="space-y-4">
              <SessionRow label="Last sign-in" value={fmtDateTime(sessionMeta.lastSignIn)} />
              <SessionRow
                label="Session expires"
                value={
                  sessionMeta.expiresAt
                    ? fmtDateTime(sessionMeta.expiresAt)
                    : "—"
                }
              />
              <SessionRow label="Provider" value={provider} mono />
            </dl>
            <div className="rule-line my-4" />
            <div>
              <div className="eyebrow text-[10px]">Account ID</div>
              <div
                className="mt-1 font-mono text-[11px] text-ink-muted break-all"
                title={sessionMeta.userId}
              >
                {sessionMeta.userId || "—"}
              </div>
            </div>
          </Sheet>

          <StickyNote rotate={-2}>
            <div className="text-[13.5px] leading-snug">
              <div className="eyebrow text-[10px]">Desk Note</div>
              <div className="mt-1 font-serif">
                Your email is the only key we keep. Rotate it whenever you like —
                the archive travels with the account, not the browser.
              </div>
            </div>
          </StickyNote>

          <Sheet className="relative p-6">
            <Eyebrow>House rules</Eyebrow>
            <div className="rule-line mt-3 mb-4" />
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">§</span>
                <span className="text-ink-muted">
                  Password links are single-use and expire quickly.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">§</span>
                <span className="text-ink-muted">
                  Signing out clears only this device's session.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">§</span>
                <span className="text-ink-muted">
                  We never share the contents of your archive.
                </span>
              </li>
            </ul>
          </Sheet>
        </aside>
      </div>
    </div>
  );
}

/* --------------------------- small presentation --------------------------- */

function FieldRow({ label, value, mono, muted }) {
  return (
    <div>
      <dt className="eyebrow text-[10px]">{label}</dt>
      <dd
        className={`mt-1.5 ${mono ? "font-mono text-[13px]" : "font-serif text-[16px]"} ${
          muted ? "text-ink-muted italic" : "text-ink"
        } break-words`}
      >
        {value}
      </dd>
    </div>
  );
}

function SessionRow({ label, value, mono }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="eyebrow text-[10px] shrink-0">{label}</dt>
      <dd
        className={`text-right ${
          mono ? "font-mono text-[12px]" : "font-serif text-[14px]"
        } text-ink`}
      >
        {value}
      </dd>
    </div>
  );
}
