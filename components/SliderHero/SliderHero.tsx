"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

export type SliderHeroProps = {
  images: string[];
  titles: string[];
  className?: string;
  mode?: "contained" | "bleed";
  captions?: string[][];
  smallTexts?: (string | null)[];
};

export default function SliderHero({
  images,
  titles,
  className,
  mode = "bleed",
}: SliderHeroProps) {
  const total = useMemo(() => Math.min(images.length, titles.length), [images, titles]);
  const [curr, setCurr] = useState(0);
  const [pending, setPending] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const currentLayerRef = useRef<HTMLDivElement | null>(null);
  const nextLayerRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const indicatorRotation = useRef(0);
  const isAnimatingRef = useRef(false);

  // swipe refs
  const pointerActive = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);

  // responsive line-heights (measured)
  const titleLHRef = useRef<number>(60);
  const counterLHRef = useRef<number>(20);

  useEffect(() => {
    gsap.registerPlugin(CustomEase);
    if (!CustomEase.get("hop")) {
      CustomEase.create(
        "hop",
        "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
      );
    }
  }, []);

  // ✅ se non ci sono slide, non renderizziamo nulla
  if (total === 0) return null;

  // Misura line-heights dinamici (title/counter) e setta CSS vars
  useEffect(() => {
    const measure = () => {
      if (!rootRef.current) return;
      const titleWrap = rootRef.current.querySelector(".sh-title-wrapper") as HTMLElement | null;
      const counterWrap = rootRef.current.querySelector(".sh-counter-inner") as HTMLElement | null;

      const titleFirst = titleWrap?.querySelector("p") as HTMLElement | null;
      const counterFirst = counterWrap?.querySelector("p") as HTMLElement | null;

      if (titleFirst) {
        const lh = parseFloat(getComputedStyle(titleFirst).lineHeight || "60");
        if (!Number.isNaN(lh) && lh > 0) titleLHRef.current = lh;
        rootRef.current.style.setProperty("--titleLH", `${titleLHRef.current}px`);
      }
      if (counterFirst) {
        const lh = parseFloat(getComputedStyle(counterFirst).lineHeight || "20");
        if (!Number.isNaN(lh) && lh > 0) counterLHRef.current = lh;
        rootRef.current.style.setProperty("--counterLH", `${counterLHRef.current}px`);
      }
    };

    measure();
    if (document?.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [titles, total]);

  const DURATION = 1.2; // seconds

  // ---- UI shifts (counter & titles) + title active fx ----
  const updateUI = (idx: number) => {
    if (!rootRef.current) return;
    const counter = rootRef.current.querySelector(".sh-counter-inner") as HTMLElement;
    const titlesWrap = rootRef.current.querySelector(".sh-title-wrapper") as HTMLElement;
    const titleEls = Array.from(titlesWrap.querySelectorAll("p"));

    const counterStep = counterLHRef.current || 20;
    const titleStep = titleLHRef.current || 60;

    gsap.killTweensOf([counter, titlesWrap, ...titleEls]);
    gsap.to(counter, { y: -counterStep * idx, duration: DURATION, ease: "hop" });
    gsap.to(titlesWrap, { y: -titleStep * idx, duration: DURATION, ease: "hop" });

    const activeTitle = titleEls[idx];
    if (activeTitle) {
      gsap.fromTo(
        activeTitle,
        { opacity: 0, y: Math.min(10, titleStep * 0.2), scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: DURATION * 0.7, ease: "hop" }
      );
    }
  };

  const rotateIndicators = (dir: "left" | "right") => {
    if (!rootRef.current) return;
    const indicators = rootRef.current.querySelectorAll(".sh-indicators p");
    indicatorRotation.current += dir === "left" ? -90 : 90;
    gsap.killTweensOf(indicators);
    gsap.to(indicators, { rotate: indicatorRotation.current, duration: DURATION * 0.6, ease: "hop" });
  };

  const navTo = (target: number) => {
    if (total === 0) return;
    if (isAnimatingRef.current) return;
    if (target === curr) return;
    if (!images[target]) return; // sicurezza

    const dir: "left" | "right" = target < curr ? "left" : "right";
    setPending(target);
    updateUI(target);

    const currentLayer = currentLayerRef.current!;
    const nextLayer = nextLayerRef.current!;
    const currentImg = currentLayer.querySelector("img") as HTMLImageElement | null;
    const nextImg = nextLayer.querySelector("img") as HTMLImageElement | null;

    if (!currentImg || !nextImg) return;

    // prepara la prossima immagine
    nextImg.src = images[target];

    tlRef.current?.kill();
    gsap.killTweensOf([currentImg, nextImg, currentLayer, nextLayer]);

    gsap.set(nextLayer, {
      clipPath:
        dir === "left"
          ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
          : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      zIndex: 2,
    });
    gsap.set(currentLayer, { zIndex: 1 });
    gsap.set(nextImg, { x: dir === "left" ? -220 : 220 });

    isAnimatingRef.current = true;

    const tl = gsap.timeline({ defaults: { ease: "hop" } });
    tlRef.current = tl;

    tl.to(currentImg, { x: dir === "left" ? 260 : -260, duration: DURATION }, 0)
      .to(nextLayer, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: DURATION }, 0)
      .to(nextImg, { x: 0, duration: DURATION }, 0)
      .add(() => {
        // alla fine aggiorna il layer corrente con la nuova immagine
        currentImg.src = images[target];
        gsap.set([currentImg, nextImg, currentLayer, nextLayer], { clearProps: "all" });
        setCurr(target);
        setPending(null);
        isAnimatingRef.current = false;
      });

    rotateIndicators(dir);
  };

  const goLeft = () => navTo(curr > 0 ? curr - 1 : total - 1);
  const goRight = () => navTo(curr < total - 1 ? curr + 1 : 0);

  // ---- Click handlers (indicators / preview / halves) ----
  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;

    const onClick = (e: MouseEvent) => {
      const preview = el.querySelector(".sh-preview") as HTMLElement;
      const indicators = el.querySelector(".sh-indicators") as HTMLElement;
      const slider = el.querySelector(".sh-slider") as HTMLElement;

      // indicators: left (-), right (+)
      if (indicators && indicators.contains(e.target as Node)) {
        const ps = Array.from(indicators.querySelectorAll("p"));
        const hitP = (e.target as HTMLElement).closest("p");
        if (hitP) {
          e.stopPropagation();
          if (hitP === ps[0]) goLeft();
          else goRight();
        }
        return;
      }

      // thumbnails
      if (preview && preview.contains(e.target as Node)) {
        const thumbs = Array.from(preview.querySelectorAll(".sh-preview-item"));
        const hit = (e.target as HTMLElement).closest(".sh-preview-item");
        if (hit) {
          const idx = thumbs.indexOf(hit as HTMLElement);
          if (idx >= 0) navTo(idx);
        }
        return;
      }

      // left/right halves
      const rect = slider.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width / 2) goLeft();
      else goRight();
    };

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [curr, total]);

  // ---- Keyboard: arrows ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goRight();
      if (e.key === "ArrowLeft") goLeft();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [curr, total]);

  // ---- Swipe / Drag (pointer) ----
  useEffect(() => {
    if (!rootRef.current) return;
    const slider = rootRef.current.querySelector(".sh-slider") as HTMLElement;
    if (!slider) return;

    const onDown = (e: PointerEvent) => {
      pointerActive.current = true;
      startX.current = e.clientX;
      lastX.current = e.clientX;
      slider.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!pointerActive.current) return;
      lastX.current = e.clientX;
    };
    const onUp = (e: PointerEvent) => {
      if (!pointerActive.current) return;
      pointerActive.current = false;
      slider.releasePointerCapture(e.pointerId);
      const dx = lastX.current - startX.current;
      const threshold = (slider.clientWidth || window.innerWidth) * 0.09;
      if (Math.abs(dx) > threshold) {
        dx < 0 ? goRight() : goLeft();
      }
    };

    slider.addEventListener("pointerdown", onDown);
    slider.addEventListener("pointermove", onMove);
    slider.addEventListener("pointerup", onUp);
    slider.addEventListener("pointercancel", onUp);

    return () => {
      slider.removeEventListener("pointerdown", onDown);
      slider.removeEventListener("pointermove", onMove);
      slider.removeEventListener("pointerup", onUp);
      slider.removeEventListener("pointercancel", onUp);
    };
  }, [curr, total]);

  // ✅ inizializziamo i due <img> con una src valida per evitare warning
  const firstSrc = images[0];

  return (
    <div
      ref={rootRef}
      className={[
        "sh-hero",
        mode === "contained" ? "sh--contained" : "sh--bleed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* opzionale: font per i testi del componente */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet"
      />

      <div className="sh-slider">
        <div className="sh-images">
          <div className="sh-img" ref={currentLayerRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={firstSrc} alt="" />
          </div>
          <div className="sh-img" ref={nextLayerRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={firstSrc} alt="" />
          </div>
        </div>

        {/* Title */}
        <div className="sh-title">
          <div className="sh-title-wrapper">
            {titles.slice(0, total).map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>

        {/* Counter (left) */}
        <div className="sh-counter">
          <div className="sh-counter-inner">
            {Array.from({ length: total }).map((_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>
        </div>

        {/* Thumbs */}
        <div className="sh-preview">
          {images.slice(0, total).map((src, i) => (
            <div key={i} className={"sh-preview-item" + (i === (pending ?? curr) ? " active" : "")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        {/* Indicators (- / +) */}
        <div className="sh-indicators">
          <p>-</p>
          <p>+</p>
        </div>
      </div>

      <style jsx>{`
        .sh-hero * {
          box-sizing: border-box;
          -webkit-user-select: none;
          user-select: none;
        }
        .sh-hero {
          background: #0c0c0c;
          color: #fff;
          font-family: Inter, system-ui, sans-serif;
          position: relative;
          min-height: 100dvh;
        }

        /* MODALITÀ LAYOUT */
        .sh--bleed {
          width: 100vw;
          position: relative;
          left: 0%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }
        .sh--contained {
          width: min(1200px, 92vw);
          margin-inline: auto;
        }

        .sh-slider {
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 520px;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .sh-images { position: absolute; inset: 0; }
        .sh-img { position: absolute; inset: 0; overflow: hidden; }
        .sh-img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }

        /* Title (uses measured line-height) */
        .sh-title {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          height: var(--titleLH, 60px);
          overflow: hidden; z-index: 4; text-align: center;
          width: 100%; padding: 0 2vw;
        }
        .sh-title-wrapper { display: grid; gap: 0; justify-items: center; }
        .sh-title-wrapper p {
          font-size: clamp(22px, 6vw, 48px);
          line-height: clamp(32px, 7.5vw, 60px);
          letter-spacing: 0.01em; margin: 0;
        }

        /* Counter left (uses measured line-height) */
        .sh-counter {
          position: absolute; left: 5vw; top: 50%;
          transform: translateY(-50%);
          height: var(--counterLH, 20px);
          overflow: hidden; z-index: 4;
        }
        .sh-counter-inner { display: grid; gap: 0; }
        .sh-counter-inner p {
          font-size: clamp(12px, 1.8vw, 16px);
          line-height: var(--counterLH, 20px);
          opacity: 0.9; margin: 0;
        }

        /* Indicators & Thumbs base */
        .sh-indicators, .sh-preview {
          position: absolute; left: 50%;
          transform: translateX(-50%);
          z-index: 5; pointer-events: auto;
        }

        .sh-indicators {
          bottom: max(2.5em, env(safe-area-inset-bottom));
          display: flex; justify-content: space-between; align-items: center;
          gap: 24px; padding: 0 2vw;
        }
        .sh-indicators p {
          font-size: clamp(24px, 4.5vw, 32px);
          cursor: pointer; opacity: 0.9;
          transition: opacity 0.25s ease; user-select: none; margin: 0;
        }
        .sh-indicators p:hover { opacity: 1; }

        .sh-preview {
          bottom: calc(max(8em, 46px) + env(safe-area-inset-bottom));
          display: grid; grid-template-columns: repeat(${total}, 1fr);
          gap: 8px;
        }
        .sh-preview-item {
          aspect-ratio: 16 / 10; position: relative; overflow: hidden;
          border-radius: 6px; outline: 1px solid rgba(255,255,255,0.25);
          opacity: 0.75; transition: opacity 0.25s ease, outline-color 0.25s ease;
          cursor: pointer;
        }
        .sh-preview-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sh-preview-item.active { opacity: 1; outline-color: rgba(255,255,255,0.9); }

        /* Overlay centrati quando in modalità BLEED */
        .sh--bleed .sh-title,
        .sh--bleed .sh-preview,
        .sh--bleed .sh-indicators {
          width: min(1200px, 92vw);
          margin-left: auto; margin-right: auto;
        }

        /* breakpoints */
        @media (max-width: 1200px) { .sh-indicators { gap: 18px; } }
        @media (max-width: 900px) {
          .sh-preview { grid-template-columns: repeat(${Math.max(3, Math.min(total, 5))}, 1fr); }
        }
        @media (max-width: 560px) {
          .sh-title { height: var(--titleLH, 48px); width: 92vw; }
          .sh-counter { left: 4vw; }

          /* thumbs in carosello orizzontale */
          .sh-preview {
            width: 92vw;
            grid-auto-flow: column; grid-auto-columns: 48%;
            grid-template-columns: unset;
            overflow-x: auto; overscroll-behavior-x: contain;
            -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;
            gap: 8px; padding: 0 2px; scrollbar-width: none;
          }
          .sh-preview::-webkit-scrollbar { display: none; }
          .sh-preview-item {
            scroll-snap-align: center; aspect-ratio: 16 / 10;
            border-radius: 8px; outline-width: 1px; opacity: 0.8;
          }
        }
        @media (max-width: 380px) {
          .sh-preview { grid-auto-columns: 42%; gap: 6px; }
          .sh-preview-item { aspect-ratio: 16 / 11; }
        }
      `}</style>
    </div>
  );
}