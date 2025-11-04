"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

export type CamilleMormalSliderProps = {
  images: string[];
  titles: string[];
  className?: string;
  /** "contained" = componente centrato in pagina; "bleed" = full-bleed */
  mode?: "contained" | "bleed";
};

export default function CamilleMormalSlider({
  images,
  titles,
  className,
  mode = "bleed",
}: CamilleMormalSliderProps) {
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

  // First image
  useEffect(() => {
    if (!currentLayerRef.current) return;
    const img = currentLayerRef.current.querySelector<HTMLImageElement>("img");
    if (img && images[0]) img.src = images[0];
  }, [images]);

  // Measure dynamic line-heights (title/counter) and set CSS vars
  useEffect(() => {
    const measure = () => {
      if (!rootRef.current) return;
      const titleWrap = rootRef.current.querySelector(".slider-title-wrapper") as HTMLElement | null;
      const counterWrap = rootRef.current.querySelector(".counter") as HTMLElement | null;

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
    // @ts-ignore
    if (document?.fonts?.ready) {
      // @ts-ignore
      document.fonts.ready.then(measure).catch(() => {});
    }
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [titles, total]);

  if (total === 0) return null;

  const DURATION = 1.2; // seconds

  // ---- UI shifts (counter & titles) + title active fx ----
  const updateUI = (idx: number) => {
    if (!rootRef.current) return;
    const counter = rootRef.current.querySelector(".counter") as HTMLElement;
    const titlesWrap = rootRef.current.querySelector(".slider-title-wrapper") as HTMLElement;
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
    const indicators = rootRef.current.querySelectorAll(".slider-indicators p");
    indicatorRotation.current += dir === "left" ? -90 : 90;
    gsap.killTweensOf(indicators);
    gsap.to(indicators, { rotate: indicatorRotation.current, duration: DURATION * 0.6, ease: "hop" });
  };

  const navTo = (target: number) => {
    if (total === 0) return;
    if (isAnimatingRef.current) return;
    if (target === curr) return;

    const dir: "left" | "right" = target < curr ? "left" : "right";
    setPending(target);
    updateUI(target);

    const currentLayer = currentLayerRef.current!;
    const nextLayer = nextLayerRef.current!;
    const currentImg = currentLayer.querySelector("img") as HTMLImageElement;
    const nextImg = nextLayer.querySelector("img") as HTMLImageElement;

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
      const preview = el.querySelector(".slider-preview") as HTMLElement;
      const indicators = el.querySelector(".slider-indicators") as HTMLElement;
      const slider = el.querySelector(".slider") as HTMLElement;

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
        const thumbs = Array.from(preview.querySelectorAll(".preview"));
        const hit = (e.target as HTMLElement).closest(".preview");
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
    const slider = rootRef.current.querySelector(".slider") as HTMLElement;
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

  return (
    <div
      ref={rootRef}
      className={[
        "cm-camille",
        mode === "contained" ? "cm--contained" : "cm--bleed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet"
      />

      <div className="slider">
        <div className="slider-images">
          <div className="img" ref={currentLayerRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="" alt="" />
          </div>
          <div className="img" ref={nextLayerRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="" alt="" />
          </div>
        </div>

        {/* Title */}
        <div className="slider-title">
          <div className="slider-title-wrapper">
            {titles.slice(0, total).map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>

        {/* Counter (left) */}
        <div className="slider-counter">
          <div className="counter">
            {Array.from({ length: total }).map((_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>
        </div>

        {/* Thumbs */}
        <div className="slider-preview">
          {images.slice(0, total).map((src, i) => (
            <div key={i} className={"preview" + (i === (pending ?? curr) ? " active" : "")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        {/* Indicators (- / +) */}
        <div className="slider-indicators">
          <p>-</p>
          <p>+</p>
        </div>
      </div>

      <style jsx>{`
        .cm-camille * {
          box-sizing: border-box;
          -webkit-user-select: none;
          user-select: none;
        }
        .cm-camille {
          background: #0c0c0c;
          color: #fff;
          font-family: Inter, system-ui, sans-serif;
          position: relative;
          min-height: 100dvh;
        }

        /* MODALITÀ LAYOUT */
        .cm--bleed {
          width: 100vw;
          position: relative;
          left: 0%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }
        .cm--contained {
          width: min(1200px, 92vw);
          margin-inline: auto;
        }

        .slider {
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 520px;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .slider-images {
          position: absolute;
          inset: 0;
        }
        .img {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Title (uses measured line-height) */
        .slider-title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: var(--titleLH, 60px);
          overflow: hidden;
          z-index: 4;
          text-align: center;
          width: 100%;
          padding: 0 2vw;
        }
        .slider-title-wrapper {
          display: grid;
          gap: 0;
          justify-items: center;
        }
        .slider-title-wrapper p {
          font-size: clamp(22px, 6vw, 48px);
          line-height: clamp(32px, 7.5vw, 60px);
          letter-spacing: 0.01em;
          margin: 0;
        }

        /* Counter left (uses measured line-height) */
        .slider-counter {
          position: absolute;
          left: 5vw;
          top: 50%;
          transform: translateY(-50%);
          height: var(--counterLH, 20px);
          overflow: hidden;
          z-index: 4;
        }
        .counter {
          display: grid;
          gap: 0;
        }
        .counter p {
          font-size: clamp(12px, 1.8vw, 16px);
          line-height: var(--counterLH, 20px);
          opacity: 0.9;
          margin: 0;
        }

        /* Indicators & Thumbs base */
        .slider-indicators,
        .slider-preview {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          pointer-events: auto;
        }

        .slider-indicators {
          bottom: max(2.5em, env(safe-area-inset-bottom));
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding: 0 2vw;
        }
        .slider-indicators p {
          font-size: clamp(24px, 4.5vw, 32px);
          cursor: pointer;
          opacity: 0.9;
          transition: opacity 0.25s ease;
          user-select: none;
          margin: 0;
        }
        .slider-indicators p:hover {
          opacity: 1;
        }

        .slider-preview {
          bottom: calc(max(6em, 56px) + env(safe-area-inset-bottom));
          display: grid;
          grid-template-columns: repeat(${total}, 1fr);
          gap: 8px;
        }
        .preview {
          aspect-ratio: 16 / 10;
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          outline: 1px solid rgba(255, 255, 255, 0.25);
          opacity: 0.75;
          transition: opacity 0.25s ease, outline-color 0.25s ease;
          cursor: pointer;
        }
        .preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .preview.active {
          opacity: 1;
          outline-color: rgba(255, 255, 255, 0.9);
        }

        /* Overlay centrati quando in modalità BLEED */
        .cm--bleed .slider-title,
        .cm--bleed .slider-preview,
        .cm--bleed .slider-indicators {
          width: min(1200px, 92vw);
          margin-left: auto;
          margin-right: auto;
        }

        /* breakpoints */
        @media (max-width: 1200px) {
          .slider-indicators {
            gap: 18px;
          }
        }
        @media (max-width: 900px) {
          .slider-preview {
            grid-template-columns: repeat(${Math.max(3, Math.min(total, 5))}, 1fr);
          }
        }
        @media (max-width: 560px) {
          .slider-title {
            height: var(--titleLH, 48px);
            width: 92vw; /* più stretto su mobile */
          }
          .slider-counter {
            left: 4vw;
          }

          /* thumbs in carosello orizzontale */
          .slider-preview {
            width: 92vw;
            grid-auto-flow: column;
            grid-auto-columns: 48%;
            grid-template-columns: unset;
            overflow-x: auto;
            overscroll-behavior-x: contain;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x mandatory;
            gap: 8px;
            padding: 0 2px;
            scrollbar-width: none;
          }
          .slider-preview::-webkit-scrollbar {
            display: none;
          }
          .preview {
            scroll-snap-align: center;
            aspect-ratio: 16 / 10;
            border-radius: 8px;
            outline-width: 1px;
            opacity: 0.8;
          }
        }
        @media (max-width: 380px) {
          .slider-preview {
            grid-auto-columns: 42%;
            gap: 6px;
          }
          .preview {
            aspect-ratio: 16 / 11;
          }
        }
      `}</style>
    </div>
  );
}