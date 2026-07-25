import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { contact, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell me about the product you are building. Replies within two working days, including a straight no if I am not the right fit.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title={contact.headline} subtitle={contact.subhead} />

      <section className="shell pb-20 md:pb-28">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal index={1}>
            <aside className="rounded-md border border-line bg-surface p-7 md:p-9">
              <h2 className="text-[1.375rem] font-medium tracking-[-0.026em]">
                What happens next
              </h2>
              <ol className="mt-6 border-t border-line">
                {contact.expectations.map((item) => (
                  <li key={item.title} className="border-b border-line py-4">
                    <p className="text-[0.9375rem] font-medium">{item.title}</p>
                    <p className="lede mt-1 max-w-[36ch] text-[0.875rem]">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-7">
                <p className="text-[0.8125rem] text-faint">
                  Prefer email or a DM
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-10 items-center text-[0.9375rem] text-accent-text underline decoration-accent-text/30 underline-offset-4 transition-colors hover:decoration-accent-text"
                >
                  {site.email}
                </a>
                <ul className="flex flex-wrap gap-x-4">
                  {site.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex min-h-10 items-center text-[0.9375rem] text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-text hover:decoration-text"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
