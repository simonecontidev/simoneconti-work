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
         <h1 className="text-4xl font-bold">Bricolage Grotesque</h1>
  <p className="font-mono mt-6">Martian Mono Variable</p>
      </div>
      <WorkGrid />
    </main>
  );
}