// app/contact/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Copy from "../../../components/Copy/Copy";

/* ---------------- Helpers: mail sicura + copy ---------------- */
function buildEmail(): string {
  // Semplice offuscamento anti-bot: niente stringa completa in sorgente
  const u = "hello";
  const d = "simoneconti";
  const tld = "work";
  return `${u}@${d}.${tld}`;
}

function useClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // fallback invisibile
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  }, []);
  return { copied, copy };
}

/* ---------------- Mail button: a11y + middle click ---------------- */
function MailButton({
  className = "",
  label = "Let’s Talk",
}: {
  className?: string;
  label?: string;
}) {
  const email = buildEmail();

  const openMail = useCallback(() => {
    window.location.href = `mailto:${email}`;
  }, [email]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMail();
    }
  };

  const onAuxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Middle click → apri comunque il client
    if (e.button === 1) openMail();
  };

  return (
    <button
      type="button"
      onClick={openMail}
      onKeyDown={onKeyDown}
      onAuxClick={onAuxClick}
      className={[
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 font-medium ring-1 ring-inset w-full sm:w-auto",
        "bg-zinc-900 text-zinc-50 ring-zinc-900/10 hover:opacity-95",
        "dark:bg-zinc-50 dark:text-zinc-950 dark:ring-zinc-50/10",
        "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400",
        className,
      ].join(" ")}
      aria-label="Contact Simone via email"
    >
      {label}
    </button>
  );
}

/* ---------------- SafeLink esterno con rel corretto ---------------- */
function SafeExternalLink({
  href,
  children,
  className = "",
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const saverRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const rectRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const sizeRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);
  const { copied, copy } = useClipboard();

  // Floating “saver” animation (desktop only, pointer fine, no reduced motion)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const BASE_SPEED = 120; // px/sec
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

    const computeSize = () => {
      const { w, h } = rectRef.current;
      return Math.max(160, Math.min(360, Math.round(Math.min(w, h) * 0.28)));
    };

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
      saver.setAttribute("aria-hidden", "true");
      container.appendChild(saver);

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
          lastTsRef.current = ts;
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
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

  const email = buildEmail();

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
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
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

          {/* Focus / Location */}
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

          {/* CTA + mail alternatives */}
          <div className="flex flex-col gap-2">
            <MailButton />

            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400/80">
              or email me at{" "}
              {/* Fallback <a> per utenti senza JS, con rel corretto */}
              <a
                href={`mailto:${email}`}
                className="underline underline-offset-2 hover:no-underline"
                rel="noopener noreferrer"
              >
                {email}
              </a>
            </p>

            <div className="flex items-center gap-6 pt-1">
              <button
                type="button"
                onClick={() => copy(email)}
                className="text-sm underline underline-offset-4 hover:no-underline text-zinc-700 dark:text-zinc-300"
                aria-live="polite"
              >
                {copied ? "Copied ✓" : "Copy email"}
              </button>

              {/* Social: sempre rel="noopener" */}
              <SafeExternalLink
                href="https://www.linkedin.com/in/simonecontidev/"
                ariaLabel="Open Simone's LinkedIn"
                className="text-sm underline underline-offset-4 hover:no-underline text-zinc-700 dark:text-zinc-300"
              >
                LinkedIn
              </SafeExternalLink>
              <SafeExternalLink
                href="https://github.com/simoneconti"
                ariaLabel="Open Simone's GitHub"
                className="text-sm underline underline-offset-4 hover:no-underline text-zinc-700 dark:text-zinc-300"
              >
                GitHub
              </SafeExternalLink>
              <SafeExternalLink
                href="https://codepen.io/"
                ariaLabel="Open Simone's CodePen"
                className="text-sm underline underline-offset-4 hover:no-underline text-zinc-700 dark:text-zinc-300"
              >
                CodePen
              </SafeExternalLink>
            </div>
          </div>

          {/* Credits */}
          <div>
            <Copy delay={1.2}>
              <p className="mb-2 text-xs sm:text-sm uppercase tracking-wide text-zinc-600 dark:text-zinc-400/80">
                Credits
              </p>
              <p className="text-base sm:text-lg">Built by Simone Conti</p>
              <p className="text-base sm:text-lg">Edition {new Date().getFullYear()}</p>
            </Copy>
          </div>
        </div>
      </div>
    </section>
  );
}