import { Hero } from "@/components/home/Hero";
import { StackedProjects } from "@/components/home/StackedProjects";
import { AboutBrief } from "@/components/home/AboutBrief";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StackedProjects />
      <AboutBrief />
    </>
  );
}
