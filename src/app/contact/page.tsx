// app/contact/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Copy from "../../../components/Copy/Copy";

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const saverRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Floating “saver” animation (desktop only, pointer fine, no reduced motion)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---- config base ----
    const SPEED = 3;
    const COUNT = 10;
    const CHANGE_DELAY_MS = 20;
    const EDGE_OFFSET = -40;

    // media queries
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqPointerFine = window.matchMedia("(pointer: fine)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const canRun = () =>
      mqDesktop.matches && mqPointerFine.matches && !mqReduced.matches;

    let desktop = canRun();
    let canTurn = true;
    let imgIndex = 1;

    // dimensioni dinamiche basate sul container/viewport
    const computeSize = () => {
      const r = container.getBoundingClientRect();
      // 28% del lato min, max 360px, min 160px
      return Math.max(160, Math.min(360, Math.round(Math.min(r.width, r.height) * 0.28)));
    };

    let SIZE = computeSize();

    // preload
    const imgs: HTMLImageElement[] = [];
    const preload = async () => {
      await Promise.all(
        Array.from({ length: COUNT }, (_, i) => {
          const el = new Image();
          el.src = `/objects/obj-${i + 1}.png`;
          imgs.push(el);
          return new Promise((res) => (el.onload = () => res(true)));
        })
      );
    };

    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      saverRef.current?.remove();
      saverRef.current = null;
    };

    const start = async () => {
      if (!desktop) return;
      stop();
      await preload();

      const saver = document.createElement("div");
      saverRef.current = saver;

      Object.assign(saver.style, {
        position: "absolute",
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        pointerEvents: "none",
        zIndex: "0",
        willChange: "transform",
      } as CSSStyleDeclaration);
      container.appendChild(saver);

      const rect = container.getBoundingClientRect();
      let x = rect.width / 2 - SIZE / 2;
      let y = rect.height / 2 - SIZE / 2;
      let vx = (Math.random() > 0.5 ? 1 : -1) * SPEED;
      let vy = (Math.random() > 0.5 ? 1 : -1) * SPEED;

      const setImg = () => {
        imgIndex = (imgIndex % COUNT) + 1;
        saver.style.backgroundImage = `url(/objects/obj-${imgIndex}.png)`;
      };
      setImg();

      const tick = () => {
        if (!saverRef.current || !desktop) return stop();

        const r = container.getBoundingClientRect();
        x += vx;
        y += vy;

        const L = EDGE_OFFSET;
        const R = r.width - SIZE + Math.abs(EDGE_OFFSET);
        const T = EDGE_OFFSET;
        const B = r.height - SIZE + Math.abs(EDGE_OFFSET);

        if ((x <= L || x >= R) && canTurn) {
          vx = -vx;
          x = x <= L ? L : R;
          setImg();
          canTurn = false;
          setTimeout(() => (canTurn = true), CHANGE_DELAY_MS);
        }
        if ((y <= T || y >= B) && canTurn) {
          vy = -vy;
          y = y <= T ? T : B;
          setImg();
          canTurn = false;
          setTimeout(() => (canTurn = true), CHANGE_DELAY_MS);
        }

        saver.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const handleResizeOrMQ = () => {
      const prev = desktop;
      desktop = canRun();
      SIZE = computeSize();
      // aggiorna size live
      if (saverRef.current) {
        saverRef.current.style.width = `${SIZE}px`;
        saverRef.current.style.height = `${SIZE}px`;
      }
      if (desktop && !prev) start();
      if (!desktop && prev) stop();
    };

    window.addEventListener("resize", handleResizeOrMQ);
    mqDesktop.addEventListener?.("change", handleResizeOrMQ);
    mqPointerFine.addEventListener?.("change", handleResizeOrMQ);
    mqReduced.addEventListener?.("change", handleResizeOrMQ);

    if (desktop) start();

    return () => {
      stop();
      window.removeEventListener("resize", handleResizeOrMQ);
      mqDesktop.removeEventListener?.("change", handleResizeOrMQ);
      mqPointerFine.removeEventListener?.("change", handleResizeOrMQ);
      mqReduced.removeEventListener?.("change", handleResizeOrMQ);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="
        relative mx-auto flex min-h-svh w-full items-center justify-center overflow-hidden
        bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white
        px-4 sm:px-6 md:px-8
      "
    >
      {/* Copy */}
      <div
        className="
          relative z-10 mx-auto grid w-full max-w-6xl gap-10 md:gap-12
          md:grid-cols-2
        "
      >
        {/* Left column */}
        <div className="flex items-start md:items-center">
          <Copy delay={0.6}>
            <h2
              className="
                text-3xl sm:text-4xl md:text-6xl font-semibold leading-tight
                tracking-tight
              "
            >
              Bring beauty one pixel at time
            </h2>
          </Copy>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8 sm:gap-10">
          <div>
            <Copy delay={0.8}>
              <p className="mb-2 text-xs sm:text-sm uppercase tracking-wide text-zinc-600 dark:text-white/60">
                Focus
              </p>
              <p className="text-base sm:text-lg">Frontend Engineering</p>
              <p className="text-base sm:text-lg">Animation & Motion Systems</p>
              <p className="text-base sm:text-lg">Design Systems & Branding</p>
            </Copy>
          </div>

          <div>
            <Copy delay={1.0}>
              <p className="mb-2 text-xs sm:text-sm uppercase tracking-wide text-zinc-600 dark:text-white/60">
                Base
              </p>
              <p className="text-base sm:text-lg">Barcelona — Remote</p>
            </Copy>
          </div>

          <div>
            {/* email as button */}
            <button
              onClick={() =>
                (window.location.href = "mailto:hello@simoneconti.work")
              }
              className="
                inline-flex items-center justify-center rounded-full
                px-5 py-2.5 font-medium ring-1 ring-inset
                w-full sm:w-auto
                bg-zinc-900 text-white ring-zinc-900/10 hover:opacity-95
                dark:bg-white/90 dark:text-black dark:ring-white/10
                transition
              "
            >
              simonecontisid@gmail.com
            </button>
          </div>

          <div>
            <Copy delay={1.2}>
              <p className="mb-2 text-xs sm:text-sm uppercase tracking-wide text-zinc-600 dark:text-white/60">
                Credits
              </p>
              <p className="text-base sm:text-lg">Built by Simone Conti</p>
              <p className="text-base sm:text-lg">Edition 2025</p>
            </Copy>
          </div>
        </div>
      </div>
    </section>
  );
}