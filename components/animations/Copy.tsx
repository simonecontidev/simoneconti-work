"use client";

import React, { useRef } from "react";
import gsap from "gsap";
// ATTENZIONE: SplitText richiede il plugin GSAP (in genere Club GreenSock)
// Se nel tuo progetto demo funziona, mantieni questa import:
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

type CopyProps = {
  children: React.ReactNode;
  /**
   * Se true, anima in entrata quando la sezione entra in viewport (default).
   * Se false, lancia subito l’animazione (senza ScrollTrigger).
   */
  animateOnScroll?: boolean;
  /** Ritardo iniziale in secondi */
  delay?: number;
  /** Offset start ScrollTrigger (es. "top 80%") */
  start?: string;
  /** Stagger tra le linee */
  stagger?: number;
  /** Durata animazione per linea */
  duration?: number;
};

export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
  start = "top 80%",
  stagger = 0.06,
  duration = 0.8,
}: CopyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Se wrapper contiene più elementi, animiamo ciascun child; altrimenti animiamo il wrapper stesso
      const elements: HTMLElement[] =
        containerRef.current.hasAttribute("data-copy-wrapper")
          ? Array.from(containerRef.current.children) as HTMLElement[]
          : [containerRef.current];

      // Splitta in linee per ogni elemento
      const splits = elements.map((el) =>
        SplitText.create(el, { type: "lines", linesClass: "cg-line" })
      );

      // Flusso di animazione: partenza "nascosta"
      splits.forEach((s) => {
        gsap.set(s.lines, { yPercent: 120, opacity: 0 });
      });

      const tl = gsap.timeline({ delay });

      const play = () => {
        // Anima tutte le linee (di tutti gli elementi) con stagger globale
        const allLines = splits.flatMap((s) => s.lines as HTMLElement[]);
        tl.to(allLines, {
          yPercent: 0,
          opacity: 1,
          ease: "power3.out",
          duration,
          stagger,
          clearProps: "transform,opacity",
        });
      };

      if (animateOnScroll) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start,
          once: true,
          onEnter: play,
        });
      } else {
        play();
      }

      // Cleanup: revert degli SplitText
      return () => {
        splits.forEach((s) => s.revert());
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay, start, stagger, duration] }
  );

  // Se c'è un solo child, attacchiamo direttamente il ref
  if (React.Children.count(children) === 1) {
    const onlyChild = React.Children.only(children) as React.ReactElement<any>;
    return React.cloneElement(onlyChild, {
      ref: (node: HTMLElement) => {
        // conserva eventuale ref esistente
        if (typeof (onlyChild as any).ref === "function") (onlyChild as any).ref(node);
        (containerRef as any).current = node;
      },
    });
  }

  // Altrimenti wrapper che indica “contiene più elementi da animare”
  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}