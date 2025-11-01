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

    const containers = Array.from(root.querySelectorAll<HTMLElement>("[data-marquee]"));

    const kills: Array<() => void> = [];

    // split headings into chars once
    new SplitType(root.querySelectorAll(".marquee-text h1"), { types: "chars" });

    containers.forEach((c, i) => {
      const marquee = c.querySelector<HTMLElement>(".marquee");
      if (!marquee) return;

      // horizontal drift
      const toX = i % 2 === 0 ? "10%" : "-15%";
      const tween = gsap.to(marquee, {
        x: toX,
        ease: "none",
        scrollTrigger: {
          trigger: c,
          start: "top bottom",
          end: "150% top",
          scrub: true,
        },
        force3D: true,
      });

      kills.push(() => tween.scrollTrigger?.kill());

      // weight sweep on chars
      const chars = c.querySelectorAll<HTMLElement>(".char");
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
              trigger: c,
              start: "50% bottom",
              end: "top top",
              scrub: true,
            },
          }
        );
        kills.push(() => t2.scrollTrigger?.kill());
      }
    });

    ScrollTrigger.refresh();

    return () => kills.forEach((k) => k());
  }, [gsap, ScrollTrigger]);

  return (
    <section ref={rootRef} className="bg-black py-24 md:py-40">
      <div className="mx-auto flex h-[140svh] max-w-none flex-col justify-center gap-4 md:h-[150svh]">
        {/* Row 1 */}
        <div data-marquee className="relative w-[125%] md:w-[125%] h-[220px] md:h-[250px]">
          <div className="marquee absolute left-0 top-1/2 flex h-full w-full -translate-y-1/2 gap-4">
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="marquee-text flex-1 grid place-items-center rounded-xl bg-transparent">
              <h1 className="font-sans text-5xl font-black uppercase tracking-[-0.04em] md:text-6xl">
                Frontend
              </h1>
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div data-marquee className="relative w-[125%] h-[180px] md:h-[220px]">
          <div className="marquee absolute left-0 top-1/2 flex h-full w-full -translate-y-1/2 gap-4">
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="marquee-text flex-1 grid place-items-center rounded-xl bg-transparent">
              <h1 className="font-sans text-5xl font-black uppercase tracking-[-0.04em] md:text-6xl">
                Developer
              </h1>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div data-marquee className="relative w-[125%] h-[220px] md:h-[250px]">
          <div className="marquee absolute left-0 top-1/2 flex h-full w-full -translate-y-1/2 gap-4">
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="marquee-text flex-1 grid place-items-center rounded-xl bg-transparent">
              <h1 className="font-sans text-5xl font-black uppercase tracking-[-0.04em] md:text-6xl">
                Barcelona
              </h1>
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
          </div>
        </div>

        {/* Row 4 */}
        <div data-marquee className="relative w-[125%] h-[180px] md:h-[220px]">
          <div className="marquee absolute left-0 top-1/2 flex h-full w-full -translate-y-1/2 gap-4">
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <img src="/about/portrait.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="marquee-text flex-1 grid place-items-center rounded-xl bg-transparent">
              <h1 className="font-sans text-5xl font-black uppercase tracking-[-0.04em] md:text-6xl">
                Based
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}