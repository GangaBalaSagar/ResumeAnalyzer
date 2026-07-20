import { Link } from "react-router-dom";
import { Sheet, PaperClip, Eyebrow } from "../paper.jsx";

/**
 * StatusSheet — reusable paper-based component for full-page or section-level status states
 * (error, offline, service unavailable, session expired, loading, empty).
 * Matches the Recruiter's Desk design language.
 */
export default function StatusSheet({
  variant = "error",
  title,
  description,
  illustration,
  primaryAction,
  secondaryAction,
  children,
  className = "",
  lift = true,
  dogEar = false,
}) {
  // Map variant to default eyebrows/titles if not provided
  const getDefaults = () => {
    switch (variant) {
      case "loading":
        return {
          eyebrow: "Loading",
          title: "One moment…",
          description: "Please wait while we load the requested information.",
        };
      case "offline":
        return {
          eyebrow: "Network",
          title: "Connection Lost",
          description: "Check your internet connection and try again.",
        };
      case "service unavailable":
        return {
          eyebrow: "System",
          title: "Service Unavailable",
          description: "The server is temporarily unavailable. Please try again in a few minutes.",
        };
      case "session expired":
        return {
          eyebrow: "Auth",
          title: "Session Expired",
          description: "Please sign in again to continue.",
        };
      case "empty":
        return {
          eyebrow: "Archive",
          title: "The cabinet is empty",
          description: "Nothing filed here yet.",
        };
      case "error":
      default:
        return {
          eyebrow: "Attention",
          title: "Something went wrong",
          description: "We encountered an issue processing your request.",
        };
    }
  };

  const defaults = getDefaults();
  const displayEyebrow = defaults.eyebrow;
  const displayTitle = title || defaults.title;
  const displayDescription = description || defaults.description;

  // Default illustrations matching the Recruiter's Desk theme
  const renderDefaultIllustration = () => {
    if (illustration) return illustration;

    switch (variant) {
      case "loading":
        return (
          <div className="mx-auto w-16 h-20 relative mb-6 animate-pulse opacity-85">
            <div className="absolute inset-0 bg-paper border border-rule shadow-stack rotate-[-5deg]" />
            <div className="absolute inset-0 bg-paper border border-rule shadow-paper rotate-[3deg] translate-x-1" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-ink-muted/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        );
      case "empty":
      case "offline":
      case "service unavailable":
      case "session expired":
      case "error":
      default:
        const accentTagColor = 
          variant === "error" || variant === "offline" || variant === "service unavailable"
            ? "border-destructive/30 text-destructive bg-destructive/5 font-serif italic"
            : variant === "session expired"
            ? "border-accent/30 text-accent bg-accent/5 font-serif italic"
            : "border-rule bg-paper";

        return (
          <div className="mx-auto w-20 h-24 relative mb-6">
            <div className="absolute inset-0 bg-paper border border-rule shadow-stack rotate-[-6deg]" />
            <div className="absolute inset-0 bg-paper border border-rule shadow-stack rotate-[2deg] translate-x-1 translate-y-1" />
            <div className={`absolute inset-0 border shadow-paper rotate-[6deg] translate-x-2 translate-y-2 flex flex-col justify-between p-2 text-[8px] tracking-wider uppercase font-semibold text-ink-muted bg-paper`}>
              <div className="flex justify-between items-start">
                <div className="w-6 h-1 bg-ink-muted/20" />
                <div className="w-3 h-3 rounded-full bg-ink-muted/10" />
              </div>
              {variant !== "empty" && (
                <div className={`text-center py-0.5 border border-dashed rounded-sm ${accentTagColor}`}>
                  {variant === "session expired" ? "expired" : variant === "offline" ? "offline" : "failed"}
                </div>
              )}
              <div className="space-y-1">
                <div className="w-12 h-1 bg-ink-muted/20" />
                <div className="w-10 h-1 bg-ink-muted/20" />
              </div>
            </div>
          </div>
        );
    }
  };

  const renderActionButton = (action, isPrimary) => {
    if (!action) return null;

    const { label, onClick, to, disabled, href } = action;
    const baseClass = isPrimary
      ? "px-5 py-2.5 text-sm bg-ink text-paper rounded-sm hover:bg-ink/90 disabled:opacity-50 transition-colors inline-block"
      : "px-5 py-2.5 text-sm border border-ink/20 hover:border-ink/60 rounded-sm disabled:opacity-50 transition-colors bg-paper inline-block";

    if (to) {
      return (
        <Link to={to} className={baseClass} onClick={onClick}>
          {label}
        </Link>
      );
    }

    if (href) {
      return (
        <a href={href} className={baseClass} onClick={onClick}>
          {label}
        </a>
      );
    }

    return (
      <button type="button" onClick={onClick} disabled={disabled} className={baseClass}>
        {label}
      </button>
    );
  };

  return (
    <Sheet className={`relative p-12 text-center ${className}`} lift={lift} dogEar={dogEar}>
      <PaperClip aria-hidden="true" />
      
      {renderDefaultIllustration()}

      <Eyebrow>{displayEyebrow}</Eyebrow>
      
      <div className="mt-3 font-serif text-3xl text-ink">{displayTitle}</div>
      
      {displayDescription && (
        <p className="mt-3 text-sm text-ink-muted max-w-md mx-auto">
          {displayDescription}
        </p>
      )}

      {children && <div className="mt-6">{children}</div>}

      {(primaryAction || secondaryAction) && (
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          {renderActionButton(secondaryAction, false)}
          {renderActionButton(primaryAction, true)}
        </div>
      )}
    </Sheet>
  );
}
