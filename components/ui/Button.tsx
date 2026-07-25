import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

type Variant = "primary" | "secondary" | "quiet" | "inverse";
type Size = "md" | "lg";

const base =
  "group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-pill font-medium tracking-[-0.011em] " +
  "transition-[transform,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // 6.7:1 white on #5B23FF
  primary: "bg-accent text-accent-fg hover:bg-[#4a17e6]",
  secondary:
    "border border-line-strong bg-surface text-text hover:border-text hover:bg-surface",
  quiet: "text-text hover:bg-surface-2",
  // Sits on the inverted CTA band only.
  inverse:
    "bg-surface-inverse text-inverse hover:opacity-90",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-6 text-base",
};

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  withArrow?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  withArrow = false,
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const inner = (
    <>
      {children}
      {withArrow ? (
        <ArrowUpRight
          weight="bold"
          className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      ) : null}
    </>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    return (
      <Link
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}
