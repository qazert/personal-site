import { Check } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/content/site";

/** The four offering cards, a plain grid. Shared by the Services page and the
 *  Projects page, so the two never drift apart in structure. */
export function OfferingsGrid() {
  return (
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
  );
}
