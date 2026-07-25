import Link from "next/link";
import { nav, site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="shell py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
              {site.name}
            </p>
            <p className="lede mt-2 max-w-[34ch] text-[0.9375rem]">
              {site.role} working with software teams on interfaces that have to
              carry real complexity.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-flex min-h-10 items-center text-[0.9375rem] text-accent-text underline decoration-accent-text/30 underline-offset-4 transition-colors hover:decoration-accent-text"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[0.8125rem] font-medium text-faint">Pages</h2>
            <ul className="mt-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-[0.9375rem] text-muted transition-colors hover:text-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.8125rem] font-medium text-faint">Elsewhere</h2>
            <ul className="mt-3">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-10 items-center text-[0.9375rem] text-muted transition-colors hover:text-text"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[0.8125rem] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            {year} {site.name}. All rights reserved.
          </p>
          <p>{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
