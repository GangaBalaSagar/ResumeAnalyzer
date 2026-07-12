import { motion, useTransform } from "framer-motion";
import { Sheet, Bookmark, Eyebrow } from "../../paper.jsx";
import { PenUnderline, PenGapCircle, InkNote } from "./ReviewMarks.jsx";

export default function JobDescriptionSheet({ p }) {
  const uInfra = useTransform(p, [0.62, 0.68], [0, 1]);
  const uQuietCraft = useTransform(p, [0.66, 0.72], [0, 1]);
  const uWriting = useTransform(p, [0.70, 0.76], [0, 1]);

  const gapCircle = useTransform(p, [0.85, 0.91], [0, 1]);
  const gapNote = useTransform(p, [0.88, 0.93], [0, 1]);

  const stickyOpacity = useTransform(p, [0.94, 0.97], [0, 1]);
  const stickyRotateX = useTransform(p, [0.94, 0.98], [55, 0]);
  const stickyY = useTransform(p, [0.94, 0.98], [-6, 0]);

  return (
    <div className="relative">
      <Sheet className="p-6">
        <Bookmark>Role</Bookmark>
        <Eyebrow>Job Description · Atlas Labs</Eyebrow>
        <div className="mt-3 font-serif text-xl leading-tight">Senior Product Manager</div>
        <div className="text-[12px] text-ink-muted mt-0.5">Remote · Full-time</div>
        <div className="rule-line mt-4" />

        <div className="mt-4 eyebrow text-[10px]">What we're looking for</div>
        <ul className="mt-2.5 space-y-3 text-[13px] leading-snug text-ink-muted">
          <ReqRow underline={uInfra}>7+ years in product, ideally in developer or infrastructure tools.</ReqRow>
          <ReqRow underline={uQuietCraft}>A track record of shipping quiet, high-craft software.</ReqRow>
          <ReqRow underline={uWriting}>Comfort writing — specs, memos, and the occasional essay.</ReqRow>

          <li className="relative flex gap-2">
            <span className="text-ink-muted/50">—</span>
            <span>On-call rotation. Kubernetes an advantage.</span>
            <PenGapCircle progress={gapCircle} className="-left-[22px] top-[-2px] text-ink" />
            <InkNote progress={gapNote} className="-left-[68px] top-[-2px] -rotate-[6deg] text-ink">
              missing
            </InkNote>
          </li>
        </ul>
      </Sheet>

      <motion.div
        className="absolute -bottom-[64px] left-[8px] w-[240px] font-serif italic text-[13px] leading-snug will-change-transform"
        style={{
          opacity: stickyOpacity,
          rotateX: stickyRotateX,
          rotate: 3,
          y: stickyY,
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          background: "hsl(18 62% 88% / 1)",
          color: "var(--color-sticky-foreground)",
          padding: "12px 14px",
          boxShadow: "0 1px 1px rgba(26,26,26,0.06), 0 10px 20px -10px rgba(26,26,26,0.28)",
        }}
      >
        Missing: Kubernetes, on-call rotation. Worth a note in outreach.
      </motion.div>
    </div>
  );
}

function ReqRow({ underline, children }) {
  return (
    <li className="flex gap-2">
      <span className="text-ink-muted/50">—</span>
      <span className="relative inline-block text-ink">
        {children}
        {underline && <PenUnderline progress={underline} className="text-ink" />}
      </span>
    </li>
  );
}