"use client";

import { useEffect, useRef } from "react";
import Copy from "../../../components/Copy/Copy";
import useViewTransition from "../../../hooks/useViewTransition";

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const saverRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const { navigateWithTransition } = useViewTransition();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---- config ----
    const SPEED = 3;
    const COUNT = 10;
    const SIZE = 300;
    const CHANGE_DELAY_MS = 20;
    const EDGE_OFFSET = -40;

    let desktop = window.innerWidth >= 1000;
    let canTurn = true;
    let imgIndex = 1;

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
          vx = -vx; x = x <= L ? L : R; setImg();
          canTurn = false; setTimeout(() => (canTurn = true), CHANGE_DELAY_MS);
        }
        if ((y <= T || y >= B) && canTurn) {
          vy = -vy; y = y <= T ? T : B; setImg();
          canTurn = false; setTimeout(() => (canTurn = true), CHANGE_DELAY_MS);
        }

        saver.style.left = `${x}px`;
        saver.style.top = `${y}px`;
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const onResize = () => {
      const prev = desktop;
      desktop = window.innerWidth >= 1000;
      if (desktop && !prev) start();
      if (!desktop && prev) stop();
    };

    window.addEventListener("resize", onResize);
    if (desktop) start();

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative mx-auto flex min-h-screen w-screen items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* floating saver injected via JS */}


      {/* Copy */}
      <div className="relative z-10 mx-auto flex w-[75%] max-w-[2000px] gap-8 px-6 md:gap-10">
        {/* Left column */}
        <div className="flex-1">
          <Copy delay={0.6}>
            <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
              Bring beauty one pixel at time
            </h2>
          </Copy>
        </div>

        {/* Right column */}
        <div className="flex flex-1 flex-col gap-8">
          <div>
            <Copy delay={0.8}>
              <p className="mb-2 text-sm uppercase tracking-wide text-white/60">Focus</p>
              <p>Frontend Engineering</p>
              <p>Animation & Motion Systems</p>
              <p>Design Systems & Branding</p>
            </Copy>
          </div>

          <div>
            <Copy delay={1.0}>
              <p className="mb-2 text-sm uppercase tracking-wide text-white/60">Base</p>
              <p>Barcelona — Remote</p>
            </Copy>
          </div>

          <div>
            {/* email as button */}
            <button
              onClick={() => (window.location.href = "mailto:hello@simoneconti.work")}
              className="inline-flex items-center rounded-full bg-white/90 px-5 py-2.5 font-medium text-black hover:bg-white"
            >
              simonecontisid@gmail.com
            </button>
          </div>

          <div>
            <Copy delay={1.2}>
              <p className="mb-2 text-sm uppercase tracking-wide text-white/60">Credits</p>
              <p>Built by Simone Conti</p>
              <p>Edition 2025</p>
            </Copy>
          </div>
        </div>
      </div>

      {/* Footer row */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="pointer-events-auto mx-auto flex max-w-6xl items-end justify-between gap-4 px-6 py-6 md:py-8">
          <Copy delay={1.4} animateOnScroll={false}>
            <p className="text-sm uppercase tracking-wide text-white/70">Made in Motion</p>
          </Copy>

          <div className="flex gap-6">
            {[
              { label: "LinkedIn", href: "https://linkedin.com/in/tuo-prof" },
              { label: "GitHub", href: "https://github.com/tuo-username" },
              { label: "CodePen", href: "https://codepen.io/tuo-username" },
            ].map((s, i) => (
              <Copy key={s.label} delay={1.5 + i * 0.1} animateOnScroll={false}>
                <a className="text-sm underline-offset-4 hover:underline" href={s.href} target="_blank">
                  {s.label}
                </a>
              </Copy>
            ))}
          </div>

          <Copy delay={1.9} animateOnScroll={false}>
            <p className="text-sm text-white/70">© {new Date().getFullYear()} Simone Conti</p>
          </Copy>
        </div>
      </div>
    </section>
  );
}