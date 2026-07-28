import type { Metadata } from "next";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product discovery, end-to-end product design, complex flows and design systems, for Web and iOS.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader title={services.headline} subtitle={services.subhead} />

      <section className="shell pb-20 md:pb-28">
        <div className="grid gap-4 lg:grid-cols-2">
          {services.offerings.map((offer, i) => (
            <Reveal key={offer.slug} index={i % 2} className="h-full">
              <article
                id={offer.slug}
                className="flex h-full flex-col rounded-md border border-line bg-surface p-7 md:p-9"
              >
                <h2 className="text-[1.375rem] font-medium tracking-[-0.026em] md:text-2xl">
                  {offer.title}
                </h2>
                <p className="lede mt-3 max-w-[46ch] text-[0.9375rem] md:text-base">
                  {offer.summary}
                </p>

                <p className="mt-6 border-t border-line pt-5 text-[0.8125rem] text-faint">
                  Includes
                </p>
                <ul className="mt-3 grid gap-2.5">
                  {offer.includes.map((line) => (
                    <li key={line} className="flex gap-3">
                      <Check
                        weight="bold"
                        aria-hidden
                        className="mt-[0.3rem] size-3.5 shrink-0 text-accent-text"
                      />
                      <span className="lede text-[0.9375rem] text-text/85">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface/60">
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

      <div className="pt-20 md:pt-28">
        <CtaBand
          heading="Sounds like what your team needs?"
          body="Tell me what you are working on and where it is stuck. I will tell you honestly whether I am the right person for it."
        />
      </div>
    </>
  );
}
