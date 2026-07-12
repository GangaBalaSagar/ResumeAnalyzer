import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Sheet, PaperClip, Eyebrow } from "../paper.jsx";
import DeskStage from "./DeskStage.jsx";
import ResumeSheet from "./scenes/ResumeSheet.jsx";
import JobDescriptionSheet from "./scenes/JobDescriptionSheet.jsx";

export default function CinematicHero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative">
      <div className={reduce ? "hidden" : "hidden lg:block"}>
        <ScrollHero />
      </div>
      <div className={reduce ? "block" : "lg:hidden"}>
        <StaticHero />
      </div>
    </section>
  );
}

function ScrollHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.6,
  });

  // Camera
  const camScale = useTransform(p, [0, 0.7, 1], [1, 1.035, 1.03]);
  const camTiltX = useTransform(p, [0, 0.7, 1], [6, 3, 3]);

  // Masthead
  const mastheadOpacity = useTransform(p, [0, 0.12, 0.24], [1, 0.55, 0]);
  const mastheadY = useTransform(p, [0, 0.24], [0, -18]);

  // Résumé arrival
  const resumeY = useTransform(p, [0.09, 0.23], ["55vh", "0vh"]);
  const resumeX = useTransform(p, [0.09, 0.23], ["8vw", "0vw"]);
  const resumeRotate = useTransform(p, [0.09, 0.23], [10, -1.6]);
  const resumeOpacity = useTransform(p, [0.08, 0.15], [0, 1]);

  // JD arrival
  const jdY = useTransform(p, [0.27, 0.42], ["-45vh", "0vh"]);
  const jdX = useTransform(p, [0.27, 0.42], ["-6vw", "0vw"]);
  const jdRotate = useTransform(p, [0.27, 0.42], [-7, 2.2]);
  const jdOpacity = useTransform(p, [0.26, 0.32], [0, 1]);

  // Gaze spotlight
  const gazeX = useTransform(p, [0.50, 0.72], ["-14%", "22%"]);
  const gazeOpacity = useTransform(p, [0.48, 0.55, 0.72, 0.80], [0, 1, 1, 0]);

  // Captions
  const capA = useTransform(p, [0, 0.06, 0.11], [1, 1, 0]);
  const capB = useTransform(p, [0.10, 0.17, 0.24, 0.28], [0, 1, 1, 0]);
  const capC = useTransform(p, [0.28, 0.34, 0.45, 0.50], [0, 1, 1, 0]);
  const capD = useTransform(p, [0.50, 0.56, 0.60, 0.64], [0, 1, 1, 0]);
  const capE = useTransform(p, [0.63, 0.69, 0.82, 0.86], [0, 1, 1, 0]);
  const capF = useTransform(p, [0.85, 0.91, 1], [0, 1, 1]);

  const hintOpacity = useTransform(p, [0, 0.05, 0.13], [1, 1, 0]);

  return (
    <div ref={ref} className="relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <DeskStage className="-z-10" />
        <motion.div
          className="stage absolute inset-0"
          style={{ scale: camScale, rotateX: camTiltX, transformOrigin: "50% 45%" }}
        >
          <motion.div
            className="absolute left-[6%] top-[14%] max-w-[520px]"
            style={{ opacity: mastheadOpacity, y: mastheadY }}
          >
            <Eyebrow>Vol. I · The Recruiter's Desk</Eyebrow>
            <h1 className="mt-5 font-serif text-[52px] xl:text-[60px] leading-[1.02] tracking-tight">
              Your resume,
              <br />
              <span className="italic font-normal">read carefully.</span>
            </h1>
            <p className="mt-6 text-[16px] leading-relaxed text-ink-muted max-w-md">
              Drop a resume on the desk, paste the job description, and
              receive a quiet, considered analysis.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/upload" className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors">
                Place a resume on the desk
              </Link>
              <Link to="/features" className="px-5 py-3 text-sm border border-ink/20 hover:border-ink/60 transition-colors rounded-sm">
                Read the features
              </Link>
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="absolute pointer-events-none top-[18%] w-[46vw] h-[70vh]"
            style={{
              left: gazeX,
              opacity: gazeOpacity,
              background:
                "radial-gradient(closest-side, rgba(255, 226, 168, 0.14) 0%, rgba(255, 226, 168, 0.06) 45%, transparent 75%)",
              filter: "blur(6px)",
              mixBlendMode: "multiply",
            }}
          />

          <motion.div
            className="absolute right-[30%] top-[5%] w-[340px] sheet-3d"
            style={{ y: jdY, x: jdX, rotate: jdRotate, opacity: jdOpacity, zIndex: 2 }}
          >
            <JobDescriptionSheet p={p} />
          </motion.div>

          <motion.div
            className="absolute right-[6%] top-[17%] w-[360px] sheet-3d"
            style={{ y: resumeY, x: resumeX, rotate: resumeRotate, opacity: resumeOpacity, zIndex: 3 }}
          >
            <ResumeSheet p={p} />
          </motion.div>

          <div className="absolute right-[6%] bottom-[14%] w-[340px] h-[80px]">
            <Caption opacity={capA}>Every résumé deserves a careful reading.</Caption>
            <Caption opacity={capB}>A candidate arrives.</Caption>
            <Caption opacity={capC}>A role to fill, placed beside it.</Caption>
            <Caption opacity={capD}>Read together, not apart.</Caption>
            <Caption opacity={capE}>What matches.</Caption>
            <Caption opacity={capF}>And what's missing.</Caption>
          </div>

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-2"
            style={{ opacity: hintOpacity }}
          >
            <span className="eyebrow text-[10px]">Turn the page</span>
            <motion.svg
              width="14" height="20" viewBox="0 0 14 20"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-ink-muted"
            >
              <path d="M7 1v16M1 12l6 6 6-6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </motion.svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function Caption({ opacity, children }) {
  return (
    <motion.p
      className="font-serif italic text-[18px] leading-snug text-ink-muted absolute inset-0 text-right"
      style={{ opacity }}
    >
      {children}
    </motion.p>
  );
}

