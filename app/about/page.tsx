"use client";

import { useEffect } from "react";
import Copy from "@/components/Copy/Copy";
import Spotlight from "@/components/Spotlight";
import Footer from "@/components/Footer/Footer";
import { useGsapRegister } from "@/lib/gsap";
import CTACard from "@/components/CTACard";

export default function AboutPage() {
  const { ScrollTrigger } = useGsapRegister();

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger?.refresh(true));
    const onLoad = () => ScrollTrigger?.refresh(true);
    window.addEventListener("load", onLoad, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("load", onLoad);
    };
  }, [ScrollTrigger]);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-4 md:gap-6">
          <Copy delay={0.8}>
            <h1 className="text-right text-[2vw] leading-none md:text-[10vw] font-semibold">
              Hi
            </h1>
          </Copy>
          <Copy delay={0.95}>
            <h1 className="text-right text-[2vw] leading-none md:text-[10vw] font-semibold">
              Bridging code and emotion.
            </h1>
          </Copy>
          
        </div>
      </section>

      {/* Intro image + text */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-40">
        <div className="mx-auto mb-12 w-1/3 overflow-hidden rounded-xl md:mb-16 md:w-1/3">
          <img
            src="/about/portrait.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <Copy>
          <p className="mx-auto mb-10 w-full text-left text-lg text-white/85 md:w-1/2">
            Front-end developer and designer based in Barcelona.
I build high-performance websites and interfaces using Next.js, React, GSAP, Tailwind, and TypeScript, with a focus on animation, storytelling, and refined user experience.
          </p>
          <p className="mx-auto w-full text-left text-lg text-white/85 md:w-1/2">
            Our work explores the edges of digital expression, from still sketches to fluid 3D experiences.
            We collaborate with brands, artists, and creators who believe design can feel like art and art
            can solve real problems. We like ideas that start strange and end beautiful.
          </p>
        </Copy>
      </section>

      {/* Spotlight rows */}
      <Spotlight />
      <CTACard />
    </div>
  );
}