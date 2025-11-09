// app/about/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Copy from "../../../components/Copy/Copy";
import Spotlight from "../../../components/Spotlight/Spotlight";
import CTACard from "../../../components/CTACard/CTACard";
import { useGsapRegister } from "../../../src/lib/gsap";
import SplitType from "split-type";
import { cvItems } from "./cvItems";
import styles from "./About.module.css";

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
  const headerRef = useRef<HTMLDivElement | null>(null);
  const h1aRef = useRef<HTMLHeadingElement | null>(null);
  const h1bRef = useRef<HTMLHeadingElement | null>(null);
  const portraitWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger?.refresh(true));
    const onLoad = () => ScrollTrigger?.refresh(true);
    window.addEventListener("load", onLoad, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("load", onLoad);
    };
  }, [ScrollTrigger]);

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

    if (aboutCopyRef.current) {
      applySplit(aboutCopyRef.current);
      const lines = aboutCopyRef.current.querySelectorAll<HTMLElement>(
        ".line-wrapper span, .line-wrapper .line"
      );
      gsap.set(lines, { y: 30 });
      gsap.to(lines, {
        y: 0,
        delay: 0.9,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.04,
      });
    }

    if (cvHeaderRef.current && cvListRef.current && cvWrapperRef.current) {
      applySplit(cvHeaderRef.current);
      applySplit(cvListRef.current);
      const hdr = cvHeaderRef.current.querySelectorAll<HTMLElement>(
        ".line-wrapper span, .line-wrapper .line"
      );
      const lst = cvListRef.current.querySelectorAll<HTMLElement>(
        ".line-wrapper span, .line-wrapper .line"
      );
      gsap.set([hdr, lst], { y: 70 });
      ScrollTrigger.create({
        trigger: cvWrapperRef.current,
        start: "top 55%",
        once: true,
        onEnter: () => {
          gsap.to(hdr, { y: 0, duration: 1.1, ease: "power4.out", stagger: 0.04 });
          gsap.to(lst, { y: 0, duration: 1.1, ease: "power4.out", stagger: 0.02 });
        },
      });
    }

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

  // motion tilt + parallax
  useEffect(() => {
    if (!containerRef.current) return;
    const elA = h1aRef.current;
    const elB = h1bRef.current;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.gsap;
      gsap.registerPlugin(ScrollTrigger);

      const setupTitle = (el: HTMLElement | null, delay = 0) => {
        if (!el) return;
        // niente spazio dopo la virgola
        const split = new SplitType(el, { types: "lines,words" });
        (el as any).split = split;
        const lines = split.lines as HTMLElement[];
        gsap.set(lines, { yPercent: 100, opacity: 0, skewY: 8, transformOrigin: "left bottom" });
        gsap.to(lines, {
          yPercent: 0,
          opacity: 1,
          skewY: 0,
          ease: "power4.out",
          duration: 1.1,
          stagger: 0.06,
          delay,
        });
        gsap.fromTo(
          el,
          { "--shineX": "-30%" } as any,
          { "--shineX": "130%", ease: "power2.out", duration: 1.8, delay: delay + 0.3 }
        );
      };
      setupTitle(elA, 0.1);
      setupTitle(elB, 0.2);

      if (portraitWrapRef.current && portraitRef.current) {
        const wrap = portraitWrapRef.current;
        const card = portraitRef.current;

        gsap.fromTo(
          wrap,
          { y: 40 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        const tiltMax = Number(wrap.dataset.tilt ?? 8);
        const moveMax = Number(wrap.dataset.translate ?? 14);
        const onMove = (e: MouseEvent) => {
          const rect = wrap.getBoundingClientRect();
          const rx = (e.clientX - rect.left) / rect.width;
          const ry = (e.clientY - rect.top) / rect.height;
          const rotY = (rx - 0.5) * (tiltMax * 2);
          const rotX = -(ry - 0.5) * (tiltMax * 1.2);
          const tx = (rx - 0.5) * (moveMax * 2);
          const ty = (ry - 0.5) * (moveMax * 2);
          gsap.to(card, {
            rotateX: rotX,
            rotateY: rotY,
            x: tx,
            y: ty,
            duration: 0.6,
            ease: "power3.out",
            transformPerspective: 800,
            transformStyle: "preserve-3d",
          });
        };
        // ✅ non ritorna il Tween
        const onLeave = () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.8, ease: "power3.out" });
        };

        wrap.addEventListener("mousemove", onMove);
        wrap.addEventListener("mouseleave", onLeave);
        ScrollTrigger.addEventListener("refreshInit", onLeave);

        return () => {
          wrap.removeEventListener("mousemove", onMove);
          wrap.removeEventListener("mouseleave", onLeave);
          ScrollTrigger.removeEventListener("refreshInit", onLeave);
        };
      }
    })();

    if (aboutCopyRef.current) {
      (async () => {
        const gsapMod = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const gsap = gsapMod.gsap;
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
          aboutCopyRef.current,
          { y: 20 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: aboutCopyRef.current!,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      })();
    }
  }, [gsap, ScrollTrigger]);

  return (
    <div ref={containerRef} className={`${styles.root} bg-[var(--bg)] text-[var(--fg)]`}>
      {/* Header */}
      <section
        id="s-hero"
        data-title="Intro"
        ref={headerRef}
        className={`${styles.sectionPad} ${styles.jsSection} relative z-10`}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <Copy delay={0.8}>
            <h1 ref={h1aRef} className={`${styles.h1} ${styles.shine} text-right`}>
              Hi
            </h1>
          </Copy>
          <Copy delay={0.95}>
            <h1 ref={h1bRef} className={`${styles.h1} ${styles.shine} text-right`}>
              Bridging code and emotion.
            </h1>
          </Copy>
        </div>
      </section>

      {/* Intro image + bio */}
      <section id="s-about" data-title="Bio" className={`${styles.sectionPad} ${styles.jsSection}`}>
        <div ref={portraitWrapRef} className={styles.parallaxWrap} data-tilt="8" data-translate="14">
          <div
            ref={portraitRef}
            className={`${styles.card} ${styles.cardGlow} mx-auto mb-12 w-1/3 overflow-hidden md:mb-16`}
          >
            <Image
              src="/about/portrait.jpg"
              alt="Portrait"
              width={1200}
              height={1600}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        <div ref={aboutCopyRef}>
          <h3 className={`${styles.muted} mx-auto mb-10 w-full text-left md:w-1/2 ${styles.h3}`}>
            Front-end engineer and visual designer from Italy, based in Barcelona. My work moves
            between art direction, code, and storytelling — combining aesthetic sensitivity with
            solid technical foundations.
          </h3>
          <h3 className={`${styles.muted} mx-auto w-full text-left md:w-1/2 ${styles.h3}`}>
            Over the past years I’ve collaborated with creative studios and brands across Europe,
            designing experiences that blend interaction, narrative, and rhythm.
          </h3>
        </div>
      </section>

      {/* Parallax hero image */}
      <section
        id="s-heroimg"
        data-title="Studio"
        ref={heroImgRef}
        className={`${styles.card} ${styles.jsSection} mx-auto my-24 overflow-hidden`}
      >
        <Image
          src="/about/portrait.jpg"
          alt="Studio"
          width={2400}
          height={1200}
          className="h-[60vh] w-full object-cover will-change-transform"
        />
      </section>

      {/* What I build */}
      <section id="s-what" data-title="What I build" className={`${styles.sectionPad} ${styles.jsSection}`}>
        <div>
          <h2 className={styles.h2}>What I build</h2>
          <div className="mt-6">
            <h3 className={`${styles.muted} mx-auto mb-6 w-full text-left md:w-1/2 ${styles.h3}`}>
              My focus lies in React, Next.js, TypeScript, and GSAP, often pairing motion with clarity and precision.
            </h3>
            <h3 className={`${styles.muted} mx-auto mb-6 w-full text-left md:w-1/2 ${styles.h3}`}>
              I enjoy shaping interfaces that feel fluid and intentional — from smooth scroll reveals to robust, scalable architectures.
            </h3>
            <h3 className={`${styles.muted} mx-auto w-full text-left md:w-1/2 ${styles.h3}`}>
              I believe every line of code can carry emotion when written with intention.
            </h3>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="s-philosophy" data-title="Philosophy" className={`${styles.sectionPad} ${styles.jsSection}`}>
        <div>
          <h2 className={styles.h2}>Philosophy</h2>
          <div className="mt-6">
            <h3 className={`${styles.muted} mx-auto mb-6 w-full text-left md:w-1/2 ${styles.h3}`}>
              I see the web as a living medium: part craft, part poetry, part system.
            </h3>
            <h3 className={`${styles.muted} mx-auto mb-6 w-full text-left md:w-1/2 ${styles.h3}`}>
              My process starts with curiosity — understanding the story behind a brand or idea, then turning it into movement, structure, and flow.
            </h3>
            <h3 className={`${styles.muted} mx-auto w-full text-left md:w-1/2 ${styles.h3}`}>
              Design, for me, isn’t just how things look. It’s how they breathe.
            </h3>
          </div>
        </div>
      </section>

      {/* Beyond code */}
      <section id="s-beyond" data-title="Beyond" className={`${styles.sectionPad} ${styles.jsSection}`}>
        <div>
          <h2 className={styles.h2}>Beyond code</h2>
          <div className="mt-6">
            <h3 className={`${styles.muted} mx-auto mb-6 w-full text-left md:w-1/2 ${styles.h3}`}>
              Outside development, I’m also a painter and creative director, exploring the relationship between nature, emotion, and memory through color and composition.
            </h3>
            <h3 className={`${styles.muted} mx-auto w-full text-left md:w-1/2 ${styles.h3}`}>
              That duality — between the organic and the digital — defines how I approach every project.
            </h3>
          </div>
        </div>
      </section>

      {/* CV */}
      <section id="s-cv" data-title="CV" ref={cvWrapperRef} className={`${styles.sectionPad} ${styles.jsSection} mx-auto`}>
        <div ref={cvHeaderRef} className="mb-6">
          <h2 className={styles.h2}>CV</h2>
        </div>

        <div ref={cvListRef} className={styles.cvList}>
          {cvItems.map((item, i) => (
            <div key={i} className={styles.cvRow}>
              <div className="flex-1">
                <h3 className={styles.h3}>{item.name}</h3>
              </div>
              <div className={`${styles.muted} w-36 text-right md:w-40`}>
                <h3 className={styles.h4}>{item.year}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Spotlight />
      <CTACard />

      {/* Safe override per evitare flash sul primo titolo */}
      <style jsx global>{`
        #s-hero .line-wrapper,
        #s-hero .line-wrapper .line,
        #s-hero h1 {
          opacity: 1 !important;
          transform: none !important;
        }
      `}</style>
    </div>
  );
}