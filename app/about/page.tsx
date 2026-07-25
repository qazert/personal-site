import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { about, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nine years designing software where the work is genuinely complicated: finance, clinical and logistics products.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title={about.headline} />

      <section className="shell pb-20 md:pb-28">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <Reveal>
            <div className="space-y-5">
              {about.intro.map((para) => (
                <p
                  key={para.slice(0, 32)}
                  className="max-w-[64ch] text-[1.0625rem] leading-[1.68] tracking-[-0.011em] md:text-lg"
                >
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal index={1}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-line bg-surface-2">
              <Image
                src={about.portrait}
                alt={about.portraitAlt}
                fill
                priority
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-surface/60">
        <div className="shell py-20 md:py-28">
          <Reveal>
            <h2 className="display-sm text-[2rem] md:text-[2.75rem]">
              How I work
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-8">
            {about.principles.map((p, i) => (
              <Reveal key={p.title} index={i}>
                <div className="h-full border-t border-line-strong pt-5">
                  <h3 className="text-lg font-medium tracking-[-0.022em] md:text-xl">
                    {p.title}
                  </h3>
                  <p className="lede mt-3 max-w-[38ch] text-[0.9375rem]">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <h2 className="display-sm max-w-[10ch] text-[2rem] md:text-[2.75rem]">
              Where I have worked
            </h2>
          </Reveal>

          <ol className="border-t border-line">
            {about.experience.map((job, i) => (
              <Reveal key={`${job.org}-${job.period}`} index={i} as="li">
                <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-6 md:py-7">
                  <p className="tnum text-[0.875rem] text-faint">
                    {job.period}
                  </p>
                  <div>
                    <h3 className="text-[1.0625rem] font-medium tracking-[-0.018em] md:text-lg">
                      {job.role}
                    </h3>
                    <p className="mt-0.5 text-[0.9375rem] text-muted">
                      {job.org}
                    </p>
                    <p className="lede mt-2 max-w-[52ch] text-[0.9375rem]">
                      {job.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <div>
                <h2 className="text-[1.375rem] font-medium tracking-[-0.026em] md:text-2xl">
                  What I do
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {about.capabilities.map((c) => (
                    <li
                      key={c}
                      className="rounded-pill border border-line-strong px-3.5 py-1.5 text-[0.875rem] text-muted"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal index={1}>
              <div>
                <h2 className="text-[1.375rem] font-medium tracking-[-0.026em] md:text-2xl">
                  What I work in
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {about.tools.map((t) => (
                    <li
                      key={t}
                      className="rounded-pill border border-line-strong px-3.5 py-1.5 text-[0.875rem] text-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="lede mt-8 max-w-[44ch] text-[0.9375rem]">
                  Based in {site.location}, working with teams across Europe and
                  in North American time zones.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Want to know if we would work well together?"
        body="The fastest way to find out is a short call. No pitch, no deck, just the product and what is in the way."
      />
    </>
  );
}
