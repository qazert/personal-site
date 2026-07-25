import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { CaseStudy } from "@/content/site";

type Props = { study: CaseStudy; priority?: boolean };

export function WorkCard({ study, priority = false }: Props) {
  return (
    <article className="group">
      <Link href={`/works/${study.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line bg-surface-2">
          <Image
            src={study.cover}
            alt={study.coverAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 46vw, 100vw"
            /* Feedback: the card acknowledges the pointer before the click. */
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] text-faint">
              <span className="font-medium text-muted">{study.client}</span>
              <span aria-hidden>/</span>
              <span>{study.discipline}</span>
            </div>
            <h3 className="mt-2 max-w-[26ch] text-xl font-medium tracking-[-0.024em] transition-colors duration-200 group-hover:text-accent-text md:text-[1.375rem]">
              {study.title}
            </h3>
          </div>
          <ArrowUpRight
            weight="bold"
            aria-hidden
            className="mt-1 size-5 shrink-0 text-faint transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
          />
        </div>
      </Link>
    </article>
  );
}