function StaticHero() {
  return (
    <div className="relative min-h-[80vh] px-6 pt-12 pb-20">
      <DeskStage className="-z-10" />
      <div className="relative max-w-2xl">
        <Eyebrow>Vol. I · The Recruiter's Desk</Eyebrow>
        <h1 className="mt-5 font-serif text-[44px] sm:text-[52px] leading-[1.03] tracking-tight">
          Your resume,
          <br />
          <span className="italic font-normal">read carefully.</span>
        </h1>
        <p className="mt-6 text-[16px] leading-relaxed text-ink-muted max-w-md">
          Drop a resume on the desk, paste the job description, and receive
          a quiet, considered analysis.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/upload" className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors">Place a resume on the desk</Link>
          <Link to="/features" className="px-5 py-3 text-sm border border-ink/20 hover:border-ink/60 transition-colors rounded-sm">Read the features</Link>
        </div>
      </div>
      <div className="relative mt-14 flex justify-center">
        <div className="w-[280px] rotate-[-2deg]">
          <Sheet className="p-5" dogEar>
            <PaperClip />
            <Eyebrow>Résumé · Analysis №412</Eyebrow>
            <div className="mt-3 font-serif text-lg leading-tight">Elena Marsh</div>
            <div className="text-xs text-ink-muted">Senior Product Designer</div>
            <div className="rule-line mt-4" />
            <div className="mt-4 eyebrow text-[10px]">Skills</div>
            <div className="mt-2 space-y-2">
              <div className="h-1.5 w-full bg-secondary rounded" />
              <div className="h-1.5 w-[80%] bg-secondary rounded" />
              <div className="h-1.5 w-[62%] bg-secondary rounded" />
            </div>
          </Sheet>
        </div>
      </div>
    </div>
  );
}