import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import WorkGrid from "@/components/sections/WorkGrid";
import FadeTest from "@/components/sections/FadeTest";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee />
      <div className="mx-auto max-w-4xl px-6">
        <FadeTest />
      </div>
      <WorkGrid />
    </main>
  );
}