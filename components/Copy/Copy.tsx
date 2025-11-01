"use client";

import React, { useEffect, useRef } from "react";
import SplitType from "split-type";
import { useGsapRegister } from "@/lib/gsap";

type CopyProps = {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
};

export default function Copy({ children, animateOnScroll = true, delay = 0 }: CopyProps) {
  const { gsap, ScrollTrigger } = useGsapRegister();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const splitsRef = useRef<SplitType[]>([]);

  // Wait for variable fonts to be ready (safe + typed)
  const waitForFonts = async () => {
    const doc = document as unknown as { fonts?: FontFaceSet };
    try {
      if (doc.fonts?.ready) {
        await doc.fonts.ready;
      }
      // tiny delay to stabilize layout before splitting
      await new Promise((r) => setTimeout(r, 80));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lines: HTMLElement[] = [];

    (async () => {
      await waitForFonts();

      // Revert previous splits
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      lines = [];

      // Collect all direct children; if none, split the wrapper itself
      const nodes =
        el.children.length > 0 ? (Array.from(el.children) as HTMLElement[]) : [el];

      nodes.forEach((node) => {
        const split = new SplitType(node, { types: "lines", lineClass: "line" });
        splitsRef.current.push(split);
        lines.push(...((split.lines as unknown as HTMLElement[]) || []));
      });

      // Initial state
      gsap.set(lines, { yPercent: 100 });

      const tweenCfg = {
        yPercent: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        delay,
      } as const;

      if (animateOnScroll) {
        gsap.to(lines, {
          ...tweenCfg,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      } else {
        gsap.to(lines, tweenCfg);
      }
    })();

    return () => {
      // cleanup split DOM
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      // cleanup only triggers attached to this container
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === el)
        .forEach((t) => t.kill());
    };
  }, [gsap, ScrollTrigger, animateOnScroll, delay]);

  // Always wrap (evita cloneElement+ref che causa errori in React 19)
  return <div ref={containerRef}>{children}</div>;
}