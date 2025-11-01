"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { useGsapRegister } from "@/lib/gsap";

type Props = {
  /** Quale tag vuoi renderizzare (default: h3) */
  as?: keyof JSX.IntrinsicElements;
  /** Offset di start per ScrollTrigger (default: "top 80%") */
  start?: string;
  /** Distanza iniziale in px (default: 36) */
  fromY?: number;
  /** Durata animazione (default: 1) */
  duration?: number;
  /** Stagger tra le linee (default: 0.02) */
  stagger?: number;
  /** Contenuto (tipicamente il testo da rivelare) */
  children: React.ReactNode;
  /** Classi extra per il tag wrapper (opzionale) */
  className?: string;
};

export default function SplitLinesReveal({
  as: Tag = "h3",
  start = "top 80%",
  fromY = 36,
  duration = 1,
  stagger = 0.02,
  className,
  children,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const { gsap, ScrollTrigger } = useGsapRegister();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Split in lines
    const split = new SplitType(el, { types: "lines" });

    // Wrap ogni linea in un div.line (come nel template)
    split.lines?.forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.className = "line";
      line.parentNode?.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Animazione on-scroll
    const tween = gsap.from(el.querySelectorAll(".line"), {
      y: fromY,
      duration,
      stagger,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start,
      },
    });

    return () => {
      // Cleanup
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split.revert();
    };
  }, [gsap, ScrollTrigger, start, fromY, duration, stagger]);

  return (
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}