import { motion, useTransform } from "framer-motion";

export function HighlighterBand({ progress, className = "", style }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute pointer-events-none ${className}`}
      style={{
        background: "hsl(52 92% 66% / 0.55)",
        mixBlendMode: "multiply",
        transformOrigin: "left center",
        scaleX: progress,
        borderRadius: "1px",
        filter: "blur(0.3px)",
        ...style,
      }}
    />
  );
}

export function PenUnderline({ progress, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute left-0 -bottom-[3px] w-full h-[3px] pointer-events-none ${className}`}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "currentColor",
          opacity: 0.22,
          transformOrigin: "left center",
          scaleX: progress,
          filter: "blur(0.6px)",
        }}
      />
      <motion.div
        className="absolute inset-x-0 top-[0.5px] h-[1.5px] rounded-full"
        style={{
          background: "currentColor",
          opacity: 0.85,
          transformOrigin: "left center",
          scaleX: progress,
        }}
      />
    </div>
  );
}

export function PenGapCircle({ progress, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      width="18" height="22" viewBox="0 0 18 22"
      className={`absolute pointer-events-none ${className}`}
    >
      <motion.path
        d="M 9 3 C 14 3 15 8 15 11 C 15 15 13 19 9 19 C 5 19 3 15 3 11 C 3 7 5 3 9 3"
        fill="none" stroke="currentColor" strokeOpacity="0.7"
        strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

export function InkNote({ progress, children, className = "", style }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute pointer-events-none font-serif italic text-[12px] leading-none text-ink/80 whitespace-nowrap ${className}`}
      style={{ clipPath: useClipReveal(progress), ...style }}
    >
      {children}
    </motion.div>
  );
}

function useClipReveal(progress) {
  return useTransform(progress, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`);
}