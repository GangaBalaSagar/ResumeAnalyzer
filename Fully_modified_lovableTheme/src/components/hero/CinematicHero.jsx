import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useTransform, useMotionTemplate } from "framer-motion";
import Camera from "./Camera.jsx";
import DeskSurface from "./DeskSurface.jsx";
import { useHeroTimeline, useEnvelope, useDraw } from "./useHeroTimeline.js";

/**
 * CinematicHero — Figma-frame architecture
 * =============================================================
 *
 * Desktop (>=1024px)
 *   One fixed design canvas (DESIGN_W × DESIGN_H). The whole
 *   canvas is uniformly scaled via
 *     scale = min(availableW / DESIGN_W, availableH / DESIGN_H)
 *   so every viewport / zoom shows the SAME composition, only
 *   at a different size.
 *
 * Tablet + mobile (<1024px)
 *   The same component reflows to a vertical narrative:
 *     Chapter → Title → Lede → CTAs → Scroll hint → Animated stage.
 *   The stage keeps its % coordinate system so the exact same
 *   Framer Motion choreography plays inside a smaller box.
 *   The 500vh sticky scroll track is unchanged; the animation
 *   still begins on an empty desk and progresses with scroll.
 *
 * Structure:
 *   <section .hero-scroll>            500vh scroll track
 *     <div .hero-sticky>              100svh sticky viewport
 *       <div .hero-canvas>            1440×820 fixed design frame,
 *                                     centered + scale(--hero-scale)
 *         <div .hero-anchor>          pinned narrative column
 *         <div .hero-stage>           overflow:hidden theatre
 *           <DeskSurface/>
 *           <Camera p>
 *             <ResumeSheet/>          arrives, gets read
 *             <JDSheet/>              arrives beside it
 *             …reading band, verdict sticky, score numeral…
 *           </Camera>
 *         </div>
 *       </div>
 *     </div>
 *   </section>
 */

const DESIGN_W = 1440;
const DESIGN_H = 820;

/* Fixed design coords, in DESIGN_W × DESIGN_H pixel space. */
const ANCHOR_BOX = { left: 88,  top: 96, width: 460, height: 628 };
const STAGE_BOX  = { left: 596, top: 60, width: 780, height: 700 };

const RESUME_LINES = [
  { top: 26, kind: "match", label: "React" },
  { top: 34, kind: "match", label: "TypeScript" },
  { top: 42, kind: "gap",   label: "GraphQL" },
  { top: 50, kind: "match", label: "Node.js" },
  { top: 58, kind: "match", label: "Testing" },
  { top: 66, kind: "gap",   label: "Kubernetes" },
  { top: 74, kind: "match", label: "5+ yrs" },
  { top: 82, kind: "match", label: "Leadership" },
];

const JD_KEYWORDS = [
  { top: 30, w: 44 },
  { top: 40, w: 62 },
  { top: 50, w: 38 },
  { top: 60, w: 54 },
  { top: 70, w: 46 },
];

