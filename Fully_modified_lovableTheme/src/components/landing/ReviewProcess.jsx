import { Sheet, Eyebrow } from "../../components/paper.jsx";

const STAGES = [
  {
    n: "01",
    title: "Submit",
    detail: "Place your resume on the desk. Paste the role brief. The review begins.",
    icon: "upload",
  },
  {
    n: "02",
    title: "Read",
    detail: "The AI reads both documents together — parsing sections, extracting requirements, mapping evidence.",
    icon: "read",
  },
  {
    n: "03",
    title: "Mark",
    detail: "Matched skills are underlined. Missing requirements are flagged. Margin notes are written.",
    icon: "mark",
  },
  {
    n: "04",
    title: "Report",
    detail: "A document is produced: cover score, executive summary, skill chips, charts, suggestions, highlighted JD.",
    icon: "report",
  },
  {
    n: "05",
    title: "Archive",
    detail: "The review is filed. Searchable. Returnable. Your draft stays saved for the next round.",
    icon: "archive",
  },
];

export default function ReviewProcess() {
  return (
    <section className="landing-scene landing-scene--workflow relative -mt-2 pt-10 pb-16 md:-mt-4 md:pt-14 md:pb-20 border-t border-rule/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <Eyebrow>The review process</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              Five stages.
              <br />
              One continuous reading.
            </h2>
            <p className="mt-4 text-ink-muted text-[15px] leading-relaxed max-w-md">
              Your resume and the role brief are read together, not sequentially.
              Every stage builds on the last. The result is a document you can act on.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ol className="landing-field landing-field--workflow landing-workflow-grid grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
              {STAGES.map((stage, index) => {
                const spanClasses =
                  index === 0
                    ? "md:col-span-5"
                    : index === 1
                    ? "md:col-span-5 md:mt-10"
                    : index === 2
                    ? "md:col-span-5 md:mt-10"
                    : index === 3
                    ? "md:col-span-5 md:mt-10"
                    : "md:col-span-5 md:mt-10";

                const dx = index - 2;
                const translateX = `${Math.sign(dx) * Math.min(8, 5 * Math.abs(dx))}px`;

                return (
                  <li
                    key={stage.n}
                    className={spanClasses}
                  >
                    <Sheet
                      className="landing-workflow-card p-4"
                      dogEar={index !== 2}
                      style={{
                        "--card-offset": index === 0 ? "0px" : index === 1 ? "1rem" : index === 2 ? "0.35rem" : index === 3 ? "1rem" : "1.55rem",
                        "--card-translate-x": translateX,
                      }}
                    >
                      <div className="landing-workflow-card__inner">
                        <div className="landing-workflow-card__number font-serif text-3xl text-accent">
                          {stage.n}
                        </div>
                        <div className="rule-line landing-workflow-card__rule my-2" />
                        <div className="landing-workflow-card__title font-serif text-xl">{stage.title}</div>
                        <p className="landing-workflow-card__copy mt-2 text-sm text-ink-muted">{stage.detail}</p>
                      </div>
                    </Sheet>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}