import { Reveal } from "@/components/ui/Reveal";
import { home } from "@/content/site";

/**
 * Proof without card boxes: numbers set in display type, sectors as a plain
 * list. Nothing here needs elevation, so nothing gets it.
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
                  <span className="lede mt-2 block max-w-[26ch] text-[0.9375rem]">
                    {stat.label}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <div className="mt-16 grid gap-6 border-t border-line pt-12 md:mt-20 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
          <Reveal>
            <h3 className="text-[1.375rem] font-medium tracking-[-0.026em] md:text-2xl">
              {home.proof.sectors.heading}
            </h3>
          </Reveal>
          <Reveal index={1}>
            <ul className="flex flex-wrap gap-2">
              {home.proof.sectors.items.map((sector) => (
                <li
                  key={sector}
                  className="rounded-pill border border-line-strong px-3.5 py-1.5 text-[0.875rem] text-muted"
                >
                  {sector}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
