// src/components/sections/HorizontalShowcase/WonJYou.tsx
"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import s from "./HorizontalShowcase.module.css";

gsap.registerPlugin(ScrollTrigger, Flip);

export type HorizontalShowcaseProps = {
  images?: string[];
  slides?: { image: string; text: string }[];
  featuredIndex?: number;
};

const DEFAULT_IMAGES = [
  "/img-1.jpg","/img-2.jpg","/img-3.jpg","/img-4.jpg","/img-5.jpg","/img-6.jpg",
  "/img-7.jpg","/img-8.jpg","/img-9.jpg","/img-10.jpg","/img-11.jpg","/img-12.jpg","/img-13.jpg",
];

const DEFAULT_SLIDES = [
  {
    image: "/slide-1.jpg",
    text:
      "A landscape in constant transition, where every shape, sound, and shadow refuses to stay still. What seems stable begins to dissolve, and what fades returns again in a new form.",
  },
  {
    image: "/slide-2.jpg",
    text:
      "The rhythm of motion carries us forward into spaces that feel familiar yet remain undefined. Each shift is subtle, yet together they remind us that nothing we see is ever permanent.",
  },
];

export default function WonJYou(props: HorizontalShowcaseProps) {
  const IMAGES = props.images?.length ? props.images : DEFAULT_IMAGES;
  const SLIDES = props.slides?.length ? props.slides : DEFAULT_SLIDES;
  const pinIndex = Number.isInteger(props.featuredIndex) ? (props.featuredIndex as number) : 6;

  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLElement>(null);
  const marqueeImagesRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);

  const selectors = useMemo(() => {
    return {
      pinnedImg: `.${s.marqueeImg}.pin img`,
      slideTexts: `.${s.slideText}`, // tutti i testi orizzontali
    };
  }, []);

  useLayoutEffect(() => {
    const rootEl = rootRef.current!;
    const container = containerRef.current!;
    const marquee = marqueeRef.current!;
    const marqueeImages = marqueeImagesRef.current!;
    const horizontal = horizontalRef.current!;
    const horizontalWrapper = horizontalWrapperRef.current!;

    // 1) aspetta immagini
    const imgs = Array.from(rootEl.querySelectorAll("img")) as HTMLImageElement[];
    const ready = Promise.all(imgs.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))));

    // clone/flip
    let pinnedMarqueeImgClone: HTMLImageElement | null = null;
    let isImgCloneActive = false;
    let flipAnimation: gsap.core.Tween | null = null;

    function createPinnedMarqueeImgClone() {
      if (isImgCloneActive) return;
      const original = marquee.querySelector(selectors.pinnedImg) as HTMLImageElement | null;
      if (!original) return;

      const rect = original.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      pinnedMarqueeImgClone = original.cloneNode(true) as HTMLImageElement;

      gsap.set(pinnedMarqueeImgClone, {
        position: "fixed",
        left: centerX - original.offsetWidth / 2 + "px",
        top: centerY - original.offsetHeight / 2 + "px",
        width: original.offsetWidth + "px",
        height: original.offsetHeight + "px",
        transform: "rotate(-5deg)",
        transformOrigin: "center center",
        pointerEvents: "none",
        willChange: "transform",
        zIndex: 100,
      });

      document.body.appendChild(pinnedMarqueeImgClone);
      gsap.set(original, { opacity: 0 });
      isImgCloneActive = true;
    }

    function removePinnedMarqueeImgClone() {
      if (!isImgCloneActive) return;
      const original = marquee.querySelector(selectors.pinnedImg) as HTMLImageElement | null;
      if (pinnedMarqueeImgClone) {
        pinnedMarqueeImgClone.remove();
        pinnedMarqueeImgClone = null;
      }
      if (original) gsap.set(original, { opacity: 1 });
      isImgCloneActive = false;
    }

    let localTriggers: ScrollTrigger[] = [];
    let ro: ResizeObserver | null = null;

    ready.then(() => {
      // MARQUEE (x percentuale)
      const stMarquee = ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          // muoviamo da -80% a ~-55% (range 25%)
          const xPosition = -80 + self.progress * 25;
          gsap.set(marqueeImages, { x: `${xPosition}%` });
        },
      });
      localTriggers.push(stMarquee);

      // PIN ORIZZONTALE
      const stPin = ScrollTrigger.create({
        trigger: horizontal,
        start: "top top",
        end: () => `+=${window.innerHeight * 5}`,
        pin: true,
        anticipatePin: 1,
      });
      localTriggers.push(stPin);

      // CLONE ON ENTER/LEAVE
      const stClone = ScrollTrigger.create({
        trigger: marquee,
        start: "top top",
        onEnter: createPinnedMarqueeImgClone,
        onEnterBack: createPinnedMarqueeImgClone,
        onLeaveBack: removePinnedMarqueeImgClone,
      });
      localTriggers.push(stClone);

      // TESTI orizzontali: preparazione (nascosti all’inizio)
      const textEls = Array.from(rootEl.querySelectorAll<HTMLElement>(selectors.slideTexts));
      textEls.forEach((el) => el.classList.add(s.textHidden));

      // FLIP + wrapper + REVEAL TESTO
      const stFlip = ScrollTrigger.create({
        trigger: horizontal,
        start: "top 50%",
        end: () => `+=${window.innerHeight * 5.5}`,
        onEnter: () => {
          if (pinnedMarqueeImgClone && isImgCloneActive && !flipAnimation) {
            const state = Flip.getState(pinnedMarqueeImgClone);
            gsap.set(pinnedMarqueeImgClone, {
              position: "fixed",
              left: "0px",
              top: "0px",
              width: "100%",
              height: "100svh",
              transform: "rotate(0deg)",
              transformOrigin: "center center",
            });
            flipAnimation = Flip.from(state, {
              duration: 1,
              ease: "none",
              paused: true,
            });
          }
        },
        onLeaveBack: () => {
          if (flipAnimation) {
            flipAnimation.kill();
            flipAnimation = null;
          }
          gsap.set(container, { backgroundColor: "var(--light)" });
          gsap.set(horizontalWrapper, { x: "0%" });
          textEls.forEach((el) => {
            el.classList.remove(s.textVisible);
            el.classList.add(s.textHidden);
            el.style.opacity = "0";
          });
        },
        onUpdate: (self) => {
          const progress = self.progress;

          // bg light -> dark
          if (progress <= 0.05) {
            const bgp = Math.min(progress / 0.05, 1);
            const light = getComputedStyle(container).getPropertyValue("--light").trim();
            const dark = getComputedStyle(container).getPropertyValue("--dark").trim();
            const c = (p: number) => gsap.utils.interpolate(light, dark, Math.max(0, Math.min(1, p)));
            gsap.set(container, { backgroundColor: c(bgp) });
          } else {
            gsap.set(container, { backgroundColor: "var(--dark)" });
          }

          // FLIP 0 → 0.2
          if (progress <= 0.2) {
            const sp = progress / 0.2;
            if (flipAnimation) flipAnimation.progress(sp);
          }

          // SCROLL ORIZZONTALE + REVEAL TESTO (dopo 0.28)
          if (progress > 0.2 && progress <= 0.95) {
            if (flipAnimation) flipAnimation.progress(1);
            const hp = (progress - 0.2) / 0.75;
            const wrapperX = -66.67 * hp;
            gsap.set(horizontalWrapper, { x: `${wrapperX}%` });

            if (pinnedMarqueeImgClone) {
              const slideMovement = (66.67 / 100) * 3 * hp;
              gsap.set(pinnedMarqueeImgClone, { x: `${-slideMovement * 100}%` });
            }

            // Testo: inizia a svelarsi solo quando l'immagine è "full"
            const startReveal = 0.28;
            const endReveal = 0.38;
            if (progress < startReveal) {
              textEls.forEach((el) => {
                el.classList.remove(s.textVisible);
                el.classList.add(s.textHidden);
                el.style.opacity = "0";
              });
            } else if (progress >= startReveal && progress <= endReveal) {
              const t = (progress - startReveal) / (endReveal - startReveal); // 0..1
              textEls.forEach((el) => {
                el.classList.remove(s.textHidden);
                el.classList.add(s.textVisible);
                el.style.opacity = String(t);
              });
            } else {
              textEls.forEach((el) => {
                el.classList.remove(s.textHidden);
                el.classList.add(s.textVisible);
                el.style.opacity = "1";
              });
            }
          } else if (progress > 0.95) {
            if (flipAnimation) flipAnimation.progress(1);
            if (pinnedMarqueeImgClone) gsap.set(pinnedMarqueeImgClone, { x: "-200%" });
            gsap.set(horizontalWrapper, { x: "-66.67%" });
            textEls.forEach((el) => {
              el.classList.remove(s.textHidden);
              el.classList.add(s.textVisible);
              el.style.opacity = "1";
            });
          }
        },
      });
      localTriggers.push(stFlip);

      // Refresh stabile
      ro = new ResizeObserver(() => ScrollTrigger.refresh());
      ro.observe(rootEl);
      ScrollTrigger.refresh();
    });

    return () => {
      removePinnedMarqueeImgClone();
      ro?.disconnect();
      localTriggers.forEach((st) => st.kill());
    };
  }, [IMAGES.join("|"), SLIDES.map((s) => s.image).join("|"), pinIndex, selectors.pinnedImg, selectors.slideTexts]);

  return (
    <div ref={rootRef} className={s.root}>
      {/* HERO (full-bleed) */}
      <section className={`${s.hero} ${s.bleed}`} ref={containerRef}>
        <h1>
          Fragments of thought arranged in sequence become patterns. They unfold
          step by step, shaping meaning as they move forward.
        </h1>
      </section>

      {/* MARQUEE (full-bleed) */}
      <section ref={marqueeRef} className={`${s.marquee} ${s.bleed}`}>
        <div className={s.marqueeWrapper}>
          <div ref={marqueeImagesRef} className={`${s.marqueeImages} ${s.gpuLayer}`}>
            {IMAGES.map((src, i) => (
              <div key={i} className={`${s.marqueeImg} ${i === pinIndex ? "pin" : ""}`}>
                <img src={src} alt={`marquee-${i + 1}`} className={s.imgGlobalReset} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORIZZONTALE (full-bleed) */}
      <section ref={horizontalRef} className={`${s.horizontalScroll} ${s.bleed}`}>
        <div ref={horizontalWrapperRef} className={`${s.horizontalScrollWrapper} ${s.gpuLayer}`}>
          <div className={`${s.horizontalSlide} ${s.horizontalSpacer}`} />
          {SLIDES.map((sl, i) => (
            <div key={i} className={s.horizontalSlide}>
              <div className={`${s.col} ${s.colFirst}`}>
                <h3 className={`${s.slideText} ${s.textHidden}`}>{sl.text}</h3>
              </div>
              <div className={`${s.col} ${s.colSecond}`}>
                <img src={sl.image} alt={`slide-${i + 1}`} className={s.slideImage} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUTRO (full-bleed) 
      <section className={`${s.outro} ${s.bleed}`}>
        <h1>
          Shadows fold into light. Shapes shift across the frame, reminding us
          that stillness is only temporary.
        </h1>
      </section>*/}
    </div>
  );
}