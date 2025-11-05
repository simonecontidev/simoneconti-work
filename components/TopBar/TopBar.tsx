"use client";

import { useEffect, useRef } from "react";
import useViewTransition from "../../hooks/useViewTransition";
import AnimatedButton from "../../components/ui/AnimatedButton";
import { useGsapRegister } from "@/lib/gsap";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

export default function TopBar() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const { navigateWithTransition } = useViewTransition();
  const { gsap } = useGsapRegister();

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

  // Reset posizione topbar su mount/update
  useEffect(() => {
    if (barRef.current) gsap.set(barRef.current, { y: 0 });
  }, [gsap]);

  return (
    <div
      ref={barRef}
      className="
        fixed inset-x-0 top-0 z-50
        flex items-center justify-between
        px-6 py-3 md:px-8
        backdrop-blur-sm bg-transparent
        transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
        pointer-events-auto
      "
      style={{
        // Aiuta il mix-blend-mode a calcolare correttamente
        isolation: "isolate",
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
            text-2xl font-semibold tracking-tight uppercase
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
  );
}