import Image from "next/image";
import type { WorkItem } from "@/content/site";

type Props = {
  item: WorkItem;
  priority?: boolean;
  /** Larger type for the two-up layout on the home page. */
  size?: "sm" | "lg";
};

/**
 * A work card is presentational, not a link. There are no case study pages yet,
 * so nothing here should look clickable.
 */
export function WorkCard({ item, priority = false, size = "sm" }: Props) {
  const isLarge = size === "lg";

  return (
    <article>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line bg-surface-2">
        <Image
          src={item.cover}
          alt={item.coverAlt}
          fill
          priority={priority}
          sizes={
            isLarge
              ? "(min-width: 1024px) 46vw, 100vw"
              : "(min-width: 768px) 31vw, 100vw"
          }
          className="object-cover"
        />
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] text-faint">
          <span className="font-medium text-muted">{item.client}</span>
          <span aria-hidden>/</span>
          <span>{item.year}</span>
        </div>
        <h3
          className={`mt-2 max-w-[28ch] font-medium tracking-[-0.024em] ${
            isLarge ? "text-xl md:text-[1.375rem]" : "text-lg md:text-xl"
          }`}
        >
          {item.title}
        </h3>
        <p className="lede mt-2 max-w-[44ch] text-[0.9375rem]">
          {item.summary}
        </p>
        <p className="mt-3 text-[0.8125rem] text-faint">{item.discipline}</p>
      </div>
    </article>
  );
}
