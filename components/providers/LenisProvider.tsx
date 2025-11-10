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

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    // Mantieni ScrollTrigger in sync con Lenis
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    // Usa il ticker di GSAP
    const raf = (time: number) => {
      lenis.raf(time * 1000); // Lenis usa ms
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Scroller proxy (utile se in futuro userai un wrapper custom)
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        return arguments.length ? lenis.scrollTo(value!) : window.scrollY;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      // pinType automatico su body; fallback:
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    // Refresh sicuro dopo mount & quando le risorse sono pronte
    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onLenisScroll);
      // @ts-ignore
      lenis?.destroy?.();
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
      // cleanup proxy/trigger (non necessario nella maggior parte dei casi)
      // ScrollTrigger.killAll(false, true); // <- se mai servisse
    };
  }, []);

  return <>{children}</>;
}