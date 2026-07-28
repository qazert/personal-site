import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/work/WorkCard";
import { workItems, cta } from "@/content/site";

export function SelectedWork() {
  /* Two-up on the home page, against the three-up grid on /works, so the two
     pages do not read as the same section twice. */
  const shown = workItems.slice(0, 4);

  return (
    <section className="border-t border-line">
      <div className="shell py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display-sm text-[2rem] md:text-[2.75rem]">
              Recent work
            </h2>
            <Link
              href={cta.secondary.href}
              className="group inline-flex min-h-10 items-center gap-1.5 rounded-sm text-[0.9375rem] text-muted transition-colors hover:text-text"
            >
              {cta.secondary.label}
              <ArrowRight
                weight="bold"
                aria-hidden
                className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 md:mt-14 md:gap-x-8 md:gap-y-14 lg:grid-cols-2">
          {shown.map((item, i) => (
            <Reveal key={item.slug} index={i % 2}>
              <WorkCard item={item} priority={i === 0} size="lg" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