/* Uniform scale hook — Figma-frame behaviour. */
function useCanvasScale() {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      setScale(Math.min(width / DESIGN_W, height / DESIGN_H));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("orientationchange", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  return { wrapperRef, scale };
}

export default function CinematicHero() {
  const { ref, p } = useHeroTimeline();
  const { wrapperRef, scale } = useCanvasScale();

  /* ---------- Résumé arrival (Act II) ------------------------ */
  const rY   = useTransform(p, [0.12, 0.30], ["46%", "0%"]);
  const rX   = useTransform(p, [0.12, 0.30], ["12%", "0%"]);
  const rRot = useTransform(p, [0.12, 0.24, 0.30], [8, -2.4, -1.6]);
  const rOpa = useTransform(p, [0.12, 0.20], [0, 1]);
  const rTrem = useTransform(p, [0.24, 0.26, 0.28, 0.30], [0, 0.6, -0.3, 0]);
  const rYFin = useMotionTemplate`calc(${rY} + ${rTrem}px)`;

  const rBlur = useTransform(p, [0.32, 0.40, 0.48], [0, 1.2, 0]);
  const rFilter = useMotionTemplate`blur(${rBlur}px)`;

  /* ---------- JD arrival (Act III) --------------------------- */
  const jY   = useTransform(p, [0.30, 0.46], ["-42%", "0%"]);
  const jX   = useTransform(p, [0.30, 0.46], ["-10%", "0%"]);
  const jRot = useTransform(p, [0.30, 0.44, 0.46], [-8, 2.6, 2.0]);
  const jOpa = useTransform(p, [0.30, 0.38], [0, 1]);
  const jBlur = useTransform(p, [0.50, 0.62, 0.76], [0, 0.9, 0]);
  const jFilter = useMotionTemplate`blur(${jBlur}px)`;

  /* ---------- The reading (Act IV) --------------------------- */
  const readT = useTransform(p, [0.48, 0.74], [0, 1]);
  const readTop = useTransform(readT, [0, 1], ["12%", "92%"]);
  const readOpacity = useEnvelope(p, [0.46, 0.50, 0.72, 0.76]);

  /* ---------- Verdict + score (Act V) ------------------------ */
  const stickyOpacity = useTransform(p, [0.76, 0.84], [0, 1]);
  const stickyY = useTransform(p, [0.76, 0.86], ["-140%", "0%"]);
  const stickyRot = useTransform(p, [0.76, 0.84, 0.90], [-14, 6, -3.5]);

  const scoreOpacity = useTransform(p, [0.78, 0.86], [0, 1]);
  const scoreValue = useTransform(p, [0.78, 0.94], [0, 92]);
  const scoreText = useTransform(scoreValue, (v) => String(Math.round(v)).padStart(2, "0"));

  const finalPull = useTransform(p, [0.88, 1.00], [0, 1]);
  const rFinalX = useTransform(finalPull, [0, 1], ["0%", "-3%"]);
  const jFinalX = useTransform(finalPull, [0, 1], ["0%", "3%"]);
  const rFinalRot = useTransform(finalPull, [0, 1], [0, -0.6]);

  const capA = useTransform(p, [0.00, 0.10, 0.16], [1, 1, 0]);
  const capB = useTransform(p, [0.14, 0.22, 0.30, 0.36], [0, 1, 1, 0]);
  const capC = useTransform(p, [0.36, 0.44, 0.48, 0.54], [0, 1, 1, 0]);
  const capD = useTransform(p, [0.54, 0.62, 0.70, 0.76], [0, 1, 1, 0]);
  const capE = useTransform(p, [0.78, 0.86, 1.00], [0, 1, 1]);

  return (
    <section ref={ref} className="hero-scroll">
      <div className="hero-sticky" ref={wrapperRef}>
        <div
          className="hero-canvas"
          style={{
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          {/* =============== LEFT ANCHOR =============== */}
          <div
            className="hero-anchor"
            style={{
              left: ANCHOR_BOX.left,
              top: ANCHOR_BOX.top,
              width: ANCHOR_BOX.width,
              height: ANCHOR_BOX.height,
            }}
          >
            <div className="hero-cover-eyebrow">Vol. I · The Recruiter's Desk</div>
            <h1 className="hero-anchor-title">
              Your résumé,<br />
              <em>read carefully.</em>
            </h1>
            <p className="hero-anchor-lede">
              Drop a résumé on the desk. Paste the role. Receive a quiet,
              considered analysis — the way a senior reviewer would give it.
            </p>
            <div className="hero-anchor-cta">
              <Link to="/analyze" className="hero-btn hero-btn--primary">
                Begin a review
              </Link>
              <Link to="/features" className="hero-btn hero-btn--ghost">
                See what's on the desk
              </Link>
            </div>
            <div className="hero-anchor-hint">
              <span className="hero-eyebrow-mini">Scroll to watch the reading</span>
              <svg width="14" height="20" viewBox="0 0 14 20" aria-hidden="true">
                <path
                  d="M7 1v16M1 12l6 6 6-6"
                  stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* =============== RIGHT STAGE =============== */}
          <div
            className="hero-stage"
            style={{
              left: STAGE_BOX.left,
              top: STAGE_BOX.top,
              width: STAGE_BOX.width,
              height: STAGE_BOX.height,
            }}
          >
            <DeskSurface />

            <Camera p={p}>
              <div className="hero-desk">
                {/* JD — back layer */}
                <motion.div
                  className="hero-paper hero-paper--jd sheet-3d"
                  style={{
                    y: jY,
                    x: useMotionTemplate`calc(${jX} + ${jFinalX})`,
                    rotate: jRot,
                    opacity: jOpa,
                    filter: jFilter,
                  }}
                >
                  <JDSheet p={p} />
                </motion.div>

                {/* Résumé — front layer */}
                <motion.div
                  className="hero-paper hero-paper--resume sheet-3d"
                  style={{
                    y: rYFin,
                    x: useMotionTemplate`calc(${rX} + ${rFinalX})`,
                    rotate: useMotionTemplate`calc(${rRot}deg + ${rFinalRot}deg)`,
                    opacity: rOpa,
                    filter: rFilter,
                  }}
                >
                  <ResumeSheet readT={readT} />

                  <motion.div
                    aria-hidden="true"
                    className="hero-read-band"
                    style={{ top: readTop, opacity: readOpacity }}
                  />

                  <motion.div
                    className="hero-verdict"
                    style={{ opacity: stickyOpacity, y: stickyY, rotate: stickyRot }}
                  >
                    <div className="hero-verdict-eyebrow">Verdict</div>
                    <div className="hero-verdict-line">Send it.</div>
                    <div className="hero-verdict-sub">Strong alignment · minor edits</div>
                  </motion.div>

                  <motion.div className="hero-score" style={{ opacity: scoreOpacity }}>
                    <div className="hero-score-eyebrow">Match</div>
                    <div className="hero-score-num">
                      <motion.span>{scoreText}</motion.span>
                      <span className="hero-score-tail">/100</span>
                    </div>
                  </motion.div>
                </motion.div>

                <div className="hero-captions">
                  <Caption opacity={capA}>Every résumé deserves a careful reading.</Caption>
                  <Caption opacity={capB}>A candidate arrives.</Caption>
                  <Caption opacity={capC}>A role to fill, placed beside it.</Caption>
                  <Caption opacity={capD}>Read line by line, not scanned.</Caption>
                  <Caption opacity={capE}>A verdict, quietly reached.</Caption>
                </div>
              </div>
            </Camera>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResumeSheet({ readT }) {
  return (
    <div className="hero-sheet hero-sheet--resume">
      <svg className="hero-clip" viewBox="0 0 24 40" aria-hidden="true">
        <path
          d="M8 4 Q8 2 10 2 L14 2 Q16 2 16 4 L16 28 Q16 34 10 34 Q4 34 4 28 L4 12 Q4 8 8 8 L14 8"
          fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
        />
      </svg>

      <div className="hero-sheet-header">
        <div className="hero-sheet-eyebrow">Candidate</div>
        <div className="hero-sheet-name">Your Name</div>
        <div className="hero-sheet-sub">Your Title · Experience</div>
      </div>
      <div className="hero-sheet-rule" />

      <div className="hero-sheet-body">
        {RESUME_LINES.map((ln, i) => (
          <ResumeLine key={i} line={ln} readT={readT} />
        ))}
      </div>

      <div className="hero-sheet-foot">
        <span className="hero-sheet-eyebrow">Ref · RES-001</span>
      </div>
    </div>
  );
}

function ResumeLine({ line, readT }) {
  const threshold = (line.top - 12) / 80;
  const opacity = useTransform(readT, [threshold - 0.02, threshold + 0.04], [0, 1]);
  const draw = useTransform(readT, [threshold, threshold + 0.10], [0, 1]);
  const dash = useTransform(draw, (d) => `${d * 40} 40`);
  const isMatch = line.kind === "match";

  return (
    <div className="hero-line" style={{ top: `${line.top}%` }}>
      <div className="hero-line-bar" />
      <motion.svg
        className={`hero-mark ${isMatch ? "is-match" : "is-gap"}`}
        viewBox="0 0 24 24" style={{ opacity }} aria-hidden="true"
      >
        {isMatch ? (
          <motion.path
            d="M4 12 L10 18 L20 6"
            fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            style={{ strokeDasharray: dash }}
          />
        ) : (
          <motion.circle
            cx="12" cy="12" r="8"
            fill="none" strokeWidth="1.8"
            style={{ strokeDasharray: dash, strokeDashoffset: 0 }}
          />
        )}
      </motion.svg>
      <motion.span className="hero-line-label" style={{ opacity }}>
        {line.label}
      </motion.span>
    </div>
  );
}

function JDSheet({ p }) {
  return (
    <div className="hero-sheet hero-sheet--jd">
      <div className="hero-sheet-header">
        <div className="hero-sheet-eyebrow">Role · Brief</div>
        <div className="hero-sheet-name">Your Target Role</div>
        <div className="hero-sheet-sub">Company Name · Location · Type</div>
      </div>
      <div className="hero-sheet-rule" />

      <div className="hero-sheet-body">
        {JD_KEYWORDS.map((k, i) => (
          <JDLine key={i} k={k} i={i} p={p} />
        ))}
      </div>

      <div className="hero-sheet-foot">
        <span className="hero-sheet-eyebrow">Brief · JD-001</span>
      </div>
    </div>
  );
}

function JDLine({ k, i, p }) {
  const start = 0.52 + i * 0.04;
  const draw = useDraw(p, [start, start + 0.08]);
  const width = useTransform(draw, (d) => `${d * k.w}%`);
  return (
    <div className="hero-line" style={{ top: `${k.top}%` }}>
      <div className="hero-line-bar hero-line-bar--jd" />
      <motion.div className="hero-jd-underline" style={{ width, left: "8%" }} />
    </div>
  );
}

function Caption({ opacity, children }) {
  return (
    <motion.p className="hero-caption" style={{ opacity }}>
      {children}
    </motion.p>
  );
}