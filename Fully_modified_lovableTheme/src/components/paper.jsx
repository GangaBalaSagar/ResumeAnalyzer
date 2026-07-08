import { forwardRef } from "react";

export const Sheet = forwardRef(function Sheet(
  {
    children,
    className = "",
    lift = false,
    stack = false,
    dogEar = false,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`relative sheet ${lift ? "sheet-lift" : ""} ${stack ? "sheet-stack" : ""} ${
        dogEar ? "dog-ear" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export function Bookmark({ children, color }) {
  return (
    <div className="bookmark right-6" style={color ? { background: color } : undefined}>
      {children}
    </div>
  );
}

export function StickyNote({ children, className = "", rotate = -1.5 }) {
  return (
    <div className={`sticky-note ${className}`} style={{ transform: `rotate(${rotate}deg)` }}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }) {
  return <div className="eyebrow">{children}</div>;
}

export function PaperClip() {
  return (
    <svg
      className="absolute -top-3 left-6 text-ink-muted/70"
      width="22"
      height="44"
      viewBox="0 0 22 44"
      fill="none"
    >
      <path
        d="M11 4 C5 4 3 8 3 14 V32 C3 38 7 42 13 42 C19 42 21 38 21 32 V12 C21 8 19 6 16 6 C13 6 11 8 11 12 V30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
