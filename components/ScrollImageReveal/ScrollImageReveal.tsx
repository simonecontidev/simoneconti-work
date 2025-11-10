"use client";

import React, { useEffect, useMemo, useRef } from "react";
import styles from "./ScrollImageReveal.module.css";

type Item = { src: string; alt: string; caption?: string; bgColor?: string };
type RevealDirection = "top" | "bottom" | "left" | "right";
type ParallaxMode = "same" | "alternate" | "random";
type CSSVars = React.CSSProperties & { [key: `--${string}`]: string };

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
  parallaxMobileScale?: number; // kept for compatibility, no longer used when disabled
  /** NEW: disable parallax at/under this width (px). Default 900. */
  parallaxBreakpoint?: number;

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
  parallaxBreakpoint = 900, // ← NEW default

  colors,
  className,
}: ScrollImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const cssVars = useMemo<CSSVars>(() => {
    const v: CSSVars = {};
    if (colors?.bg) v["--cmp-surface"] = colors.bg;
    if (colors?.text) v["--cmp-text"] = colors.text;
    if (colors?.textMuted) v["--cmp-muted"] = colors.textMuted;
    if (colors?.mediaBg) v["--cmp-card"] = colors.mediaBg;
    if (colors?.accentStrong) v["--cmp-surface-strong"] = colors.accentStrong;
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

      // --- Responsive parallax toggle
      const bpQuery = window.matchMedia(`(max-width: ${parallaxBreakpoint}px)`);
      let isSmall = bpQuery.matches;
      const parallaxEnabled = enableParallax && !prefersReduced && !isSmall;

      const onBPChange = () => {
        isSmall = bpQuery.matches;
        // Rebuild ScrollTriggers with new setting
        ScrollTrigger.getAll().forEach((st) => {
          const trg = st.vars?.trigger as HTMLElement | undefined;
          if (trg && containerRef.current && trg.closest(`.${styles.irs_root}`)) st.kill();
        });
        if (ctx) ctx.revert(); // revert old context
        build(); // rebuild with current state
      };

      bpQuery.addEventListener?.("change", onBPChange);
      bpQuery.addListener?.(onBPChange); // Safari fallback

      const build = () => {
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
                  invalidateOnRefresh: true,
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

            // --- PARALLAX (disabled on small screens or reduced motion)
            if (parallaxEnabled) {
              // Keep mode API for future, here we just move vertically
              const dirY =
                parallaxMode === "alternate"
                  ? index % 2 === 1
                    ? -1
                    : 1
                  : 1;

              gsap.fromTo(
                card,
                { y: (parallaxAmount * 0.6) * dirY },
                {
                  y: -(parallaxAmount * 0.6) * dirY,
                  ease: parallaxEase,
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true,
                  },
                }
              );
            } else {
              // Clear any transform if parallax is off
              gsap.set(card, { y: 0 });
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

        // theme toggles → refresh
        // (done once; ScrollTrigger.refresh already bound to triggers above)
      };

      build();

      const onThemeChange = () => {
        if (!bgRef.current || !containerRef.current) return;
        const accent = getComputedStyle(containerRef.current)
          .getPropertyValue("--cmp-surface-strong")
          .trim();
        bgRef.current.style.backgroundColor = accent;
        // @ts-ignore
        const ST = (window as any)?.ScrollTrigger;
        ST?.refresh?.();
      };
      window.addEventListener("themechange" as any, onThemeChange);

      return () => {
        window.removeEventListener("themechange" as any, onThemeChange);
        bpQuery.removeEventListener?.("change", onBPChange);
        bpQuery.removeListener?.(onBPChange);
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
    parallaxMobileScale, // kept in deps for API stability
    parallaxBreakpoint,
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
              <img className={styles.irs_img} src={it.src} alt={it.alt} loading="lazy" />
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