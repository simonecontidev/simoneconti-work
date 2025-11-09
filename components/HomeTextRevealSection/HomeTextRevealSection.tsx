"use client";

import Copy from "../../components/animations/Copy";

export default function HomeTextRevealSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        {/* Titolo */}
        <Copy>
          <h2 className="text-balance text-4xl md:text-6xl font-semibold tracking-tight leading-tight md:leading-snug">
            I design & build calm, kinetic websites
          </h2>
        </Copy>

        {/* Sottotitolo */}
        <div className="mt-6 md:mt-8 max-w-2xl">
          <Copy delay={0.15}>
            <p className="text-pretty text-base md:text-lg text-zinc-400 leading-relaxed">
              Next.js, Tailwind, GSAP, and a slow-web approach. Minimal noise, high polish, delightful motion.
            </p>
          </Copy>
        </div>

        {/* 2–3 righe descrittive */}
        <div className="mt-10 space-y-2">
          <Copy delay={0.25} start="top 85%">
            <p className="text-sm md:text-base text-zinc-500 leading-relaxed">
              • Portfolio sites, product pages, motion systems, and premium UI for creative brands.
            </p>
            <p className="text-sm md:text-base text-zinc-500 leading-relaxed">
              • Clean code, GSAP micro-interactions, and a11y-first defaults.
            </p>
            <p className="text-sm md:text-base text-zinc-500 leading-relaxed">
              • Based in Barcelona · available remote · EN/IT/ES.
            </p>
          </Copy>
        </div>
      </div>
    </section>
  );
}