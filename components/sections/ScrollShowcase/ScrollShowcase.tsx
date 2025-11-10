// src/components/sections/ScrollShowcase/ScrollShowcase.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ScrollShowcase.module.css";
import type { ScrollShowcaseProps } from "./types";

export default function ScrollShowcase({
  hero,
  outro,
  services,
  aboutText,
  copyText,
  options,
}: ScrollShowcaseProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanupCtx: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const root = rootRef.current;
      if (!root) return;

      const setOverlapVar = () => {
        const headers = Array.from(
          root.querySelectorAll<HTMLElement>(`.${styles.ssServicesHeader}`)
        );
        if (headers.length === 0) return;

        // Altezza “finale” quando le header sono compresse (minScale)
        const bp = options?.breakpoint ?? 1000;
        const minScale =
          window.innerWidth <= bp
            ? options?.minScaleMobile ?? 0.3
            : options?.minScale ?? 0.1;

        // Usiamo l’altezza della prima header come riferimento
        const h = headers[0].getBoundingClientRect().height;
        const overlap = Math.max(0, Math.round(h * minScale));
        root.style.setProperty("--ss-overlap", `${overlap}px`);
      };

      const ctx = gsap.context(() => {
        // TEXT REVEAL
        const texts = gsap.utils.toArray<HTMLElement>(`.${styles.ssAnimateText}`);
        texts.forEach((el) => {
          el.setAttribute("data-text", (el.textContent || "").trim());
          ScrollTrigger.create({
            trigger: el,
            start: "top 50%",
            end: "bottom 50%",
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const clipValue = Math.max(0, 100 - self.progress * 100);
              el.style.setProperty("--clip-value", `${clipValue}%`);
            },
          });
        });

        // SERVICES HEADERS MOVIMENTO ORIZZONTALE
        const headers = gsap.utils.toArray<HTMLElement>(`.${styles.ssServicesHeader}`);

        ScrollTrigger.create({
          trigger: `.${styles.ssServices}`,
          start: "top bottom",
          end: "top top",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (headers.length < 3) return;
            gsap.set(headers[0], { x: `${100 - self.progress * 100}%` });
            gsap.set(headers[1], { x: `${-100 + self.progress * 100}%` });
            gsap.set(headers[2], { x: `${100 - self.progress * 100}%` });
          },
        });

        // PIN + SCALE
        ScrollTrigger.create({
          trigger: `.${styles.ssServices}`,
          start: "top top",
          end: () => `+=${window.innerHeight * (options?.pinMultiplier ?? 2)}`,
          pin: true,
          pinSpacing: true,      // lo spazio resta nel flow
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          onRefreshInit: setOverlapVar, // aggiorna overlap PRIMA del refresh
          onUpdate: (self) => {
            if (headers.length < 3) return;

            const bp = options?.breakpoint ?? 1000;
            const minScale =
              window.innerWidth <= bp
                ? options?.minScaleMobile ?? 0.3
                : options?.minScale ?? 0.1;

            if (self.progress <= 0.5) {
              const yProgress = self.progress / 0.5;
              gsap.set(headers[0], { y: `${yProgress * 100}%`, scale: 1 });
              gsap.set(headers[2], { y: `${yProgress * -100}%`, scale: 1 });
            } else {
              gsap.set(headers[0], { y: "100%" });
              gsap.set(headers[2], { y: "-100%" });
              const scaleProgress = (self.progress - 0.5) / 0.5;
              const scale = 1 - scaleProgress * (1 - minScale);
              gsap.set(headers, { scale });
            }
          },
        });

        // Aggiorna overlap anche su resize
        const ro = new ResizeObserver(() => {
          setOverlapVar();
          ScrollTrigger.refresh();
        });
        ro.observe(root);
      }, root);

      // Primo calcolo + refresh
      setOverlapVar();
      requestAnimationFrame(() => ScrollTrigger.refresh());

      cleanupCtx = () => ctx.revert();
    })();

    return () => {
      cleanupCtx?.();
    };
  }, [
    options?.breakpoint,
    options?.minScale,
    options?.minScaleMobile,
    options?.pinMultiplier,
    options?.enableSmooth,
  ]);

  const trio = services.slice(0, 3);

  return (
    <div ref={rootRef} className={styles.ssRoot}>
      {/* ABOUT */}
      <section className={styles.ssAbout}>
        <h1 className={styles.ssAnimateText}>{aboutText}</h1>
      </section>

      {/* SERVICES (PINNED) */}
      <section className={styles.ssServices}>
        {trio.map((m, i) => (
          <div className={styles.ssServicesHeader} key={`${m.src}-${i}`}>
            <Image src={m.src} alt={m.alt ?? `Services ${i + 1}`} fill sizes="100vw" />
          </div>
        ))}
      </section>

      {/* COPY: “appoggiato” agli SVG */}
      <section className={styles.ssServicesCopy}>
        <h1 className={styles.ssAnimateText}>{copyText}</h1>
      </section>
    </div>
  );
}