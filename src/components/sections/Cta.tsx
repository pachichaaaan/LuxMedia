import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { LiveDot } from "@/components/ui/LiveDot";
import { LiveLine } from "@/components/ui/LiveLine";
import { brand } from "@/content/brand";
import { home } from "@/content/site";

/** The closing ask, back on night: the audience is online right now. */
export function Cta() {
  return (
    <section
      data-surface="night"
      aria-labelledby="cta-heading"
      className="page-grid gap-y-12 section-y"
    >
      <h2 id="cta-heading" className="col-span-full text-display text-ink lg:col-span-11">
        {home.cta.statement}
      </h2>
      <div className="col-span-full flex flex-col gap-10 md:flex-row md:items-center md:gap-14">
        <Magnetic strength={0.25}>
          <Button href="/contact" size="xl">
            {home.cta.button}
          </Button>
        </Magnetic>
        <div className="space-y-2">
          <p>
            <a href={`mailto:${brand.email}`} className="text-body-lg link-inline text-ink">
              {brand.email}
            </a>
          </p>
          <p className="flex items-center gap-3 text-small text-ink-meta">
            <LiveDot />
            <LiveLine />
          </p>
        </div>
      </div>
    </section>
  );
}
