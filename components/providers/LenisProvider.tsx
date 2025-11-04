// src/components/providers/LenisProvider.tsx
"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
    });

    const raf = (time: number) => {
      // gsap.ticker -> seconds ; lenis.raf -> ms
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.defaults({ pinType: "transform" });

    return () => {
      gsap.ticker.remove(raf);
      // @ts-ignore optional chaining at runtime
      lenis?.destroy?.();
    };
  }, []);

  return <>{children}</>;
}