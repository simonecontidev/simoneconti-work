"use client";

import { useEffect, useRef } from "react";
import { RiLinkedinBoxLine, RiGithubLine, RiCodepenLine } from "react-icons/ri";
import useViewTransition from "../../hooks/useViewTransition";
import Copy from "../../components/Copy/Copy";
import { useGsapRegister } from "@/lib/gsap";
import VTLink from "../../components/ui/VTLink";


export default function Footer() {
  const { navigateWithTransition } = useViewTransition();
  const iconsRef = useRef<HTMLDivElement | null>(null);
  const { gsap, ScrollTrigger } = useGsapRegister();

  useEffect(() => {
    const root = iconsRef.current;
    if (!root) return;

    const icons = Array.from(root.querySelectorAll<HTMLElement>(".icon"));
    gsap.set(icons, { opacity: 0, x: -40 });

    const anim = gsap.to(icons, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      stagger: -0.1,
      ease: "power3.out",
      paused: true,
    });

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 90%",
      once: true,
      onEnter: () => anim.play(),
    });

    return () => {
      st.kill();
      anim.kill();
    };
  }, [gsap, ScrollTrigger]);

  return (
    <footer className="w-full px-4 py-6 sm:px-6 lg:px-8">
      {/* Meta */}
      <div className="rounded-3xl border border-white/10 p-8 md:p-12">
        {/* Header row */}
        <div className="mb-10 grid gap-8 md:mb-16 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Copy delay={0.1}>
              <h2 className="text-base font-medium text-white/90">Simone Conti</h2>
            </Copy>
            <Copy delay={0.2}>
              <h3 className="text-2xl md:text-3xl font-semibold text-white">
                Blending art direction, design, and front-end craft to build experiences that feel alive.
              </h3>
            </Copy>
          </div>

          <div className="flex flex-col items-end text-right md:items-end md:text-right">
  <nav className="flex flex-col gap-2">
    {[
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/contact", label: "Contact" },
    ].map((l) => (
      <VTLink
        key={l.href}
        href={l.href}
        className="text-base hover:underline underline-offset-4"
      >
        {l.label}
      </VTLink>
    ))}
  </nav>
</div>
        </div>

        {/* Socials row */}
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div ref={iconsRef} className="flex gap-2">
            <a href="https://linkedin.com/in/tuo-prof" className="icon">
    <RiLinkedinBoxLine className="text-xl" />
  </a>
  <a href="https://github.com/tuo-username" className="icon">
    <RiGithubLine className="text-xl" />
  </a>
  <a href="https://codepen.io/tuo-username" className="icon">
    <RiCodepenLine className="text-xl" />
  </a>
          </div>

          <div className="md:text-right">
            <Copy delay={0.1}>
              <p className="text-white/70 md:ml-auto md:w-3/4">
                Focused on React, Next.js, GSAP, and clean UI systems — crafting web products that move and perform.

              </p>
            </Copy>
          </div>
        </div>
      </div>

      {/* Outro */}
      <div className="mt-6 flex flex-col gap-3 overflow-hidden rounded-3xl border border-white/10 p-6 text-white/80">
        
        <div className="flex flex-col gap-2 text-sm md:flex-row md:gap-6">
          <p className="flex-1">
            Developed by — <span className="text-white">Simone Conti</span>
          </p>
          <p className="flex-1 text-center md:text-left">This website uses cookies.</p>
          <p className="flex-1 text-right md:text-right">All rights reserved © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}