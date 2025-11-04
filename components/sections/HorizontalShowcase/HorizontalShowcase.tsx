"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/lib/useGsap";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

export type ShowcaseSlide = {
  id: string;
  title: string;
  subtitle?: string;
  image: { src: string; alt: string; width?: number; height?: number };
};

export type HorizontalShowcaseProps = {
  slides: ShowcaseSlide[];
  className?: string;
  /** altezza “pista” in viewport height */
  trackVh?: number; // default 120
  /** spazio tra card */
  gapRem?: number;  // default 2
};

export default function HorizontalShowcase({
  slides,
  className,
  trackVh = 120,
  gapRem = 2,
}: HorizontalShowcaseProps) {
  const { ref, withContext } = useGsapContext<HTMLDivElement>();
  const count = useMemo(() => slides.length, [slides]);

  useEffect(() => {
    return withContext(() => {
      const root = ref.current!;
      const track = root.querySelector<HTMLElement>(".hs-track")!;
      const cards = gsap.utils.toArray<HTMLElement>(".hs-card");

      // larghezza totale scroller (in base alle card)
      const totalWidth = cards.reduce((acc, el) => acc + el.offsetWidth, 0) + (cards.length - 1) * gapRem * 16;

      // timeline orizzontale
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${totalWidth}`, // durata proporzionale alla larghezza
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onRefresh: () => {
            // for Lenis: assicurati che il layout sia pronto prima di calcolare
          },
        },
      });

      tl.to(track, { x: () => -(totalWidth - root.offsetWidth) });

      // effetti base per le card quando entrano in viewport
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>(".hs-media");
        const txt = card.querySelector<HTMLElement>(".hs-text");

        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.05, opacity: 0.001, y: 20 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: card,
                start: "left center",
                end: "right center",
                scrub: true,
                horizontal: true,
                containerAnimation: tl, // collega a timeline orizzontale
              },
            },
          );
        }

        if (txt) {
          gsap.fromTo(
            txt,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: card,
                start: "left center",
                end: "left center+=20%",
                scrub: true,
                horizontal: true,
                containerAnimation: tl,
              },
            },
          );
        }
      });

      // refresh dopo immagini/caricamenti
      const r1 = () => ScrollTrigger.refresh();
      window.addEventListener("load", r1);
      setTimeout(r1, 100); // piccolo guard-rail

      return () => {
        window.removeEventListener("load", r1);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, trackVh, gapRem]);

  return (
    <section
      ref={ref}
      className={clsx(
        "hs-root relative w-full overflow-hidden bg-neutral-950 text-neutral-50",
        className,
      )}
      style={{ height: `${trackVh}vh` }}
      aria-label="Horizontal showcase"
    >
      {/* TRACK: scorre orizzontale dentro la sezione pinnata */}
      <div className="hs-track absolute left-0 top-0 h-full will-change-transform flex"
           style={{ gap: `${gapRem}rem` }}>
        {slides.map((s) => (
          <article
            key={s.id}
            className="hs-card relative h-[80vh] md:h-[85vh] aspect-[4/3] md:aspect-[16/10] flex-shrink-0 rounded-3xl overflow-hidden bg-neutral-900"
            aria-label={s.title}
          >
            <div className="hs-media relative w-full h-full">
              <Image
                src={s.image.src}
                alt={s.image.alt}
                fill
                sizes="(max-width: 768px) 90vw, 70vw"
                className="object-cover"
                priority={true}
              />
            </div>

            <header className="hs-text pointer-events-none absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-xl md:text-3xl font-semibold tracking-tight">{s.title}</h3>
              {s.subtitle && (
                <p className="mt-2 text-sm md:text-base text-neutral-300">{s.subtitle}</p>
              )}
            </header>
          </article>
        ))}
      </div>
    </section>
  );
}