import { Link } from "react-router-dom";
import PublicSite from "../public/PublicSite.jsx";
import { Sheet, StickyNote, Eyebrow, PaperClip } from "../paper.jsx";

/**
 * AuthLayout — an editorial "sign-in desk" that reuses the paper design system.
 * Left column: the Sheet with the form (children).
 * Right column: a StickyNote with contextual copy, plus a stacked paper prop.
 */
export default function AuthLayout({
  eyebrow,
  title,
  lede,
  children,
  footer,
  note,
}) {
  return (
    <PublicSite>
      <div className="mx-auto max-w-7xl px-6">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pt-6 pb-16">
        {/* Form sheet */}
        <div className="lg:col-span-7 animate-fade-up">
          <Sheet lift className="relative p-8 md:p-12">
            <PaperClip />
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-4 font-serif text-[44px] leading-[1.05] tracking-tight">
              {title}
            </h1>
            {lede && (
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted max-w-lg">
                {lede}
              </p>
            )}
            <div className="rule-line my-8" />
            {children}
            {footer && (
              <>
                <div className="rule-line mt-10" />
                <div className="mt-6 text-sm text-ink-muted">{footer}</div>
              </>
            )}
          </Sheet>
        </div>

        {/* Editorial aside */}
        <aside className="lg:col-span-5 relative min-h-[420px] hidden lg:block">
          <div className="absolute right-8 top-4 w-[300px] h-[380px] sheet sheet-stack dog-ear p-7 rotate-[3deg]">
            <Eyebrow>Desk Note</Eyebrow>
            <div className="mt-3 font-serif text-xl leading-snug">
              A quiet workspace for resume analysis.
            </div>
            <div className="rule-line my-4" />
            <p className="text-sm text-ink-muted leading-relaxed">
              Your sessions, saved analyses and drafts remain on the desk between
              visits — filed, indexed and ready to reopen.
            </p>
            <div className="mt-6 eyebrow text-[10px]">Review 01 · Sign in</div>
          </div>
          <StickyNote className="absolute left-2 bottom-4 w-[220px]" rotate={-3}>
            {note || (
              <div className="text-[13px] leading-snug">
                <div className="eyebrow text-[10px]">Reminder</div>
                <div className="mt-1 font-serif">
                  Bring the job description. It sharpens the analysis.
                </div>
              </div>
            )}
          </StickyNote>
        </aside>
      </section>
      </div>
    </PublicSite>
  );
}

/* ---------------- Form primitives (paper-themed) ---------------- */

export function AuthField({ label, hint, htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="eyebrow text-[10px]">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && (
        <span className="mt-1.5 block text-[11px] text-ink-muted italic font-serif">
          {hint}
        </span>
      )}
    </label>
  );
}

export function AuthInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full bg-transparent border-0 border-b border-rule focus:border-ink text-ink placeholder:text-ink-muted/60 font-serif text-[17px] py-2 px-0 outline-none transition-colors ${className}`}
    />
  );
}

export function AuthPrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center h-11 px-6 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function AuthSecondaryLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm text-ink-muted hover:text-ink underline-offset-4 hover:underline transition-colors"
    >
      {children}
    </Link>
  );
}

export function AuthMessage({ kind = "info", children }) {
  if (!children) return null;
  const tone =
    kind === "error"
      ? "border-destructive/60 bg-destructive/5 text-destructive"
      : kind === "success"
      ? "border-accent/60 bg-accent/10 text-ink"
      : "border-rule bg-secondary/40 text-ink-muted";
  return (
    <div
      className={`border-l-2 pl-4 py-3 pr-4 text-sm font-serif italic ${tone}`}
      role={kind === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
