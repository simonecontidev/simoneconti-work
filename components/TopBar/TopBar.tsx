"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useViewTransition from "../../hooks/useViewTransition";
import AnimatedButton from "../../components/ui/AnimatedButton";
import { useGsapRegister } from "@/lib/gsap";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

export default function TopBar() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const { navigateWithTransition } = useViewTransition();
  const { gsap } = useGsapRegister();
  const [barH, setBarH] = useState(0);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const EXTRA_PAD_PX = 8; // leggero padding top extra sui contenuti

  // Hide on scroll (down hides, up shows)
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    gsap.set(el, { y: 0 });

    let last = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const cur = window.scrollY;
        const dir = cur > last ? 1 : -1;

        if (dir === 1 && cur > 50) {
          gsap.to(el, { y: -el.offsetHeight, duration: 1, ease: "power4.out" });
        } else if (dir === -1) {
          gsap.to(el, { y: 0, duration: 1, ease: "power4.out" });
        }

        last = cur;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [gsap]);

  // Misura TopBar per calcolare lo spacer
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const apply = () => setBarH(el.offsetHeight);

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);

    window.addEventListener("resize", apply);
    const id = window.setTimeout(apply, 50);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      window.clearTimeout(id);
    };
  }, []);

  // Reset posizione topbar su mount/update
  useEffect(() => {
    if (barRef.current) gsap.set(barRef.current, { y: 0 });
  }, [gsap, pathname]);

  return (
    <>
      <div
        ref={barRef}
        className="
          fixed inset-x-0 top-0 z-50
          flex items-center justify-between
          px-6 py-3 md:px-8 md:py-4
          backdrop-blur-sm bg-transparent
          transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
          pointer-events-auto
        "
        style={{
          isolation: "isolate",
          // piccolo padding in più verso l'alto + safe area
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 4px)",
        }}
      >
        {/* Logo / Titolo */}
        <button
          aria-label="Go to Home"
          onClick={() => navigateWithTransition("/")}
          className="inline-flex items-center justify-center select-none"
        >
          <h1
            className="
              text-2xl md:text-3xl font-semibold tracking-tight uppercase
              mix-blend-difference text-white
              transition-[color] duration-500 ease-in-out
            "
          >
            Simone Conti
          </h1>
        </button>

        {/* CTA e toggle */}
        <div className="flex items-center gap-4">
          <AnimatedButton
            label="Contact me"
            route="/contact"
            hoverLabel="View Work"
            onClick={() => navigateWithTransition("/contact")}
          />
          <ThemeToggle />
        </div>
      </div>

      {/* Spacer dinamico: applica il push SOLO se NON siamo in Home */}
      {!isHome && (
        <div
          aria-hidden="true"
          style={{
            height: `calc(${barH}px + ${EXTRA_PAD_PX}px + env(safe-area-inset-top, 0px))`,
          }}
        />
      )}
    </>
  );
}