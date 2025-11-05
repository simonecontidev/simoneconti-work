"use client";

import React, { useEffect, useMemo, useRef } from "react";
import styles from "./ScrollImageReveal.module.css";

type Item = { src: string; alt: string; caption?: string; bgColor?: string };
type RevealDirection = "top" | "bottom" | "left" | "right";
type ParallaxMode = "same" | "alternate" | "random";

export type ScrollImageRevealProps = {
  items: Item[];
  revealFrom?: RevealDirection;
  once?: boolean;
  duration?: number;
  ease?: string;
  radius?: number;
  showBackgroundLayer?: boolean;
  onActiveIndexChange?: (index: number) => void;
  startTrigger?: string;

  fadeUp?: boolean;
  fadeUpOffset?: number;

  enableParallax?: boolean;
  parallaxAmount?: number;
  parallaxEase?: string;
  parallaxMode?: ParallaxMode;
  parallaxMobileScale?: number;

  colors?: {
    bg?: string;
    text?: string;
    textMuted?: string;
    mediaBg?: string;
    accentStrong?: string;
  };
  className?: string;
};

export default function ScrollImageReveal({
  items,
  revealFrom = "top",
  once = true,
  duration = 1.4,
  ease = "power2.out",
  radius = 16,
  showBackgroundLayer = true,
  onActiveIndexChange,
  startTrigger = "top 85%",

  fadeUp = true,
  fadeUpOffset = 24,

  enableParallax = true,
  parallaxAmount = 90,
  parallaxEase = "power1.out",
  parallaxMode = "alternate",
  parallaxMobileScale = 0.6,

  colors,
  className,
}: ScrollImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const cssVars = useMemo<React.CSSProperties>(() => {
    const v: React.CSSProperties = {};
    if (colors?.bg) v["--cmp-surface" as any] = colors.bg;
    if (colors?.text) v["--cmp-text" as any] = colors.text;
    if (colors?.textMuted) v["--cmp-muted" as any] = colors.textMuted;
    if (colors?.mediaBg) v["--cmp-card" as any] = colors.mediaBg;
    if (colors?.accentStrong) v["--cmp-surface-strong" as any] = colors.accentStrong;
    return v;
  }, [colors]);

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

      const isMobile =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 899px)").matches;

      ctx = gsap.context(() => {
        const cards = Array.from(
          containerRef.current!.querySelectorAll<HTMLDivElement>(`.${styles.irs_item}`)
        );

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
          const img = card.querySelector<HTMLImageElement>(`.${styles.irs_img}`);
          const media = card.querySelector<HTMLDivElement>(`.${styles.irs_media}`);
          if (!img || !media) return;

          // init
          gsap.set(img, { clipPath: clipStart, scale: 1.05, willChange: "clip-path, transform" });
          if (fadeUp)
            gsap.set(media, { opacity: 0, y: fadeUpOffset, willChange: "opacity, transform" });

          // reveal
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
                    gsap.to(bgRef.current, {
                      backgroundColor:
                        color ||
                        getComputedStyle(containerRef.current!)
                          .getPropertyValue("--cmp-surface-strong")
                          .trim(),
                      duration: 0.6,
                      ease: "power2.out",
                    });
                  }
                  onActiveIndexChange?.(index);
                },
              },
              onStart: () => {
                if (fadeUp)
                  gsap.to(media, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
              },
            }
          );

          // PARALLAX solo verticale (↑/↓ per colonna)
          if (enableParallax) {
            const amount = isMobile
              ? parallaxAmount * parallaxMobileScale
              : parallaxAmount;
            const isRightCol = index % 2 === 1;
            const dirY = isRightCol ? -1 : 1;

            gsap.fromTo(
              card,
              { y: amount * 0.6 * dirY },
              {
                y: -amount * 0.6 * dirY,
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
          gsap.set(`.${styles.irs_img}`, { clipPath: clipEnd, clearProps: "willChange" });
          if (fadeUp)
            gsap.set(`.${styles.irs_media}`, {
              opacity: 1,
              y: 0,
              clearProps: "willChange",
            });
        }
      }, containerRef);

      // aggiorna su toggle tema
      const onThemeChange = () => {
        if (!bgRef.current || !containerRef.current) return;
        const accent = getComputedStyle(containerRef.current)
          .getPropertyValue("--cmp-surface-strong")
          .trim();
        bgRef.current.style.backgroundColor = accent;
        // @ts-ignore
        const ST = (window as any)?.ScrollTrigger;
        if (ST?.refresh) ST.refresh();
      };
      window.addEventListener("themechange" as any, onThemeChange);

      return () => {
        window.removeEventListener("themechange" as any, onThemeChange);
      };
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
    colors,
  ]);

  return (
    <section
      className={`${styles.irs_root} ${className ?? ""}`}
      ref={containerRef}
      style={cssVars}
    >
      {showBackgroundLayer && <div className={styles.irs_bg} ref={bgRef} />}
      <div className={styles.irs_grid}>
        {items.map((it, i) => (
          <article
            key={i}
            className={styles.irs_item}
            data-bg={it.bgColor ?? undefined}
            style={{ borderRadius: radius }}
          >
            <div className={styles.irs_media} style={{ borderRadius: radius }}>
              <img
                className={styles.irs_img}
                src={it.src}
                alt={it.alt}
                loading="lazy"
              />
            </div>
            {it.caption && (
              <div className={styles.irs_caption}>
                <p>{it.caption}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}