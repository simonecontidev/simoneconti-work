"use client";

import React, { useEffect, useRef } from "react";

type Item = {
  src: string;
  alt: string;
  caption?: string;
  bgColor?: string;
};

type RevealDirection = "top" | "bottom" | "left" | "right";
type ParallaxMode = "same" | "alternate" | "random";

export type ScrollImageRevealProps = {
  items: Item[];
  revealFrom?: RevealDirection;
  once?: boolean;
  duration?: number;
  ease?: string;
  maxWidth?: number;
  radius?: number;
  showBackgroundLayer?: boolean;
  onActiveIndexChange?: (index: number) => void;
  startTrigger?: string;

  // fade-up
  fadeUp?: boolean;
  fadeUpOffset?: number;

  // parallax
  enableParallax?: boolean;
  parallaxAmount?: number;         // intensità base (px)
  parallaxEase?: string;           // es. "power2.out"
  parallaxMode?: ParallaxMode;     // "same" | "alternate" | "random"
  parallaxMobileScale?: number;    // es. 0.5 => dimezza su mobile
};

export default function ScrollImageReveal({
  items,
  revealFrom = "top",
  once = true,
  duration = 1.4,
  ease = "power2.out",
  maxWidth = 1100,
  radius = 16,
  showBackgroundLayer = true,
  onActiveIndexChange,
  startTrigger = "top 85%",

  fadeUp = true,
  fadeUpOffset = 24,

  enableParallax = false,
  parallaxAmount = 80,
  parallaxEase = "power1.out",
  parallaxMode = "alternate",
  parallaxMobileScale = 0.6,
}: ScrollImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.gsap;
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      // media query per mobile
      const isMobile =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767px)").matches;

      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLDivElement>(".irs_item");

        const clipStart =
          revealFrom === "top"
            ? "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
            : revealFrom === "bottom"
            ? "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
            : revealFrom === "left"
            ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
            : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)";

        const clipEnd = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

        cards.forEach((card, index) => {
          const img = card.querySelector<HTMLImageElement>(".irs_img");
          const media = card.querySelector<HTMLDivElement>(".irs_media");
          if (!img || !media) return;

          // stato iniziale
          gsap.set(img, { clipPath: clipStart, scale: 1.05, willChange: "clip-path, transform" });
          if (fadeUp) gsap.set(media, { opacity: 0, y: fadeUpOffset, willChange: "opacity, transform" });

          // reveal + fade-up
          gsap.fromTo(
            img,
            { clipPath: clipStart, scale: 1.05 },
            {
              clipPath: clipEnd,
              scale: 1,
              duration,
              ease,
              scrollTrigger: {
                trigger: card,
                start: startTrigger,
                toggleActions: once ? "play none none none" : "play reverse play reverse",
                onEnter: () => {
                  if (showBackgroundLayer && bgRef.current) {
                    const color = card.getAttribute("data-bg");
                    if (color) gsap.to(bgRef.current, { backgroundColor: color, duration: 0.6 });
                  }
                  onActiveIndexChange?.(index);
                },
              },
              onStart: () => {
                if (fadeUp) gsap.to(media, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
              },
            }
          );

          // PARALLAX
          if (enableParallax) {
            // intensità (ridotta su mobile)
            const amount = isMobile ? parallaxAmount * parallaxMobileScale : parallaxAmount;

            // direzione per indice
            let dir = 1; // default "same"
            if (parallaxMode === "alternate") dir = index % 2 === 0 ? 1 : -1;
            if (parallaxMode === "random") dir = Math.random() > 0.5 ? 1 : -1;

            // muovi dall'alto verso il basso (o viceversa) in base a dir
            gsap.fromTo(
              card,
              { y: amount * 0.6 * dir },
              {
                y: -amount * 0.6 * dir,
                ease: parallaxEase,
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });

        if (prefersReduced) {
          gsap.set(".irs_img", { clipPath: clipEnd, clearProps: "willChange" });
          if (fadeUp) gsap.set(".irs_media", { opacity: 1, y: 0, clearProps: "willChange" });
        }
      }, containerRef);
    })();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [
    revealFrom,
    once,
    duration,
    ease,
    startTrigger,
    showBackgroundLayer,
    onActiveIndexChange,
    fadeUp,
    fadeUpOffset,
    enableParallax,
    parallaxAmount,
    parallaxEase,
    parallaxMode,
    parallaxMobileScale,
  ]);

  return (
    <section className="irs_root" ref={containerRef}>
      {showBackgroundLayer && <div className="irs_bg" ref={bgRef} />}
      <div
        className="irs_grid"
        style={{
          maxWidth,
          marginInline: "auto",
          gap: "clamp(16px, 3vw, 28px)",
        }}
      >
        {items.map((it, i) => (
          <article
            key={i}
            className="irs_item"
            data-bg={it.bgColor ?? undefined}
            style={{ borderRadius: radius }}
          >
            <div className="irs_media" style={{ borderRadius: radius }}>
              <img className="irs_img" src={it.src} alt={it.alt} loading="lazy" />
            </div>
            {it.caption && (
              <div className="irs_caption">
                <p>{it.caption}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}