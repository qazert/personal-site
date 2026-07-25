import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { home } from "@/content/site";

/**
 * Bento: three benefits, exactly three cells. One tall image-led cell, two
 * stacked text cells with different surfaces so the grid is not white-on-white.
 */
export function Benefits() {
  const [lead, ...rest] = home.benefits.items;

  return (
    <section className="shell py-20 md:py-28">
      <Reveal>
        <h2 className="display-sm max-w-[16ch] text-[2rem] md:text-[2.75rem]">
          {home.benefits.heading}
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 md:mt-14 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="h-full">
          <article className="flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface">
            <div className="relative aspect-[7/5] w-full shrink-0 bg-surface-2">
              <Image
                src="/home/system.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-7 md:p-9">
              <h3 className="text-xl font-medium tracking-[-0.024em] md:text-2xl">
                {lead.title}
              </h3>
              <p className="lede mt-3 max-w-[42ch] text-[0.9375rem] md:text-base">
                {lead.body}
              </p>
            </div>
          </article>
        </Reveal>

        <div className="grid gap-4 lg:grid-rows-2">
          {rest.map((item, i) => (
            <Reveal key={item.title} index={i + 1} className="h-full">
              <article
                className={`flex h-full flex-col rounded-md border p-7 md:p-9 ${
                  i === 0
                    ? "border-accent/20 bg-accent-soft"
                    : "border-line bg-surface"
                }`}
              >
                <h3 className="text-xl font-medium tracking-[-0.024em] md:text-2xl">
                  {item.title}
                </h3>
                <p className="lede mt-3 max-w-[44ch] text-[0.9375rem] md:text-base">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
