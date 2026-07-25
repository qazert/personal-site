import { Hero } from "@/components/home/Hero";
import { LogoWall } from "@/components/home/LogoWall";
import { Benefits } from "@/components/home/Benefits";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Proof } from "@/components/home/Proof";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/site/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoWall />
      <Benefits />
      <SelectedWork />
      <Proof />
      <Faq />
      <CtaBand
        heading="Have a product that has outgrown its interface?"
        body="Send me what you are working on. If I am not the right fit, I will say so and point you somewhere better."
      />
    </>
  );
}
