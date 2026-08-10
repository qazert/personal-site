import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/work/WorkCard";
import { StackedOfferings } from "@/components/projects/StackedOfferings";
import { workItems } from "@/content/site";

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

      <StackedOfferings />

      <CtaBand
        heading="Want to talk about one of these?"
        body="I am happy to walk through any of this work in detail, including what did not go to plan."
      />
    </>
  );
}
