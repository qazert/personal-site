import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/work/WorkCard";
import { OfferingsGrid } from "@/components/services/OfferingsGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { services, workItems } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Product design for BMW manufacturing plants, plus agency work across e-commerce, healthcare, SaaS and security.",
};

export default function WorksPage() {
  return (
    <>
      <PageHeader
        title="Projects that had to hold real complexity"
        subtitle="Software for factory floors, supply chains and the teams that run them, alongside earlier agency work across several sectors."
      />

      <section className="shell pb-20 md:pb-28">
        <div className="grid gap-10 md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:grid-cols-3">
          {workItems.map((item, i) => (
            <Reveal key={item.slug} index={i % 3}>
              <WorkCard item={item} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pb-10 pt-20 md:pb-14 md:pt-28">
        <Reveal>
          <h2 className="display-sm max-w-[16ch] text-[2rem] md:text-[2.75rem]">
            {services.headline}
          </h2>
          <p className="lede mt-4 max-w-[52ch] text-[0.9375rem] md:text-base">
            {services.subhead}
          </p>
        </Reveal>
      </section>
      <OfferingsGrid />
      <ProcessSteps />

      <CtaBand
        heading="Have something in mind?"
        body="Tell me about it, I'd be glad to help however I can."
      />
    </>
  );
}
