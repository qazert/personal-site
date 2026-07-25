import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cta, site } from "@/content/site";

type Props = { heading: string; body: string };

export function CtaBand({ heading, body }: Props) {
  return (
    <section className="shell pb-20 pt-8 md:pb-28 md:pt-12">
      <Reveal>
        <div className="rounded-lg border border-line bg-surface px-6 py-14 text-center md:px-16 md:py-20">
          <h2 className="display-sm mx-auto max-w-[18ch] text-[2rem] md:text-[2.75rem]">
            {heading}
          </h2>
          <p className="lede mx-auto mt-4 max-w-[46ch] text-base md:text-[1.0625rem]">
            {body}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={cta.primary.href} size="lg" withArrow>
              {cta.primary.label}
            </Button>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-10 items-center rounded-sm px-2 text-[0.9375rem] text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-text hover:decoration-text"
            >
              {site.email}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
