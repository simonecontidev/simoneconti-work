// src/components/providers/LenisProvider.tsx
"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (prefersReduced) return;

    // Evita conflitti con CSS native smooth scrolling
    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    // NOTA: niente smoothTouch — non è presente nel LenisOptions della tua versione
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // smoothTouch: false, // <-- rimosso: non tipizzato in questa versione
    });

    // Mantieni ScrollTrigger in sync
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    // Usa il ticker di GSAP (fornisce 'time' in secondi)
    const raf = (time: number) => {
      lenis.raf(time * 1000); // Lenis vuole ms
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.defaults({ pinType: "transform" });

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onLenisScroll);
      // @ts-ignore lenis ha destroy a runtime
      lenis?.destroy?.();
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
    };
  }, []);

  return <>{children}</>;
}