import * as icons from "simple-icons";

type Props = { name: string; icon?: string | null };

/**
 * Logo lockup for the client wall. Uses the real brand mark from simple-icons
 * when a slug is provided, and falls back to a monogram lockup otherwise.
 * Single-colour in both cases, so it inherits the page theme.
 */
export function ClientMark({ name, icon }: Props) {
  const brand = icon
    ? (icons as unknown as Record<string, { path: string } | undefined>)[
        `si${icon.charAt(0).toUpperCase()}${icon.slice(1)}`
      ]
    : undefined;

  if (brand) {
    return (
      <span className="inline-flex items-center gap-2.5">
        <svg
          viewBox="0 0 24 24"
          role="img"
          aria-label={name}
          className="size-5 shrink-0 fill-current"
        >
          <path d={brand.path} />
        </svg>
        <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
          {name}
        </span>
      </span>
    );
  }

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <span className="inline-flex items-center gap-2.5" aria-label={name}>
      <svg viewBox="0 0 24 24" aria-hidden className="size-5 shrink-0">
        <rect
          x="0.75"
          y="0.75"
          width="22.5"
          height="22.5"
          rx="6.5"
          className="fill-none stroke-current"
          strokeWidth="1.5"
        />
        <text
          x="12"
          y="12"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-current"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          {initial}
        </text>
      </svg>
      <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
        {name}
      </span>
    </span>
  );
}
