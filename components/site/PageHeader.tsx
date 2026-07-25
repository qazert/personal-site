import { Reveal } from "@/components/ui/Reveal";

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, subtitle, children }: Props) {
  return (
    <section className="shell pb-12 pt-12 md:pb-16 md:pt-20">
      <Reveal>
        <h1 className="display max-w-[18ch] text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem]">
          {title}
        </h1>
      </Reveal>
      {subtitle ? (
        <Reveal index={1}>
          <p className="lede mt-6 max-w-[52ch] text-[1.0625rem] md:text-lg">
            {subtitle}
          </p>
        </Reveal>
      ) : null}
      {children ? <Reveal index={2}>{children}</Reveal> : null}
    </section>
  );
}
