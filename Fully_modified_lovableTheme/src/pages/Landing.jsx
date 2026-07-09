import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PublicSite from "../components/public/PublicSite.jsx";
import { Sheet, StickyNote, Eyebrow, PaperClip } from "../components/paper.jsx";
import AtsScore from "../components/app/AtsScore.jsx";

const FEATURE_CARDS = [
  { t: "Match Score", d: "A clear percentage: how closely your resume fits the role.", n: "01" },
  { t: "Skills Overview", d: "Matched and missing keywords, charted clearly.", n: "02" },
  { t: "AI Suggestions", d: "Specific edits, copyable, in plain language.", n: "03" },
  { t: "Archive", d: "Every analysis filed by date, ready to revisit.", n: "04" },
];

const WORKFLOW_STEPS = [
  { n: "01", t: "Upload the resume", d: "Drop a PDF or DOCX. Your document is parsed and prepared for analysis." },
  { n: "02", t: "Add the job description", d: "The role details the desk needs to compare against." },
  { n: "03", t: "Review your results", d: "ATS match score, matched and missing skills, and AI-powered suggestions." },
];

const DEFAULT_FEATURE_INDEX = 1;
const DEFAULT_WORKFLOW_INDEX = 1;

export default function Landing() {
  const landingRootRef = useRef(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(DEFAULT_FEATURE_INDEX);
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(DEFAULT_WORKFLOW_INDEX);

  useEffect(() => {
    const root = landingRootRef.current;
    if (!root || typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const setVar = (name, value) => {
      root.style.setProperty(name, value);
    };

    const setScenePresence = (progress) => {
      const hero = clamp(1 - progress * 1.55, 0, 1);
      const features = clamp(1 - Math.abs(progress - 0.28) * 3.3, 0, 1);
      const workflow = clamp(1 - Math.abs(progress - 0.52) * 3.3, 0, 1);
      const testimonial = clamp(1 - Math.abs(progress - 0.76) * 3.8, 0, 1);
      const cta = clamp(1 - Math.abs(progress - 0.92) * 4.8, 0, 1);

      setVar("--scene-hero", hero.toFixed(4));
      setVar("--scene-features", features.toFixed(4));
      setVar("--scene-workflow", workflow.toFixed(4));
      setVar("--scene-testimonial", testimonial.toFixed(4));
      setVar("--scene-cta", cta.toFixed(4));
    };

    let pointerFrame = 0;
    let scrollFrame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const updatePointer = () => {
      setVar("--hero-x", pointerX.toFixed(4));
      setVar("--hero-y", pointerY.toFixed(4));
      setVar("--pointer-x", pointerX.toFixed(4));
      setVar("--pointer-y", pointerY.toFixed(4));
      setVar("--pointer-angle", `${(pointerX * 4.5).toFixed(2)}deg`);
    };

    const updateScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? clamp(window.scrollY / maxScroll, 0, 1) : 0;
      setVar("--scroll-progress", progress.toFixed(4));
      setScenePresence(progress);
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(updateScroll);
    };

    const handlePointerMove = (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      pointerX = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointerY = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(updatePointer);
    };

    const resetPointer = () => {
      pointerX = 0;
      pointerY = 0;
      updatePointer();
    };

    updatePointer();
    updateScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    if (finePointer.matches && !reducedMotion.matches) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("blur", resetPointer);
    }

    return () => {
      window.cancelAnimationFrame(pointerFrame);
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointer);
    };
  }, []);

  const getFocusState = (activeIndex, index) => {
    const distance = Math.abs(activeIndex - index);
    if (distance === 0) return "active";
    if (distance === 1) return "adjacent";
    return "distant";
  };

  const getFeatureOffset = (index) => {
    const offsets = ["0px", "1.1rem", "0.45rem", "1.55rem"];
    return offsets[index] ?? "0px";
  };

  const getWorkflowOffset = (index) => {
    const offsets = ["0px", "1rem", "0.35rem"];
    return offsets[index] ?? "0px";
  };

  return (
    <PublicSite>
      <div ref={landingRootRef} className="landing-shell relative isolate">
        <div aria-hidden="true" className="landing-ambient">
          <div className="landing-ambient__glow landing-ambient__glow--a" />
          <div className="landing-ambient__glow landing-ambient__glow--b" />
          <div className="landing-ambient__glow landing-ambient__glow--c" />
          <div className="landing-ambient__sheen" />
        </div>

        <div className="relative z-10">
          <section className="landing-scene landing-scene--hero mx-auto max-w-7xl px-6 pt-16 pb-18 md:pt-20 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <Eyebrow>Review 01 - Resume meets role</Eyebrow>
              <h1 className="mt-6 font-serif text-[52px] md:text-[64px] leading-[1.02] tracking-tight">
                Your resume,
                <br />
                <span className="italic font-normal">matched to the role.</span>
              </h1>
              <p className="mt-7 text-[17px] leading-relaxed text-ink-muted max-w-xl">
                Drop a resume on the desk, paste the job description, and receive an
                AI-powered analysis - ATS match score, matched and missing skills,
                and targeted suggestions to improve your fit.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/app/analyze"
                  className="landing-action landing-action--primary px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
                >
                  Start your analysis
                </Link>
                <Link
                  to="/features"
                  className="landing-action landing-action--secondary px-5 py-3 text-sm border border-ink/20 hover:border-ink/60 transition-colors rounded-sm"
                >
                  Explore the features
                </Link>
              </div>

              <div className="mt-14 grid grid-cols-3 gap-8 max-w-xl">
                {[
                  { n: "01", t: "Match Score", d: "How closely the resume fits the role" },
                  { n: "02", t: "Skills Gap", d: "Matched and missing keywords" },
                  { n: "03", t: "AI Suggestions", d: "Targeted improvements for the role" },
                ].map((f) => (
                  <div key={f.n}>
                    <div className="font-serif text-2xl text-accent">{f.n}</div>
                    <div className="mt-2 text-sm font-medium">{f.t}</div>
                    <div className="mt-1 text-xs text-ink-muted">{f.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="landing-hero-stage landing-field landing-field--hero lg:col-span-5 relative h-[560px] hidden lg:block">
              <div className="landing-hero-layer landing-hero-layer--sheet absolute right-12 top-8 w-[320px] h-[440px]">
                <div className="sheet sheet-lift dog-ear p-7 rotate-[3deg] h-full">
                  <PaperClip />
                  <div className="eyebrow">Resume - Analysis - 412</div>
                  <div className="mt-3 font-serif text-xl leading-tight">Elena Marsh</div>
                  <div className="text-xs text-ink-muted">Senior Product Designer</div>
                  <div className="rule-line mt-4" />
                  <div className="mt-6 eyebrow">Skills</div>
                  <div className="mt-2 space-y-2">
                    <div className="h-1.5 w-full bg-secondary rounded" />
                    <div className="h-1.5 w-[80%] bg-secondary rounded" />
                    <div className="h-1.5 w-[60%] bg-secondary rounded" />
                    <div className="h-1.5 w-[90%] bg-secondary rounded" />
                  </div>
                  <div className="absolute bottom-6 right-7">
                    <AtsScore value={92} size="md" />
                  </div>
                </div>
              </div>

              <StickyNote className="absolute left-2 top-72 w-[200px]">
                "Lead with outcomes - your impact line is buried under the role title."
              </StickyNote>

              <div className="landing-hero-layer landing-hero-layer--card absolute left-8 bottom-2 w-[220px]">
                <div className="sheet sheet-lift p-4 rotate-[4deg]">
                  <Eyebrow>Match - Senior PM</Eyebrow>
                  <div className="mt-1">
                    <AtsScore value={86} size="sm" />
                  </div>
                  <div className="mt-1 text-xs text-ink-muted">Strong on craft, light on metrics.</div>
                </div>
              </div>
            </div>
          </section>

          <section id="how" className="landing-scene landing-scene--features relative -mt-2 pt-10 pb-18 md:-mt-4 md:pt-14 md:pb-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
                  <Eyebrow>The Workspace</Eyebrow>
                  <h2 className="mt-4 font-serif text-4xl leading-tight">
                    Resume, job description,
                    <br />
                    one clear result.
                  </h2>
                  <p className="mt-5 text-ink-muted text-[15px] leading-relaxed max-w-md">
                    Your resume is compared against the job description - skill by skill.
                    Each analysis is laid out clearly, marked with insights, and filed
                    in your archive.
                  </p>
                  <div className="mt-8 hidden lg:flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                    <span className="h-px flex-1 bg-rule/60" />
                    <span>Four sheets on one desk</span>
                  </div>
                  <Link to="/features" className="story-link inline-block mt-6 text-sm text-ink">
                    Explore all features {"->"}
                  </Link>
                </div>

                <div className="lg:col-span-8">
                  <div
                    className="landing-field landing-field--cards landing-feature-grid grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6"
                    data-focus-state={activeFeatureIndex !== null ? "active" : "idle"}
                    onMouseLeave={() => setActiveFeatureIndex(DEFAULT_FEATURE_INDEX)}
                  >
                    {FEATURE_CARDS.map((card, index) => {
                      const spanClasses =
                        index === 0
                          ? "md:col-span-7"
                          : index === 1
                            ? "md:col-span-5 md:mt-10"
                            : index === 2
                              ? "md:col-span-5"
                              : "md:col-span-7 md:mt-8";

                      // subtle shared-system offsets: nearby cards shift and tilt
                      const dx = index - activeFeatureIndex;
                      const distance = Math.abs(dx) || 1;
                      const translateX = `${Math.sign(dx) * Math.min(10, 6 * distance)}px`;
                      const tilt = `${dx * 0.45}deg`;

                      return (
                        <Sheet
                          key={card.t}
                          className={`landing-feature-card ${spanClasses} p-6`}
                          dogEar={index % 2 === 0}
                          data-focus={getFocusState(activeFeatureIndex, index)}
                          onMouseEnter={() => setActiveFeatureIndex(index)}
                          style={{
                            "--card-offset": getFeatureOffset(index),
                            "--card-translate-x": translateX,
                            "--card-tilt": tilt,
                          }}
                        >
                          <div className="landing-feature-card__inner">
                            <div className="flex items-baseline justify-between">
                              <Eyebrow>Sheet - {card.n}</Eyebrow>
                            </div>
                            <div className="landing-feature-card__title mt-3 font-serif text-2xl">{card.t}</div>
                            <p className="landing-feature-card__copy mt-2 text-sm text-ink-muted">{card.d}</p>
                            <div className="rule-line landing-feature-card__rule mt-6" />
                            <div className="landing-feature-card__meta mt-3 text-xs text-ink-muted">
                              Filed under - Active analyses
                            </div>
                          </div>
                        </Sheet>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="landing-scene landing-scene--workflow relative -mt-2 pt-10 pb-16 md:-mt-4 md:pt-14 md:pb-20 border-t border-rule/60">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                <div className="lg:col-span-4">
                  <Eyebrow>The workflow</Eyebrow>
                  <h2 className="mt-4 font-serif text-4xl leading-tight">
                    Three steps. Clear results.
                  </h2>
                  <p className="mt-4 text-ink-muted text-[15px] leading-relaxed max-w-md">
                    Upload a resume, paste the job description, and receive an ATS match
                    score with actionable insights.
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <div
                    className="landing-workflow-stage relative"
                    data-focus-state={activeWorkflowIndex !== null ? "active" : "idle"}
                    onMouseLeave={() => setActiveWorkflowIndex(DEFAULT_WORKFLOW_INDEX)}
                  >
                    <div aria-hidden="true" className="landing-workflow-rail">
                      {WORKFLOW_STEPS.map((s, i) => (
                        <span key={s.n} className={getFocusState(activeWorkflowIndex, i)} />
                      ))}
                    </div>
                    <ol className="landing-field landing-field--workflow landing-workflow-grid grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
                      {WORKFLOW_STEPS.map((step, index) => {
                        const spanClasses =
                          index === 0
                            ? "md:col-span-7"
                            : index === 1
                              ? "md:col-span-5 md:mt-10"
                              : "md:col-span-8 md:ml-auto md:-mt-1";
                        const dx = index - activeWorkflowIndex;
                        const translateX = `${Math.sign(dx) * Math.min(8, 5 * Math.abs(dx))}px`;

                        return (
                          <li
                            key={step.n}
                            className={spanClasses}
                            onMouseEnter={() => setActiveWorkflowIndex(index)}
                          >
                            <Sheet
                              className="landing-workflow-card p-6 h-full"
                              dogEar={index !== 1}
                              data-focus={getFocusState(activeWorkflowIndex, index)}
                              style={{
                                "--card-offset": getWorkflowOffset(index),
                                "--card-translate-x": translateX,
                              }}
                            >
                              <div className="landing-workflow-card__inner">
                                <div className="landing-workflow-card__number font-serif text-3xl text-accent">
                                  {step.n}
                                </div>
                                <div className="rule-line landing-workflow-card__rule my-4" />
                                <div className="landing-workflow-card__title font-serif text-xl">{step.t}</div>
                                <p className="landing-workflow-card__copy mt-2 text-sm text-ink-muted">{step.d}</p>
                              </div>
                            </Sheet>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="landing-scene landing-scene--testimonial relative -mt-8 pb-20 md:-mt-12 md:pb-24 border-t border-rule/60">
            <div className="mx-auto max-w-7xl px-6">
              <Sheet className="landing-end-panel mx-auto max-w-6xl p-6 md:p-8" stack tabIndex={0}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  <div className="landing-end-panel__quote landing-field landing-field--testimonial lg:col-span-5 text-left lg:pr-6">
                    <Eyebrow>From the desk</Eyebrow>
                    <blockquote className="mt-6 font-serif text-3xl md:text-4xl italic leading-snug text-ink">
                      "Upload. Compare. Improve. The fastest way to know if your resume fits the role."
                    </blockquote>
                    <div className="mt-6 text-sm text-ink-muted">- The Recruiter's Desk</div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="landing-section-bridge hidden lg:block mb-8" />
                    <div className="landing-end-panel__cta landing-field landing-field--cta">
                      <Eyebrow>Begin</Eyebrow>
                      <h2 className="mt-4 font-serif text-4xl md:text-5xl leading-tight max-w-2xl">
                        Compare your resume to the role.
                      </h2>
                      <p className="mt-5 text-ink-muted max-w-xl">
                        One upload. One job description. An analysis you can act on.
                      </p>
                      <div className="mt-10 flex flex-wrap gap-3">
                        <Link
                          to="/app/analyze"
                          className="landing-action landing-action--primary px-6 py-3.5 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
                        >
                          Begin an analysis
                        </Link>
                        <Link
                          to="/faq"
                          className="landing-action landing-action--secondary px-6 py-3.5 text-sm border border-ink/20 hover:border-ink/60 transition-colors rounded-sm"
                        >
                          Read the FAQ
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Sheet>
            </div>
          </section>
        </div>
      </div>
    </PublicSite>
  );
}
