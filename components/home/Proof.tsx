import { Reveal } from "@/components/ui/Reveal";
import { home, testimonials } from "@/content/site";

/**
 * Proof without card boxes: numbers set in display type, quotes separated by
 * hairlines. Nothing here needs elevation, so nothing gets it.
 */
export function Proof() {
  return (
    <section className="border-t border-line bg-surface/60">
      <div className="shell py-20 md:py-28">
        <Reveal>
          <h2 className="display-sm max-w-[18ch] text-[2rem] md:text-[2.75rem]">
            {home.proof.heading}
          </h2>
        </Reveal>

        <dl className="mt-10 grid gap-8 sm:grid-cols-3 md:mt-14 md:gap-10">
          {home.proof.stats.map((stat, i) => (
            <Reveal key={stat.label} index={i}>
              <div className="border-t border-line-strong pt-5">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="display-sm tnum block text-[2.25rem] md:text-[3rem]">
                    {stat.value}
                  </span>
                  <span className="lede mt-2 block max-w-[22ch] text-[0.9375rem]">
                    {stat.label}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 md:mt-20 md:gap-8 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} index={i}>
              <figure
                className={
                  i > 0 ? "lg:border-l lg:border-line lg:pl-8" : undefined
                }
              >
                <blockquote className="max-w-[38ch] text-[1.0625rem] leading-[1.55] tracking-[-0.014em] md:text-lg">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-[0.875rem]">
                  <span className="font-medium">{t.name}</span>
                  <span className="lede block text-[0.8125rem]">
                    {t.role}, {t.company}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
