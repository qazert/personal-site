import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { OfferingsGrid } from "@/components/services/OfferingsGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { services } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product discovery, end-to-end product design, complex flows and design systems, for Web and iOS.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader title={services.headline} subtitle={services.subhead} />
      <OfferingsGrid />
      <ProcessSteps />

      <div className="pt-20 md:pt-28">
        <CtaBand
          heading="Sounds like what your team needs?"
          body="Tell me what you are working on and where it is stuck. I will tell you honestly whether I am the right person for it."
        />
      </div>
    </>
  );
}
