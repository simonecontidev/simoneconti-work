"use client";

import { useEffect, useRef } from "react";
import { RiLinkedinBoxLine, RiGithubLine, RiCodepenLine } from "react-icons/ri";
import Copy from "../../components/Copy/Copy";
import VTLink from "../../components/ui/VTLink";

type FooterProps = { className?: string };

export default function Footer({ className = "" }: FooterProps) {
  const iconsRef = useRef<HTMLDivElement | null>(null);

  // Micro-animazione icone quando il footer entra in viewport
  useEffect(() => {
    const root = iconsRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(".js-icon"));
    items.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity .45s ease, transform .45s ease";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            items.forEach((el, i) => {
              el.style.transitionDelay = `${i * 60}ms`;
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            });
          }
        });
      },
      { root: null, threshold: 0.2 }
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    // ⬇️ Footer NEL FLOW (non copre nulla)
    <footer
      aria-label="Site footer"
      className={`
        relative z-[10] w-full
        bg-[var(--bg)] text-[var(--fg)]
        ${className}
      `}
    >
      {/* ⬇️ Contenuto sticky: si 'scopre' elegante dal basso senza coprire il main */}
      <div className="sticky bottom-0">
        {/* Edge-fade morbido sul bordo superiore */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-6"
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            opacity: 0.7,
          }}
        />

        {/* Card principale */}
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div
            className="
              rounded-3xl border p-8 md:p-12 backdrop-blur
              border-zinc-900/10 bg-white/60
              dark:border-white/10 dark:bg-white/5
              transition-colors
              shadow-xl shadow-black/5 dark:shadow-black/20
            "
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
            }}
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
            <div className="my-[40px] flex flex-col gap-2 text-sm md:flex-row md:gap-6 text-[var(--fg)]">
              <p className="flex-1 text-[var(--fg)]">
                Developed by — <span className="text-[var(--fg)]">Simone Conti</span>
              </p>
              <p className="flex-1 text-center md:text-left">
                This website uses cookies.
              </p>
              <p className="flex-1 text-right">
                All rights reserved © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}