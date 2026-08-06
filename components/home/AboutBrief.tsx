import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { home } from "@/content/site";

export function AboutBrief() {
  return (
    <section>
      <div className="shell py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <Reveal>
            <h2 className="display-sm max-w-[10ch] text-[2rem] md:text-[2.75rem]">
              {home.about.heading}
            </h2>
          </Reveal>
          <Reveal index={1}>
            <div>
              <p className="max-w-[64ch] text-[1.0625rem] leading-[1.7] tracking-[-0.011em] md:text-xl md:leading-[1.65]">
                {home.about.body}
              </p>
              <Link
                href="/about"
                className="group mt-8 inline-flex min-h-10 items-center gap-2 rounded-sm text-[0.9375rem] font-medium underline decoration-line-strong underline-offset-[6px] transition-colors hover:decoration-text"
              >
                More about me
                <ArrowRight
                  weight="bold"
                  aria-hidden
                  className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
