"use client";

import Image from "next/image";
import Copy from "@/components/Copy/Copy";
import AnimatedButton from "@/components/ui/AnimatedButton";
import useViewTransition from "@/hooks/useViewTransition";

export default function Hero() {
  const { navigateWithTransition } = useViewTransition();

  return (
    <section className="relative isolate min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background image + gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/home/hero.jpg"
          alt="Tropical leaves background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/80" />
      </div>

      {/* Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center hero-content">
        <div className="hero-header">
        <Copy animateOnScroll={false} delay={0.6}>
          <h1 className="text-balance text-4xl font-semibold leading-[1.15] text-white md:text-6xl lg:text-7xl">
            Frontend Developer
          </h1>
        </Copy>
</div>
 <div className="hero-tagline">
        <Copy animateOnScroll={false} delay={0.85}>
          <p className="mx-auto mt-24 mb-24 max-w-2xl text-pretty text-base text-white/80 md:text-lg spacer">
            At Terrene, we shape environments that elevate daily life,
            invite pause, and speak through texture and light.
          </p>
        </Copy>
</div>
        <div className="mt-10 flex justify-center">
          <AnimatedButton
            label="Discover More"
            route="/portfolio"
            onClick={() => navigateWithTransition("/about")}
          />
        </div>
      </div>

    
    </section>
  );
}