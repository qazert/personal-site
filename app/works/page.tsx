import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/work/WorkCard";
import { caseStudies } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected product design work: reconciliation software, clinical scheduling, logistics dashboards and design systems.",
};

export default function WorksPage() {
  const [featured, ...rest] = caseStudies;

  return (
    <>
      <PageHeader
        title="Work that had to hold real complexity"
        subtitle="Four projects where the interface was the bottleneck. Each one covers what was broken, what changed and what it cost to get there."
      />

      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <article className="group">
            <Link href={`/works/${featured.slug}`} className="block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line bg-surface-2 md:aspect-[21/9]">
                <Image
                  src={featured.cover}
                  alt={featured.coverAlt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_1fr] md:gap-12">
                <div>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] text-faint">
                    <span className="font-medium text-muted">
                      {featured.client}
                    </span>
                    <span aria-hidden>/</span>
                    <span>{featured.year}</span>
                  </div>
                  <h2 className="mt-2 max-w-[22ch] text-[1.75rem] font-medium tracking-[-0.028em] transition-colors duration-200 group-hover:text-accent-text md:text-[2.125rem]">
                    {featured.title}
                  </h2>
                </div>
                <div className="md:pt-7">
                  <p className="lede max-w-[52ch] text-[0.9375rem] md:text-base">
                    {featured.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium">
                    Read the case study
                    <ArrowUpRight
                      weight="bold"
                      aria-hidden
                      className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-line pt-14 md:mt-20 md:grid-cols-3 md:gap-6">
          {rest.map((study, i) => (
            <Reveal key={study.slug} index={i}>
              <WorkCard study={study} />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        heading="Your product could be the next one here"
        body="Tell me what is in the way. I will come back with how I would approach it and what it would take."
      />
    </>
  );
}
