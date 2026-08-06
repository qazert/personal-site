import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    /* The footer inverts the page: ink ground in light mode, paper in dark.
       It is the one deliberate block of contrast on the site, and it closes
       every page the same way. */
    <footer className="bg-surface-inverse text-inverse">
      <div className="shell pt-14 md:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
          <div>
            <p className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
              {site.name}
            </p>
            <p className="mt-2 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-inverse/60">
              {site.role} working with software teams on interfaces that have to
              carry real complexity.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-flex min-h-10 items-center text-[0.9375rem] underline decoration-current/40 underline-offset-4 transition-colors hover:decoration-current"
            >
              {site.email}
            </a>
          </div>

          <div className="sm:justify-self-end">
            <h2 className="text-[0.8125rem] text-inverse/50">Find me</h2>
            <ul className="mt-3">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-10 items-center text-[0.9375rem] text-inverse/70 transition-colors hover:text-inverse"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-inverse/15 pt-6 text-[0.8125rem] text-inverse/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {year} {site.name}. All rights reserved.
          </p>
          <p>{site.location}</p>
        </div>
      </div>

      {/* The name set full-bleed and cropped by the page edge. Pure black on
          the ink ground, pure white on the paper one: present, not loud. */}
      <div className="footer-signature" aria-hidden>
        <span>{site.name}</span>
      </div>
    </footer>
  );
}
