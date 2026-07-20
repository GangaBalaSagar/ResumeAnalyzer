import React from "react";

/**
 * StatusInline — reusable inline status indicator for form validations, alerts, and inline state notices.
 * Keeps styling subtle and consistent with Recruiter's Desk (left-bordered, italic, serif font).
 */
export default function StatusInline({
  variant = "error", // error, warning, info, success
  message,
  className = "",
  children,
}) {
  if (!message && !children) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return "border-amber-500/60 bg-amber-500/5 text-amber-800";
      case "info":
        return "border-ink-muted/40 bg-ink-muted/5 text-ink-muted";
      case "success":
        return "border-accent/60 bg-accent/5 text-accent";
      case "error":
      default:
        return "border-destructive/60 bg-destructive/5 text-destructive";
    }
  };

  return (
    <div
      className={`border-l-2 pl-4 pr-4 py-3 text-sm font-serif italic transition-all duration-200 ${getVariantStyles()} ${className}`}
      role="alert"
    >
      {message || children}
    </div>
  );
}
