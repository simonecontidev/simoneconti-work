"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

// usa layoutEffect solo sul client, evita warning in SSR
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useGsapContext<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {}, ref);
    return () => ctx.revert();
  }, []);

  // helper per eseguire animazioni dentro il context
  const withContext = (fn: () => void) => {
    if (!ref.current) return;
    const ctx = gsap.context(fn, ref);
    return () => ctx.revert();
  };

  return { ref, withContext };
}