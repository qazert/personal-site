import { Button } from "@/components/ui/Button";
import { cta } from "@/content/site";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60dvh] flex-col justify-center py-20">
      <p className="tnum text-[0.875rem] text-faint">404</p>
      <h1 className="display mt-3 max-w-[16ch] text-[2.5rem] md:text-[3.5rem]">
        This page does not exist
      </h1>
      <p className="lede mt-5 max-w-[44ch] text-[1.0625rem]">
        The link may be out of date. The work and the services pages are the
        best places to pick things back up.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={cta.secondary.href} size="lg">
          {cta.secondary.label}
        </Button>
        <Button href="/" size="lg" variant="secondary">
          Back home
        </Button>
      </div>
    </section>
  );
}
