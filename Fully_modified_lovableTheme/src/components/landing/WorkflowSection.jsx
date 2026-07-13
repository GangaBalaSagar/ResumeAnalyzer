import { useState } from "react";
import { Eyebrow, Sheet } from "../paper.jsx";

const WORKFLOW_STEPS = [
  { n: "01", t: "Upload your resume", d: "Drop a PDF or DOCX. Your document is parsed and prepared for analysis." },
  { n: "02", t: "Add the job description", d: "The role details what we need to compare against." },
  { n: "03", t: "Review your results", d: "ATS match score, matched and missing skills, and AI-powered suggestions." },
];

const DEFAULT_WORKFLOW_INDEX = 1;

function getFocusState(activeIndex, index) {
  const distance = Math.abs(activeIndex - index);
  if (distance === 0) return "active";
  if (distance === 1) return "adjacent";
  return "distant";
}

function getWorkflowOffset(index) {
  const offsets = ["0px", "1rem", "0.35rem"];
  return offsets[index] ?? "0px";
}

export default function WorkflowSection() {
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(DEFAULT_WORKFLOW_INDEX);

  return (
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
  );
}