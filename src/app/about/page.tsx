"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Copy from "../../../components/Copy/Copy";
import Spotlight from "../../../components/Spotlight/Spotlight";
import CTACard from "../../../components/CTACard/CTACard";
import { useGsapRegister } from "../../../src/lib/gsap";
import SplitType from "split-type";
import { cvItems } from "./cvItems";

export default function AboutPage() {
  const { gsap, ScrollTrigger } = useGsapRegister();

  // refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const aboutCopyRef = useRef<HTMLDivElement | null>(null);
  const heroImgRef = useRef<HTMLDivElement | null>(null);
  const cvWrapperRef = useRef<HTMLDivElement | null>(null);
  const cvHeaderRef = useRef<HTMLDivElement | null>(null);
  const cvListRef = useRef<HTMLDivElement | null>(null);

  // ensure ST refresh on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger?.refresh(true));
    const onLoad = () => ScrollTrigger?.refresh(true);
    window.addEventListener("load", onLoad, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("load", onLoad);
    };
  }, [ScrollTrigger]);

  // animations: portrait clip, line reveals, CV, hero parallax
  useEffect(() => {
    if (!containerRef.current) return;

    const applySplit = (root: HTMLElement) => {
      const targets = root.querySelectorAll<HTMLElement>("h1, h2, h3");
      targets.forEach((el) => {
        const split = new SplitType(el, { types: "lines" });
        (split.lines as HTMLElement[]).forEach((line) => {
          const wrap = document.createElement("div");
          wrap.className = "line-wrapper";
          line.parentElement?.insertBefore(wrap, line);
          wrap.appendChild(line);
        });
        (el as any).__split = split;
      });
    };

    // portrait reveal
    if (portraitRef.current) {
      gsap.set(portraitRef.current, {
        clipPath: "polygon(0% 100%,100% 100%,100% 100%,0% 100%)",
      });
      gsap.to(portraitRef.current, {
        clipPath: "polygon(0% 100%,100% 100%,100% 0%,0% 0%)",
        delay: 0.6,
        duration: 1,
        ease: "power4.out",
      });
    }

    // intro text line reveal
    if (aboutCopyRef.current) {
      applySplit(aboutCopyRef.current);
      const lines = aboutCopyRef.current.querySelectorAll<HTMLElement>(".line-wrapper span, .line-wrapper .line");
      gsap.set(lines, { y: 30 });
      gsap.to(lines, {
        y: 0,
        delay: 0.9,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.04,
      });
    }

    // CV section reveals
    if (cvHeaderRef.current && cvListRef.current && cvWrapperRef.current) {
      applySplit(cvHeaderRef.current);
      applySplit(cvListRef.current);
      const hdr = cvHeaderRef.current.querySelectorAll<HTMLElement>(".line-wrapper span, .line-wrapper .line");
      const lst = cvListRef.current.querySelectorAll<HTMLElement>(".line-wrapper span, .line-wrapper .line");
      gsap.set([hdr, lst], { y: 70 });
      ScrollTrigger.create({
        trigger: cvWrapperRef.current,
        start: "top 55%",
        onEnter: () => {
          gsap.to(hdr, { y: 0, duration: 1.1, ease: "power4.out", stagger: 0.04 });
          gsap.to(lst, { y: 0, duration: 1.1, ease: "power4.out", stagger: 0.02 });
        },
      });
    }

    // hero parallax scale
    if (heroImgRef.current) {
      const img = heroImgRef.current.querySelector("img");
      if (img) {
        ScrollTrigger.create({
          trigger: heroImgRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            gsap.to(img, { scale: 1 + self.progress * 0.5, duration: 0.1, ease: "none" });
          },
        });
      }
    }

    // cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      [aboutCopyRef, cvHeaderRef, cvListRef].forEach((r) => {
        const root = r?.current;
        if (!root) return;
        root.querySelectorAll<HTMLElement>("h1, h2, h3").forEach((el) => {
          const split = (el as any).__split as SplitType | undefined;
          split?.revert();
          root.querySelectorAll(".line-wrapper").forEach((wrap) => {
            const frag = document.createDocumentFragment();
            while (wrap.firstChild) frag.appendChild(wrap.firstChild);
            wrap.replaceWith(frag);
          });
        });
      });
    };
  }, [gsap, ScrollTrigger]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      {/* Header (kept from your version) */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-4 md:gap-6">
          <Copy delay={0.8}>
            <h1 className="text-right text-[10vw] leading-none font-semibold">
              Hi
            </h1>
          </Copy>
          <Copy delay={0.95}>
            <h1 className="text-right text-[10vw] leading-none font-semibold">
              Bridging code and emotion.
            </h1>
          </Copy>
        </div>
      </section>

      {/* Intro image + bio (now animated) */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-40">
        <div ref={portraitRef} className="mx-auto mb-12 w-1/3 overflow-hidden rounded-xl border border-white/10 bg-white/5 md:mb-16">
          <Image
            src="/about/portrait.jpg"
            alt="Portrait"
            width={1200}
            height={1600}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div ref={aboutCopyRef}>
          <h3 className="mx-auto mb-10 w-full text-left text-lg text-white/85 md:w-1/2 md:text-xl">
            Front-end developer and designer based in Barcelona. I build high-performance websites and interfaces using Next.js, React, GSAP, Tailwind, and TypeScript — with a focus on animation, storytelling, and refined UX.
          </h3>
          <h3 className="mx-auto w-full text-left text-lg text-white/85 md:w-1/2 md:text-xl">
            I collaborate with brands, artists, and studios to turn ideas into motion-driven products that are clean, fast, and accessible.
          </h3>
        </div>
      </section>

      {/* Parallax hero image */}
      <section ref={heroImgRef} className="mx-auto my-24 max-w-6xl overflow-hidden rounded-2xl border border-white/10">
        <Image
          src="/about/portrait.jpg"
          alt="Studio"
          width={2400}
          height={1200}
          className="h-[60vh] w-full object-cover will-change-transform"
        />
      </section>

      {/* CV */}
      <section ref={cvWrapperRef} className="mx-auto mb-32 max-w-5xl px-6">
        <div ref={cvHeaderRef} className="mb-6">
          <h2 className="text-2xl font-semibold md:text-3xl">CV</h2>
        </div>

        <div ref={cvListRef} className="divide-y divide-white/10">
          {cvItems.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4 py-4">
              <div className="flex-1">
                <h3 className="text-base md:text-lg">{item.name}</h3>
              </div>
              <div className="w-36 text-right text-white/60 md:w-40">
                <h3 className="text-sm">{item.year}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spotlight rows + CTA (kept) */}
      <Spotlight />
      <CTACard />
    </div>
  );
}