// app/contact/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Copy from "../../../components/Copy/Copy";

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const saverRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const rectRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const sizeRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);

  // Floating “saver” animation (desktop only, pointer fine, no reduced motion)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const BASE_SPEED = 120; // px/sec (usiamo delta time)
    const COUNT = 10;
    const CHANGE_DELAY_MS = 20;
    const EDGE_OFFSET = -40;

    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqPointerFine = window.matchMedia("(pointer: fine)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const canRun = () => mqDesktop.matches && mqPointerFine.matches && !mqReduced.matches;

    let desktop = canRun();
    let canTurn = true;
    let imgIndex = 1;

    // misura base
    const computeSize = () => {
      const { w, h } = rectRef.current;
      return Math.max(160, Math.min(360, Math.round(Math.min(w, h) * 0.28)));
    };

    // aggiorna rectRef con ResizeObserver (più efficiente)
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        rectRef.current = { w: cr.width, h: cr.height };
        sizeRef.current = computeSize();
        if (saverRef.current) {
          saverRef.current.style.width = `${sizeRef.current}px`;
          saverRef.current.style.height = `${sizeRef.current}px`;
        }
      }
    });
    ro.observe(container);

    // Preload immagini una volta
    const imgs: HTMLImageElement[] = [];
    const preload = async () => {
      imgs.length = 0;
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
      if (saverRef.current) {
        saverRef.current.remove();
        saverRef.current = null;
      }
    };

    const setImg = () => {
      if (!saverRef.current) return;
      imgIndex = (imgIndex % COUNT) + 1;
      saverRef.current.style.backgroundImage = `url(/objects/obj-${imgIndex}.png)`;
    };

    const start = async () => {
      if (!desktop) return;
      stop();
      await preload();

      // inizializza misure subito
      const r = container.getBoundingClientRect();
      rectRef.current = { w: r.width, h: r.height };
      sizeRef.current = computeSize();

      const saver = document.createElement("div");
      saverRef.current = saver;

      Object.assign(saver.style, {
        position: "absolute",
        width: `${sizeRef.current}px`,
        height: `${sizeRef.current}px`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        pointerEvents: "none",
        zIndex: "0",
        willChange: "transform",
      } as CSSStyleDeclaration);
      saver.setAttribute("aria-hidden", "true"); // decorativo
      container.appendChild(saver);

      // posizione/velocità iniziali
      let x = rectRef.current.w / 2 - sizeRef.current / 2;
      let y = rectRef.current.h / 2 - sizeRef.current / 2;
      let vx = (Math.random() > 0.5 ? 1 : -1) * BASE_SPEED;
      let vy = (Math.random() > 0.5 ? 1 : -1) * BASE_SPEED;

      setImg();
      lastTsRef.current = performance.now();

      const tick = (ts: number) => {
        if (!saverRef.current || !desktop) {
          stop();
          return;
        }
        if (pausedRef.current) {
          // manteniamo lastTs aggiornato per evitare salti al resume
          lastTsRef.current = ts;
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000); // clamp a 50ms
        lastTsRef.current = ts;

        const { w, h } = rectRef.current;
        const SIZE = sizeRef.current;

        x += vx * dt;
        y += vy * dt;

        const L = EDGE_OFFSET;
        const R = w - SIZE + Math.abs(EDGE_OFFSET);
        const T = EDGE_OFFSET;
        const B = h - SIZE + Math.abs(EDGE_OFFSET);

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

        saver.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const handleResizeOrMQ = () => {
      const prev = desktop;
      desktop = canRun();
      // size verrà aggiornato dal ResizeObserver
      if (desktop && !prev) start();
      if (!desktop && prev) stop();
    };

    const handleVisibility = () => {
      pausedRef.current = document.visibilityState === "hidden";
    };

    window.addEventListener("resize", handleResizeOrMQ);
    document.addEventListener("visibilitychange", handleVisibility);
    mqDesktop.addEventListener?.("change", handleResizeOrMQ);
    mqPointerFine.addEventListener?.("change", handleResizeOrMQ);
    mqReduced.addEventListener?.("change", handleResizeOrMQ);
    // Safari fallback
    mqDesktop.addListener?.(handleResizeOrMQ);
    mqPointerFine.addListener?.(handleResizeOrMQ);
    mqReduced.addListener?.(handleResizeOrMQ);

    if (desktop) start();

    return () => {
      stop();
      ro.disconnect();
      window.removeEventListener("resize", handleResizeOrMQ);
      document.removeEventListener("visibilitychange", handleVisibility);
      mqDesktop.removeEventListener?.("change", handleResizeOrMQ);
      mqPointerFine.removeEventListener?.("change", handleResizeOrMQ);
      mqReduced.removeEventListener?.("change", handleResizeOrMQ);
      mqDesktop.removeListener?.(handleResizeOrMQ);
      mqPointerFine.removeListener?.(handleResizeOrMQ);
      mqReduced.removeListener?.(handleResizeOrMQ);
    };
  }, []);

  // Accessibilità tastiera per il bottone mailto
  const onMailtoKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = "mailto:hello@simoneconti.work";
    }
  };

  return (
    <section
      ref={containerRef}
      role="region"
      aria-label="Contact section"
      className="
        relative mx-auto flex min-h-svh w-full items-center justify-center overflow-hidden
        bg-[var(--bg)] text-[var(--fg)]
        px-4 sm:px-6 md:px-8
        transition-colors
      "
    >
      {/* Copy */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 md:gap-12 md:grid-cols-2">
        {/* Left column */}
        <div className="flex items-start md:items-center">
          <div>
            <Copy delay={0.6}>
              <h2
                className="
                  text-3xl sm:text-4xl md:text-6xl font-semibold leading-tight tracking-tight
                "
              >
                Let’s build something that feels alive.
              </h2>
            </Copy>
            <Copy delay={0.7}>
              <p className="mt-4 max-w-xl text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
                I’m always open to collaborations, freelance projects, or full-time roles that value design, motion, and meaningful interaction.
              </p>
            </Copy>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8 sm:gap-10">
          <Copy delay={0.75}>
            <p className="text-base sm:text-lg mb-4">
              Whether you’re looking for a frontend engineer, a creative developer, or just curious about my work, I’d love to hear from you.
            </p>
            <p className="text-base sm:text-lg mb-4">
              I believe the best digital experiences are not only functional but emotional — coded with clarity, rhythm, and care.
            </p>
            <p className="text-base sm:text-lg">
              Drop me a message. Tell me about your project, your product, or your team. I’ll reply personally within a day.
            </p>
          </Copy>

          <div>
            <Copy delay={0.8}>
              <p className="mb-2 text-xs sm:text-sm uppercase tracking-wide text-zinc-600 dark:text-zinc-400/80">
                Focus
              </p>
              <p className="text-base sm:text-lg">Frontend Engineering</p>
              <p className="text-base sm:text-lg">Animation & Motion Systems</p>
              <p className="text-base sm:text-lg">Design Systems & Branding</p>
            </Copy>
          </div>

          <div>
            <Copy delay={1.0}>
              <p className="mb-2 text-xs sm:text-sm uppercase tracking-wide text-zinc-600 dark:text-zinc-400/80">
                Location
              </p>
              <p className="text-base sm:text-lg">Barcelona · Remote worldwide</p>
            </Copy>
          </div>

          <div>
            {/* email as button */}
            <button
              onClick={() => (window.location.href = "mailto:hello@simoneconti.work")}
              onKeyDown={onMailtoKey}
              className="
                inline-flex items-center justify-center rounded-full px-5 py-2.5 font-medium ring-1 ring-inset w-full sm:w-auto
                bg-zinc-900 text-zinc-50 ring-zinc-900/10 hover:opacity-95
                dark:bg-zinc-50 dark:text-zinc-950 dark:ring-zinc-50/10
                transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400
              "
              aria-label="Contact Simone via email"
            >
              Let’s Talk
            </button>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400/80">
              or email me at{" "}
              <a
                href="mailto:hello@simoneconti.work"
                className="underline underline-offset-2 hover:no-underline"
              >
                hello@simoneconti.work
              </a>
            </p>
          </div>

          <div>
            <Copy delay={1.2}>
              <p className="mb-2 text-xs sm:text-sm uppercase tracking-wide text-zinc-600 dark:text-zinc-400/80">
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