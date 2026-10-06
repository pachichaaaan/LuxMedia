import { processSteps } from "@/content/process";

type ProcessProps = {
  heading: string;
  id?: string;
};

/** A real sequence, so it's an ordered list numbered 1 to 4. Quiet: no scroll effects. */
export function Process({ heading, id = "process" }: ProcessProps) {
  return (
    <section
      data-surface="haze"
      aria-labelledby={`${id}-heading`}
      className="page-grid gap-y-12 section-y"
    >
      <h2 id={`${id}-heading`} className="col-span-full text-h2 text-ink lg:col-span-8">
        {heading}
      </h2>
      <ol className="col-span-full grid gap-x-(--gutter) gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <li key={step.name} className="border-t border-rule pt-5">
            <h3 className="flex gap-4 text-h3 text-ink">
              <span className="text-dusk tabular-nums">{index + 1}</span>
              {step.name}
            </h3>
            <p className="mt-4 max-w-[34ch] text-ink-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
