"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./PortfolioReveal.module.css";

type RevealDirection = "top" | "bottom" | "left" | "right";

// Tipo minimale basato su ciò che il componente usa davvero
export type PortfolioCardProject = {
  slug: string;
  title: string;
  img: string;         // es: "my-project.jpg" (sarà usato come `/portfolio/${img}`)
  role?: string;
  bgColor?: string;
};

type Props = {
  projects: PortfolioCardProject[];
  revealFrom?: RevealDirection;
  once?: boolean;
  duration?: number;
  ease?: string;
  fadeUp?: boolean;
  fadeUpOffset?: number;
  enableParallax?: boolean;
  parallaxAmount?: number;
  parallaxEase?: string;
  parallaxMobileScale?: number;
  className?: string;
};

export default function PortfolioReveal({
  projects = [],
  revealFrom = "top",
  once = true,
  duration = 1.2,
  ease = "power2.out",
  fadeUp = true,
  fadeUpOffset = 20,
  enableParallax = true,
  parallaxAmount = 90,
  parallaxEase = "power1.out",
  parallaxMobileScale = 0.6,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const cssVars = useMemo<React.CSSProperties>(() => ({}), []);

  useEffect(() => {
    let ctx: any;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.gsap;
      gsap.registerPlugin(ScrollTrigger);

      if (!rootRef.current) return;

      const isMobile =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 899px)").matches;

      ctx = gsap.context(() => {
        const cards = Array.from(
          rootRef.current!.querySelectorAll<HTMLAnchorElement>(`.${styles.card}`)
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
          const img = card.querySelector<HTMLImageElement>(`.${styles.img}`);
          const media = card.querySelector<HTMLDivElement>(`.${styles.media}`);
          const title = card.querySelector<HTMLParagraphElement>(`.${styles.title}`);
          const role = card.querySelector<HTMLParagraphElement>(`.${styles.role}`);
          if (!img || !media || !title) return;

          // init
          gsap.set(img, { clipPath: clipStart, scale: 1.05, willChange: "clip-path, transform" });
          if (fadeUp) gsap.set(media, { opacity: 0.9, y: fadeUpOffset });

          // titolo sempre visibile
          gsap.set(title, { y: 0, opacity: 1 });

          // role nascosto (solo hover/focus)
          if (role) gsap.set(role, { y: 12, opacity: 0 });

          // reveal clip + fade-up
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
                start: "top 85%",
                toggleActions: once ? "play none none none" : "play reverse play reverse",
                onEnter: () => {
                  const color = card.getAttribute("data-bg");
                  if (bgRef.current) {
                    gsap.to(bgRef.current, {
                      backgroundColor:
                        color ||
                        getComputedStyle(rootRef.current!)
                          .getPropertyValue("--cmp-surface-strong")
                          .trim(),
                      duration: 0.6,
                      ease: "power2.out",
                    });
                  }
                },
                onLeave: () => {
                  if (bgRef.current) {
                    gsap.to(bgRef.current, {
                      backgroundColor: getComputedStyle(rootRef.current!)
                        .getPropertyValue("--cmp-surface-strong")
                        .trim(),
                      duration: 0.4,
                      ease: "power1.out",
                    });
                  }
                },
                onLeaveBack: () => {
                  if (bgRef.current) {
                    gsap.to(bgRef.current, {
                      backgroundColor: getComputedStyle(rootRef.current!)
                        .getPropertyValue("--cmp-surface-strong")
                        .trim(),
                      duration: 0.4,
                      ease: "power1.out",
                    });
                  }
                },
              },
              onStart: () => {
                if (fadeUp) gsap.to(media, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
              },
            }
          );

          // parallax
          if (enableParallax) {
            const amount = isMobile ? parallaxAmount * parallaxMobileScale : parallaxAmount;
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

          // hover/focus: img zoom + role
          const onEnter = () => {
            gsap.to(img, { scale: 1.12, duration: 1.2, ease: "power4.out" });
            if (role) gsap.to(role, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.06 });
          };
          const onLeave = () => {
            gsap.to(img, { scale: 1.0, duration: 1.2, ease: "power4.out" });
            if (role) gsap.to(role, { y: 12, opacity: 0, duration: 0.45, ease: "power3.out" });
          };

          card.addEventListener("mouseenter", onEnter);
          card.addEventListener("mouseleave", onLeave);
          card.addEventListener("focus", onEnter, true);
          card.addEventListener("blur", onLeave, true);
        });
      }, rootRef);

      const onThemeChange = () => {
        if (!bgRef.current || !rootRef.current) return;
        const accent = getComputedStyle(rootRef.current)
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
    fadeUp,
    fadeUpOffset,
    enableParallax,
    parallaxAmount,
    parallaxEase,
    parallaxMobileScale,
  ]);

  return (
    <section
      ref={rootRef}
      className={`${styles.root} ${className ?? ""}`}
      style={cssVars}
    >
      <div className={styles.bg} ref={bgRef} />
      <header className={styles.header}>
        <h1 className={styles.h1}>Portfolio</h1>
      </header>

      <div className={styles.grid}>
        {projects.map((p, idx) => (
          <Link
            key={p.slug}
            href={`/portfolio/${p.slug}`}
            className={styles.card}
            data-bg={p.bgColor ?? undefined}
          >
            <div className={styles.media}>
              <Image
                src={`/portfolio/${p.img}`}
                alt={p.title}
                fill
                className={styles.img}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                priority={idx < 4}
              />
            </div>

            <div className={styles.meta}>
              <div className={styles.titleMask}>
                <p className={styles.title} aria-hidden>
                  {p.title}
                </p>
              </div>
              {p.role && <p className={styles.role}>{p.role}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}