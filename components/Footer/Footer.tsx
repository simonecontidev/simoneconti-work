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
        bg-[var(--bg)] text-[var(--fg)]
        transition-colors
      "
    >
      {/* Meta */}
      <div
        className="
          rounded-3xl border p-8 md:p-12 backdrop-blur
          border-zinc-900/10 bg-white/60
          dark:border-white/10 dark:bg-white/5
          transition-colors
        "
      >
        {/* Header row */}
        <div className="mb-10 grid gap-8 md:mb-16 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Copy delay={0.1}>
              <h2 className="text-base font-medium text-[var(--fg)]">
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
                    text-[var(--fg)]
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
            {[
              { href: "https://linkedin.com/in/tuo-prof", Icon: RiLinkedinBoxLine, label: "LinkedIn" },
              { href: "https://github.com/tuo-username", Icon: RiGithubLine, label: "GitHub" },
              { href: "https://codepen.io/tuo-username", Icon: RiCodepenLine, label: "CodePen" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="
                  js-icon grid h-10 w-10 place-items-center rounded-full
                  border ring-0 transition-colors
                  text-current
                  border-zinc-900/10 bg-white/80 hover:bg-white
                  dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20
                "
              >
                <Icon className="text-xl" />
              </a>
            ))}
          </div>

          <div className="md:text-right">
            <Copy delay={0.1}>
              <p className="text-[var(--fg)] md:ml-auto md:w-3/4">
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
          border-zinc-900/10 bg-white/60 text-zinc-700
          dark:border-white/10 dark:bg-white/5 dark:text-white/80
          transition-colors
        "
      >
        <div className="my-[140px] flex flex-col gap-2 text-sm md:flex-row md:gap-6 text-[var(--fg)]">
          <p className="flex-1 text-[var(--fg)]">
            Developed by — <span className="text-[var(--fg)]">Simone Conti</span>
          </p>
          <p className="flex-1 text-center md:text-left">This website uses cookies.</p>
          <p className="flex-1 text-right">
            All rights reserved © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}