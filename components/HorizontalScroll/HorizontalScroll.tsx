"use client";

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, Flip);

export type WonJYouProps = {
  images?: string[];              // marquee images
  slides?: { image: string; text: string }[];
  featuredIndex?: number;         // quale immagine “esplode”
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

export default function WonJYou(props: WonJYouProps) {
  const IMAGES = props.images?.length ? props.images : DEFAULT_IMAGES;
  const SLIDES = props.slides?.length ? props.slides : DEFAULT_SLIDES;
  const pinIndex = Number.isInteger(props.featuredIndex) ? (props.featuredIndex as number) : 6;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLElement>(null);
  const marqueeImagesRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);

  // Memorizza selettori per evitare closure stale
  const selectors = useMemo(() => ({
    pinnedImg: ".marquee-img.pin img",
  }), []);

  useEffect(() => {
    const container = containerRef.current!;
    const marquee = marqueeRef.current!;
    const marqueeImages = marqueeImagesRef.current!;
    const horizontal = horizontalRef.current!;
    const horizontalWrapper = horizontalWrapperRef.current!;

    // Lenis (una sola istanza)
    const lenis = new Lenis();
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const lightColor = getComputedStyle(document.documentElement).getPropertyValue("--light").trim();
    const darkColor  = getComputedStyle(document.documentElement).getPropertyValue("--dark").trim();
    const interpolateColor = (c1: string, c2: string, f: number) => gsap.utils.interpolate(c1, c2, f);

    // Marquee x
    gsap.to(marqueeImages, {
      scrollTrigger: {
        trigger: marquee,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const xPosition = -75 + self.progress * 25;
          gsap.set(marqueeImages, { x: `${xPosition}%` });
        },
      },
    });

    // Clone + Flip
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

    // Pin sezione orizzontale
    ScrollTrigger.create({
      trigger: horizontal,
      start: "top top",
      end: () => `+=${window.innerHeight * 5}`,
      pin: true,
    });

    // Gestione clone
    ScrollTrigger.create({
      trigger: marquee,
      start: "top top",
      onEnter: createPinnedMarqueeImgClone,
      onEnterBack: createPinnedMarqueeImgClone,
      onLeaveBack: removePinnedMarqueeImgClone,
    });

    // Flip + wrapper horizontal
    ScrollTrigger.create({
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
        gsap.set(container, { backgroundColor: lightColor });
        gsap.set(horizontalWrapper, { x: "0%" });
      },
      onUpdate: (self) => {
        const progress = self.progress;

        // light -> dark background
        if (progress <= 0.05) {
          const bgp = Math.min(progress / 0.05, 1);
          gsap.set(container, { backgroundColor: interpolateColor(lightColor, darkColor, bgp) });
        } else {
          gsap.set(container, { backgroundColor: darkColor });
        }

        // Flip 0→0.2
        if (progress <= 0.2) {
          const sp = progress / 0.2;
          if (flipAnimation) flipAnimation.progress(sp);
        }

        // wrapper orizzontale + immagine che scorre
        if (progress > 0.2 && progress <= 0.95) {
          if (flipAnimation) flipAnimation.progress(1);
          const hp = (progress - 0.2) / 0.75;
          const wrapperX = -66.67 * hp;
          gsap.set(horizontalWrapper, { x: `${wrapperX}%` });

          if (pinnedMarqueeImgClone) {
            const slideMovement = (66.67 / 100) * 3 * hp;
            gsap.set(pinnedMarqueeImgClone, { x: `${-slideMovement * 100}%` });
          }
        } else if (progress > 0.95) {
          if (flipAnimation) flipAnimation.progress(1);
          if (pinnedMarqueeImgClone) gsap.set(pinnedMarqueeImgClone, { x: "-200%" });
          gsap.set(horizontalWrapper, { x: "-66.67%" });
        }
      },
    });

    return () => {
      removePinnedMarqueeImgClone();
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.globalTimeline.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IMAGES.join("|"), SLIDES.map(s => s.image).join("|"), pinIndex]);

  return (
    <div ref={containerRef} className="container">
      <section className="hero">
        <h1>
          Fragments of thought arranged in sequence become patterns. They unfold
          step by step, shaping meaning as they move forward.
        </h1>
      </section>

      <section ref={marqueeRef} className="marquee">
        <div className="marquee-wrapper">
          <div ref={marqueeImagesRef} className="marquee-images">
            {IMAGES.map((src, i) => (
              <div key={i} className={`marquee-img ${i === pinIndex ? "pin" : ""}`}>
                <img src={src} alt={`marquee-${i+1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={horizontalRef} className="horizontal-scroll">
        <div ref={horizontalWrapperRef} className="horizontal-scroll-wrapper">
          <div className="horizontal-slide horizontal-spacer" />
          {SLIDES.map((s, i) => (
            <div key={i} className="horizontal-slide">
              <div className="col">
                <h3>{s.text}</h3>
              </div>
              <div className="col">
                <img src={s.image} alt={`slide-${i+1}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="outro">
        <h1>
          Shadows fold into light. Shapes shift across the frame, reminding us
          that stillness is only temporary.
        </h1>
      </section>
    </div>
  );
}