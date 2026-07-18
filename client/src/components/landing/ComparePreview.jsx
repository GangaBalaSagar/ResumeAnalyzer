import { useEffect, useRef, useState } from "react";
import { Sheet, PaperClip, Eyebrow } from "../paper.jsx";

const READING_STAGES = [
  "Reading the resume…",
  "Parsing sections and headings…",
  "Comparing against the role brief…",
  "Marking matched and missing requirements…",
  "Drafting review notes…",
];

export default function ComparePreview() {
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const progressRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    setIsRunning(true);
    setProgress(8);
    setStageIdx(0);

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(92, p + Math.random() * 12);
        if (next >= 92) {
          clearInterval(progressRef.current);
          setIsRunning(false);
        }
        return next;
      });
    }, 350);

    stageRef.current = setInterval(() => {
      setStageIdx((i) => {
        const next = Math.min(READING_STAGES.length - 1, i + 1);
        if (next >= READING_STAGES.length - 1) {
          clearInterval(stageRef.current);
        }
        return next;
      });
    }, 1400);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (stageRef.current) clearInterval(stageRef.current);
    };
  }, []);

  const mockFile = { name: "Your_Resume.pdf", size: 245760 };

  function fileKind(name = "") {
    const ext = name.split(".").pop()?.toUpperCase();
    return ext && ext.length <= 5 ? ext : "FILE";
  }

  function fmtSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <section className="landing-scene landing-scene--compare relative -mt-2 pt-10 pb-18 md:-mt-4 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <Eyebrow>Chapter 3 · Compare</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              The review
              <br />
              <span className="italic font-normal">reads for you.</span>
            </h2>
            <p className="mt-5 text-ink-muted text-[15px] leading-relaxed max-w-md">
              Both documents are read together. Sections parsed. Requirements extracted.
              Evidence mapped. The progress shows the reading, not a spinner.
            </p>
            <div className="mt-8 hidden lg:flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              <span className="h-px flex-1 bg-rule/60" />
              <span>~ 20 seconds</span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Sheet className="relative p-4 md:p-6 overflow-hidden" lift>
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <Eyebrow>Review in progress</Eyebrow>
                  <div className="mt-2 font-serif text-xl leading-tight">
                    {mockFile?.name || "Your resume"}
                  </div>
                </div>
                <span className="font-mono text-xs text-ink-muted">
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Scanning surface — a small ruled sheet with a moving reading line */}
              <div className="relative mt-4 h-16 md:h-20 bg-paper border border-rule rounded-sm overflow-hidden ruled">
                {/* Reading line */}
                <div
                  className="absolute left-0 right-0 h-[2px] bg-accent/80 shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-500 ease-out"
                  style={{ top: `${Math.max(6, Math.min(92, progress))}%` }}
                />
                {/* Highlighter sweep at the tip */}
                <div
                  className="absolute left-0 right-0 h-6 bg-highlight/30 -mt-3 transition-all duration-500 ease-out"
                  style={{ top: `${Math.max(6, Math.min(92, progress))}%` }}
                />
              </div>

              {/* Progress bar */}
              <div className="mt-5 h-[3px] w-full bg-rule/70 rounded overflow-hidden">
                <div
                  className="h-full bg-ink transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Stage list */}
              <ol className="mt-5 space-y-1.5">
                {READING_STAGES.map((label, i) => {
                  const done = i < stageIdx;
                  const current = i === stageIdx;
                  return (
                    <li
                      key={label}
                      className={`flex items-baseline gap-3 text-sm transition-colors ${
                        current ? "text-ink" : done ? "text-ink-muted" : "text-ink-muted/50"
                      }`}
                    >
                      <span className="font-serif text-[12px] w-5 shrink-0 text-ink-muted/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`font-serif ${current ? "italic" : ""}`}>
                        {label}
                      </span>
                      {done && <span className="text-accent">·</span>}
                    </li>
                  );
                })}
              </ol>
            </Sheet>

            {/* What happens next hint */}
            <div className="mt-6 hidden lg:block">
              <p className="text-sm text-ink-muted italic font-serif">
                When the reading completes, the report opens. You'll see the score, the evidence, and the edits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}