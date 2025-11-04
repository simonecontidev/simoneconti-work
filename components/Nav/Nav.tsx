"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MenuBtn from "../../components/MenuBtn/MenuBtn";
import useViewTransition from "../../hooks/useViewTransition";
import { useGsapRegister } from "../../src/lib/gsap";
import SlidingTextLink from "../../components/animations/SlidingTextLink";
type LinkItem = { href: string; label: string };

const LINKS: LinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null); 
  
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { navigateWithTransition } = useViewTransition();
  const { gsap } = useGsapRegister();

  // pointer: coarse? (touch)
  const isCoarse = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false),
    []
  ); // <-- NEW

  // lock/unlock scroll
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // animate open/close with clip-path + items reveal
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const items = Array.from(menu.querySelectorAll<HTMLElement>("[data-nav-item]"));

    if (isOpen) {
      setIsAnimating(true);
      gsap.set(menu, { pointerEvents: "auto" });
      gsap.fromTo(
        menu,
        { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(100% at 50% 50%)", ease: "power3.out", duration: 1.0 }
      );
      gsap.fromTo(
        items,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.06,
          delay: 0.25,
          onComplete: () => setIsAnimating(false),
        }
      );
    } else {
      setIsAnimating(true);
      gsap.to(items, {
        yPercent: -120,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in",
        stagger: 0.04,
      });
      gsap.to(menu, {
        clipPath: "circle(0% at 50% 50%)",
        ease: "power3.in",
        duration: 0.8,
        delay: 0.2,
        onStart: () => gsap.set(menu, { pointerEvents: "none" }),
        onComplete: () => setIsAnimating(false),
      });
    }
  }, [isOpen, gsap]);

  const toggleMenu = useCallback(() => {
    if (isAnimating) return;
    setIsOpen((v) => !v);
  }, [isAnimating]);

  // accetta anche l'indice (per eventuale doppio tap mobile se lo vorrai)
  const handleLink = useCallback(
    (href: string, _idx?: number) => {
      if (typeof window !== "undefined" && window.location.pathname === href) {
        setIsOpen(false);
        return;
      }
      setIsOpen(false);
      navigateWithTransition(href);
    },
    [navigateWithTransition]
  );

  return (
    <>
      {/* Floating Toggle */}
      <MenuBtn isOpen={isOpen} toggleMenu={toggleMenu} />

      {/* Fullscreen Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[100] clip-path-circle-0 bg-neutral-800/95 p-4 md:p-6 pointer-events-none"
      >
        <div className="relative grid h-full w-full grid-rows-[1fr_auto] rounded-3xl border border-white/10 bg-neutral-900 p-6 md:p-10">
          {/* Links col */}
          <div className="flex flex-col justify-center gap-4 md:gap-6">
  {LINKS.map((l) => (
    <SlidingTextLink
      key={l.href}
      text={l.label}
      href={l.href}
      primaryColor="#8EB8AF"   
      underline={true}
      className="text-left text-4xl font-semibold leading-tight text-white md:text-6xl"
    />
  ))}
</div>

          {/* Meta col */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="text-white">
              <p className="text-sm/6 text-white/50">Contact</p>
              <p className="text-base">hello@simoneconti.work</p>
              <p className="text-base">Barcelona · Remote</p>
            </div>
            <div className="text-white">
              <p className="text-sm/6 text-white/50">Social</p>
              <p className="text-base">LinkedIn · GitHub · CodePen</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}