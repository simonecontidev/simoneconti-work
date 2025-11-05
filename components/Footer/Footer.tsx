// components/Footer/Footer.tsx
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

    const icons = Array.from(root.querySelectorAll<HTMLElement>(".js-icon"));
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
    <footer
      className="
        w-full px-4 py-8 sm:px-6 lg:px-8
        bg-zinc-50 text-zinc-900
        dark:bg-black dark:text-white
      "
    >
      {/* Meta */}
      <div
        className="
          rounded-3xl border p-8 md:p-12
          border-zinc-900/10 bg-white/60 backdrop-blur
          dark:border-white/10 dark:bg-white/5
        "
      >
        {/* Header row */}
        <div className="mb-10 grid gap-8 md:mb-16 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Copy delay={0.1}>
              <h2 className="text-base font-medium text-zinc-800 dark:text-white/90">
                Simone Conti
              </h2>
            </Copy>
            <Copy delay={0.2}>
              <h3 className="text-2xl md:text-3xl font-semibold">
                Blending art direction, design, and front-end craft to build experiences that feel alive.
              </h3>
            </Copy>
          </div>

          <div className="flex flex-col items-end text-right">
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
                  className="
                    text-base underline-offset-4 hover:underline
                    text-zinc-900 dark:text-white
                  "
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
            <a
              href="https://linkedin.com/in/tuo-prof"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
              className="
                js-icon grid h-10 w-10 place-items-center rounded-full
                border ring-0 transition
                border-zinc-900/10 bg-white/80 hover:bg-white
                dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20
              "
            >
              <RiLinkedinBoxLine className="text-xl" />
            </a>
            <a
              href="https://github.com/tuo-username"
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
              className="
                js-icon grid h-10 w-10 place-items-center rounded-full
                border ring-0 transition
                border-zinc-900/10 bg-white/80 hover:bg-white
                dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20
              "
            >
              <RiGithubLine className="text-xl" />
            </a>
            <a
              href="https://codepen.io/tuo-username"
              aria-label="CodePen"
              target="_blank"
              rel="noreferrer"
              className="
                js-icon grid h-10 w-10 place-items-center rounded-full
                border ring-0 transition
                border-zinc-900/10 bg-white/80 hover:bg-white
                dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20
              "
            >
              <RiCodepenLine className="text-xl" />
            </a>
          </div>

          <div className="md:text-right">
            <Copy delay={0.1}>
              <p className="text-zinc-700 dark:text-white/70 md:ml-auto md:w-3/4">
                Focused on React, Next.js, GSAP, and clean UI systems — crafting web products that move and perform.
              </p>
            </Copy>
          </div>
        </div>
      </div>

      {/* Outro */}
      <div
        className="
          mt-6 flex flex-col gap-3 overflow-hidden rounded-3xl border p-6
          text-zinc-700 dark:text-white/80
          border-zinc-900/10 bg-white/60
          dark:border-white/10 dark:bg-white/5
        "
      >
        <div className="flex flex-col gap-2 text-sm md:flex-row md:gap-6 my-[140px]">
          <p className="flex-1">
            Developed by — <span className="text-zinc-900 dark:text-white">Simone Conti</span>
          </p>
          <p className="flex-1 text-center md:text-left">This website uses cookies.</p>
          <p className="flex-1 text-right md:text-right">
            All rights reserved © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}