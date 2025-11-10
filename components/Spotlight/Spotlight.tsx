// components/Spotlight/Spotlight.tsx
"use client";

import { useRef, useEffect } from "react";
import SplitType from "split-type";
import { useGsapRegister } from "@/lib/gsap";

export default function Spotlight() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { gsap, ScrollTrigger } = useGsapRegister();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Split headings into chars una sola volta (solo sulle h1 dentro .marquee-text)
    const headings = root.querySelectorAll<HTMLElement>(".marquee-text h1");
    if (headings.length) new SplitType(headings, { types: "chars" });

    const rows = Array.from(root.querySelectorAll<HTMLElement>(".js-row"));
    const kills: Array<() => void> = [];

    rows.forEach((row, i) => {
      const marquee = row.querySelector<HTMLElement>(".js-marquee");
      if (!marquee) return;

      // Calcolo uno shift massimo in pixel, proporzionale alla larghezza del row,
      // e lo "clampo" a 56px–120px circa per evitare di uscire dal viewport.
      const computeShift = () => {
        const w = row.getBoundingClientRect().width;
        const pct = i % 2 === 0 ? 0.06 : -0.06; // ~6% in una direzione o nell’altra
        const px = w * pct;
        const clamped = Math.max(-120, Math.min(120, px));
        return clamped;
      };

      let shift = computeShift();

      // Drift orizzontale, sempre confinato nel container (grazie alla mask e overflow-hidden)
      const tween = gsap.to(marquee, {
        x: shift,
        ease: "none",
        scrollTrigger: {
          trigger: row,
          start: "top bottom",
          end: "150% top",
          scrub: true,
        },
        force3D: true,
      });
      kills.push(() => tween.scrollTrigger?.kill());

      // Weight sweep sui singoli char della headline
      const chars = row.querySelectorAll<HTMLElement>(".char");
      if (chars.length) {
        const t2 = gsap.fromTo(
          chars,
          { fontVariationSettings: "'wght' 200" },
          {
            duration: 1,
            ease: "none",
            fontVariationSettings: "'wght' 900",
            stagger: { each: 0.35, from: i % 2 === 0 ? "end" : "start" },
            scrollTrigger: {
              trigger: row,
              start: "50% bottom",
              end: "top top",
              scrub: true,
            },
          }
        );
        kills.push(() => t2.scrollTrigger?.kill());
      }

      // Recalcola shift al resize per mantenerlo entro viewport
      const onResize = () => {
        shift = computeShift();
        gsap.set(marquee, { x: shift });
        tween.scrollTrigger?.refresh();
      };
      window.addEventListener("resize", onResize);
      kills.push(() => window.removeEventListener("resize", onResize));
    });

    ScrollTrigger.refresh();
    return () => kills.forEach((k) => k());
  }, [gsap, ScrollTrigger]);

  return (
    <section
      ref={rootRef}
      className="
        relative overflow-hidden
        bg-zinc-50 text-zinc-900
        dark:bg-black dark:text-white
        py-20 sm:py-28 md:py-36
      "
    >
      <div
        className="
          mx-auto w-full max-w-[1800px]
          px-4 sm:px-6 md:px-8
          flex flex-col gap-6 sm:gap-8 md:gap-10
        "
      >
        {/* Row 1 */}
        <div
          className="
            js-row relative w-full overflow-hidden
            [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]
          "
        >
          <div
            className="
              js-marquee absolute left-0 top-1/2 flex w-full -translate-y-1/2 gap-3 sm:gap-4
            "
          >
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/portfolio/iniesta-academy-1.png" className="h-[clamp(140px,22vw,260px)] w-full object-cover" alt="" />
            </div>
            <div className="marquee-text flex-1 grid place-items-center rounded-xl bg-transparent">
              <h1 className="font-sans text-[clamp(28px,6vw,56px)] font-black uppercase tracking-[-0.02em] sm:tracking-[-0.03em]">
                Frontend
              </h1>
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/assets/img2.jpg" className="h-[clamp(140px,22vw,260px)] w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/assets/img3.jpg" className="h-[clamp(140px,22vw,260px)] w-full object-cover" alt="" />
            </div>
          </div>
          {/* spacer per dare altezza alla riga */}
          <div className="h-[clamp(140px,22vw,260px)]" />
        </div>

        {/* Row 2 */}
        <div
          className="
            js-row relative w-full overflow-hidden
            [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]
          "
        >
          <div className="js-marquee absolute left-0 top-1/2 flex w-full -translate-y-1/2 gap-3 sm:gap-4">
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/portfolio/iniesta-academy-2.png" className="h-[clamp(120px,18vw,220px)] w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/assets/img5.jpg" className="h-[clamp(120px,18vw,220px)] w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/portfolio/mikakus-2.png" className="h-[clamp(120px,18vw,220px)] w-full object-cover" alt="" />
            </div>
            <div className="marquee-text flex-1 grid place-items-center rounded-xl bg-transparent">
              <h1 className="font-sans text-[clamp(26px,5.5vw,52px)] font-black uppercase tracking-[-0.02em] sm:tracking-[-0.03em]">
                Developer
              </h1>
            </div>
          </div>
          <div className="h-[clamp(120px,18vw,220px)]" />
        </div>

        {/* Row 3 */}
        <div
          className="
            js-row relative w-full overflow-hidden
            [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]
          "
        >
          <div className="js-marquee absolute left-0 top-1/2 flex w-full -translate-y-1/2 gap-3 sm:gap-4">
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/img-4.jpg" className="h-[clamp(140px,22vw,260px)] w-full object-cover" alt="" />
            </div>
            <div className="marquee-text flex-1 grid place-items-center rounded-xl bg-transparent">
              <h1 className="font-sans text-[clamp(28px,6vw,56px)] font-black uppercase tracking-[-0.02em] sm:tracking-[-0.03em]">
                Barcelona
              </h1>
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/img-1.jpg" className="h-[clamp(140px,22vw,260px)] w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/img-5.jpg" className="h-[clamp(140px,22vw,260px)] w-full object-cover" alt="" />
            </div>
          </div>
          <div className="h-[clamp(140px,22vw,260px)]" />
        </div>

        {/* Row 4 */}
        <div
          className="
            js-row relative w-full overflow-hidden
            [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]
          "
        >
          <div className="js-marquee absolute left-0 top-1/2 flex w-full -translate-y-1/2 gap-3 sm:gap-4">
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/portfolio/jobboard-1.png" className="h-[clamp(120px,18vw,220px)] w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/portfolio/tropify-4.png" className="h-[clamp(120px,18vw,220px)] w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/portfolio/petfinder-4.png" className="h-[clamp(120px,18vw,220px)] w-full object-cover" alt="" />
            </div>
            <div className="marquee-text flex-1 grid place-items-center rounded-xl bg-transparent">
              <h1 className="font-sans text-[clamp(26px,5.5vw,52px)] font-black uppercase tracking-[-0.02em] sm:tracking-[-0.03em]">
                Based
              </h1>
            </div>
          </div>
          <div className="h-[clamp(120px,18vw,220px)]" />
        </div>
      </div>
    </section>
  );
}