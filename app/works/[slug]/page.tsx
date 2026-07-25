import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { caseStudies } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return {};
  return {
    title: `${study.client} - ${study.discipline}`,
    description: study.summary,
    openGraph: { images: [{ url: study.cover }] },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const index = caseStudies.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();

  const study = caseStudies[index];
  const next = caseStudies[(index + 1) % caseStudies.length];

  const meta = [
    { label: "Client", value: study.client },
    { label: "Year", value: study.year },
    { label: "Duration", value: study.duration },
    { label: "Role", value: study.role.join(", ") },
  ];

  return (
    <>
      <div className="shell pt-8 md:pt-10">
        <Link
          href="/works"
          className="group inline-flex min-h-10 items-center gap-1.5 rounded-sm text-[0.875rem] text-muted transition-colors hover:text-text"
        >
          <ArrowLeft
            weight="bold"
            aria-hidden
            className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-0.5"
          />
          All work
        </Link>
      </div>

      <header className="shell pb-10 pt-6 md:pb-14 md:pt-8">
        <Reveal>
          <h1 className="display max-w-[20ch] text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem]">
            {study.title}
          </h1>
        </Reveal>
        <Reveal index={1}>
          <p className="lede mt-6 max-w-[58ch] text-[1.0625rem] md:text-lg">
            {study.summary}
          </p>
        </Reveal>
      </header>

      <div className="shell">
        <Reveal>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line bg-surface-2 md:aspect-[21/9]">
            <Image
              src={study.cover}
              alt={study.coverAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal>
          <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-line py-6 md:mt-10 md:grid-cols-4 md:gap-8">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[0.8125rem] text-faint">{m.label}</dt>
                <dd className="mt-1.5 text-[0.9375rem] font-medium">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <section className="shell py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16">
          <Reveal>
            <h2 className="display-sm text-[1.75rem] md:text-[2.25rem]">
              The problem
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="max-w-[62ch] text-[1.0625rem] leading-[1.65] tracking-[-0.011em] md:text-lg">
              {study.challenge}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-surface/60">
        <div className="shell py-16 md:py-24">
          <Reveal>
            <h2 className="display-sm text-[1.75rem] md:text-[2.25rem]">
              What I did
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-3">
            {study.approach.map((step, i) => (
              <Reveal key={step.title} index={i}>
                <div className="h-full border-t border-line-strong pt-5">
                  <h3 className="max-w-[24ch] text-lg font-medium tracking-[-0.022em] md:text-xl">
                    {step.title}
                  </h3>
                  <p className="lede mt-3 max-w-[40ch] text-[0.9375rem]">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <div className="grid gap-10 md:gap-14">
          {study.gallery.map((shot, i) => (
            <Reveal key={shot.src} index={i}>
              <figure>
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-line bg-surface-2">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 1024px) 1160px, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="lede mt-3 text-[0.875rem]">
                  {shot.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-16 md:py-24">
          <Reveal>
            <h2 className="display-sm text-[1.75rem] md:text-[2.25rem]">
              Where it landed
            </h2>
          </Reveal>
          <dl className="mt-8 grid gap-8 sm:grid-cols-3 md:mt-12 md:gap-10">
            {study.outcomes.map((o, i) => (
              <Reveal key={o.label} index={i}>
                <div className="border-t border-line-strong pt-5">
                  <dt className="sr-only">{o.label}</dt>
                  <dd>
                    <span className="display-sm tnum block text-[2rem] md:text-[2.5rem]">
                      {o.value}
                    </span>
                    <span className="lede mt-2 block max-w-[24ch] text-[0.9375rem]">
                      {o.label}
                    </span>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-12 md:py-16">
          <Link
            href={`/works/${next.slug}`}
            className="group flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-[0.8125rem] text-faint">Next project</p>
              <p className="mt-1.5 max-w-[30ch] text-xl font-medium tracking-[-0.024em] transition-colors duration-200 group-hover:text-accent-text md:text-2xl">
                {next.title}
              </p>
            </div>
            <ArrowRight
              weight="bold"
              aria-hidden
              className="size-6 shrink-0 text-faint transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-text"
            />
          </Link>
        </div>
      </section>

      <CtaBand
        heading="Working on something like this?"
        body="Tell me where the product is now and what you need it to do. I will come back with an approach and a timeline."
      />
    </>
  );
}
