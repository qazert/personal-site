import { Reveal } from "@/components/ui/Reveal";
import { ClientMark } from "@/components/ui/ClientMark";
import { clients } from "@/content/site";

export function LogoWall() {
  return (
    <section className="border-y border-line bg-surface/60">
      <div className="shell py-8 md:py-10">
        <Reveal>
          <ul className="grid grid-cols-2 items-center justify-items-start gap-x-6 gap-y-6 text-faint sm:grid-cols-3 lg:flex lg:justify-between lg:gap-8">
            {clients.map((client) => (
              <li key={client.name} className="min-w-0">
                <ClientMark name={client.name} icon={client.icon} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
