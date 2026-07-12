import { motion, useTransform } from "framer-motion";
import { Sheet, Eyebrow } from "../../paper.jsx";
import { HighlighterBand } from "./ReviewMarks.jsx";

export default function ResumeSheet({ p }) {
  const clipOpacity = useTransform(p, [0.22, 0.26], [0, 1]);
  const clipScale = useTransform(p, [0.22, 0.26, 0.28], [0.7, 1.08, 1]);

  const hlInfra = useTransform(p, [0.62, 0.68], [0, 1]);
  const hlStrategy = useTransform(p, [0.66, 0.72], [0, 1]);
  const hlLeadership = useTransform(p, [0.70, 0.76], [0, 1]);

  const stickyOpacity = useTransform(p, [0.77, 0.81], [0, 1]);
  const stickyRotateX = useTransform(p, [0.77, 0.82], [55, 0]);
  const stickyY = useTransform(p, [0.77, 0.82], [-6, 0]);

  return (
    <div className="relative">
      <Sheet className="p-7" dogEar>
        <motion.div
          className="absolute -top-3 left-6"
          style={{ opacity: clipOpacity, scale: clipScale, transformOrigin: "50% 20%" }}
        >
          <ClipSVG />
        </motion.div>

        <Eyebrow>Résumé · Analysis №412</Eyebrow>
        <div className="mt-3 font-serif text-2xl leading-tight">Elena Marsh</div>
        <div className="text-[12px] text-ink-muted mt-0.5">Senior Product Designer · London</div>
        <div className="rule-line mt-4" />

        <div className="mt-5 eyebrow text-[10px]">Experience</div>
        <div className="mt-2 space-y-3">
          <ExpRow role="Lead Designer" org="Northwind" years="2022 — Present" />
          <ExpRow role="Senior Designer" org="Verba" years="2019 — 2022" />
          <ExpRow role="Product Designer" org="Kestrel" years="2016 — 2019" />
        </div>

        <div className="rule-line mt-5" />
        <div className="mt-3 eyebrow text-[10px]">Core strengths</div>

        <div className="mt-3 space-y-3">
          <SkillRow label="Product strategy & vision" width="88%" highlighter={hlStrategy} />
          <SkillRow label="Design systems" width="82%" />
          <SkillRow label="Backend / infra fluency" width="90%" highlighter={hlInfra} />
          <SkillRow label="Team leadership" width="68%" highlighter={hlLeadership} />
        </div>
      </Sheet>

      <motion.div
        className="absolute -bottom-[60px] right-[8px] w-[230px] font-serif italic text-[13px] leading-snug will-change-transform"
        style={{
          opacity: stickyOpacity,
          rotateX: stickyRotateX,
          rotate: -4,
          y: stickyY,
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          background: "var(--color-sticky)",
          color: "var(--color-sticky-foreground)",
          padding: "12px 14px",
          boxShadow: "0 1px 1px rgba(26,26,26,0.06), 0 10px 20px -10px rgba(26,26,26,0.28)",
        }}
      >
        Strong overlap on infra + product. Ships in prod.
      </motion.div>
    </div>
  );
}

function ExpRow({ role, org, years }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="min-w-0">
        <div className="font-serif text-[14px] leading-tight truncate">{role}</div>
        <div className="text-[11px] text-ink-muted truncate">{org}</div>
      </div>
      <div className="text-[10px] text-ink-muted font-mono tabular-nums whitespace-nowrap">{years}</div>
    </div>
  );
}

function SkillRow({ label, width = "80%", highlighter }) {
  return (
    <div className="relative">
      {highlighter && (
        <HighlighterBand
          progress={highlighter}
          className="left-[-4px] right-[38%] top-[-2px] bottom-[8px]"
        />
      )}
      <div className="relative flex items-baseline justify-between gap-3">
        <span className="text-[13px] leading-none">{label}</span>
      </div>
      <div className="mt-1.5 h-1.5 bg-secondary rounded" style={{ width }} />
    </div>
  );
}

function ClipSVG() {
  return (
    <svg className="text-ink-muted/70" width="22" height="44" viewBox="0 0 22 44" fill="none">
      <path
        d="M11 4 C5 4 3 8 3 14 V32 C3 38 7 42 13 42 C19 42 21 38 21 32 V12 C21 8 19 6 16 6 C13 6 11 8 11 12 V30"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}