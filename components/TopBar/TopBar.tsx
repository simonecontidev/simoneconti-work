"use client";

import { useEffect, useRef } from "react";
import useViewTransition from "../../hooks/useViewTransition";
import AnimatedButton from "../../components/ui/AnimatedButton";
import { useGsapRegister } from "@/lib/gsap";

export default function TopBar() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const { navigateWithTransition } = useViewTransition();
  const { gsap, ScrollTrigger } = useGsapRegister();

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

  // Ensure reset on mount/update
  useEffect(() => {
    if (barRef.current) gsap.set(barRef.current, { y: 0 });
  }, [gsap]);

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur md:px-8"
    >
      {/* Logo */}
      <button
        aria-label="Go to Home"
        onClick={() => navigateWithTransition("/")}
        className="inline-flex items-center justify-center"
      >
        {/* usa la tua immagine; fallback a un dot */}
        {/* <Image src="/logos/terrene-logo-symbol.png" alt="Logo" width={32} height={32} /> */}
        <h1>Simone Conti</h1>
      </button>

      {/* CTA */}
      <AnimatedButton
        label="Contact me"
        route="/contact"
        onClick={() => navigateWithTransition("/contact")}
      />
    </div>
  );
}