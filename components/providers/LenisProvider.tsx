"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";

type Props = { children: ReactNode };

export default function LenisProvider({ children }: Props) {
  useEffect(() => {
    // Rispetta utenti che preferiscono ridurre il movimento
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = mql.matches;

    // Evita doppie istanze in fast refresh
    let lenis: Lenis | null = null;

    if (!reduceMotion) {
      lenis = new Lenis({
        // tuning base, poi lo affiniamo quando iniziamo con le animazioni reali
        duration: 1.1, // sensazione “calma”
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        smoothWheel: true,
        smoothTouch: false,
      });

      // Usa GSAP come RAF driver per sincronizzare tutto lo stack
      const ticker = (time: number) => {
        // gsap.ticker fornisce "time" in secondi; Lenis si aspetta ms
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(ticker);
      // Optional per coerenza temporale durante scroll lunghi
      gsap.ticker.lagSmoothing(0);

      // Cleanup
      return () => {
        gsap.ticker.remove(ticker);
        // Disattiva istanza
        // @ts-expect-error lenis ha destroy() a runtime anche se non sempre tipizzato
        lenis?.destroy?.();
        lenis = null;
      };
    }

    // se reduced motion: niente Lenis
    return () => {};
  }, []);

  return <>{children}</>;
}