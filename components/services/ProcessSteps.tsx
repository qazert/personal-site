import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/content/site";

/** "How the work runs": title left, three steps right. Shared by the
 *  Services page and the Projects page. */
export function ProcessSteps() {
  return (
    <section className="bg-surface/60">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <h2 className="display-sm max-w-[12ch] text-[2rem] md:text-[2.75rem]">
              {services.process.heading}
            </h2>
          </Reveal>

          <div className="border-t border-line">
            {services.process.steps.map((step, i) => (
              <Reveal key={step.title} index={i}>
                <div className="border-b border-line py-7 md:py-9">
                  <h3 className="text-xl font-medium tracking-[-0.024em] md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="lede mt-3 max-w-[56ch] text-[0.9375rem] md:text-base">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
