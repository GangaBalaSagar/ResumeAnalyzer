import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, Eyebrow } from "../paper.jsx";

const FEATURE_CARDS = [
  { t: "Match Score", d: "A clear percentage: how closely your resume fits the role.", n: "01" },
  { t: "Skills Overview", d: "Matched and missing keywords, charted clearly.", n: "02" },
  { t: "Suggestions", d: "Specific edits, copyable, in plain language.", n: "03" },
  { t: "Archive", d: "Every analysis filed by date, ready to revisit.", n: "04" },
];

const DEFAULT_FEATURE_INDEX = 1;

function getFocusState(activeIndex, index) {
  const distance = Math.abs(activeIndex - index);
  if (distance === 0) return "active";
  if (distance === 1) return "adjacent";
  return "distant";
}

function getFeatureOffset(index) {
  const offsets = ["0px", "1.1rem", "0.45rem", "1.55rem"];
  return offsets[index] ?? "0px";
}

export default function WorkspaceSection() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(DEFAULT_FEATURE_INDEX);

  return (
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
              Your resume is compared against the job description — skill by skill.
              Each analysis is laid out clearly, marked with insights, and filed
              in your archive.
            </p>
            <div className="mt-8 hidden lg:flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              <span className="h-px flex-1 bg-rule/60" />
              <span>Four sheets in one workspace</span>
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
  );
}