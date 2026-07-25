import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { home } from "@/content/site";

export function Faq() {
  return (
    <section className="border-t border-line">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <h2 className="display-sm max-w-[14ch] text-[2rem] md:text-[2.75rem]">
              {home.faq.heading}
            </h2>
          </Reveal>
          <Reveal index={1}>
            <Accordion items={home.faq.items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
