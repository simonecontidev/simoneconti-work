"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";

/**
 * Props:
 * - imgMarquee: lista immagini della fila marquee (una diventa “pin” e viene flippata fullscreen)
 * - imgSlides: immagini delle due slide orizzontali
 * - pinIndex: indice 0-based dell’immagine “pin” (default 6)
 * - light/dark: colori di background della sezione (CSS vars fallback)
 */
type Props = {
  imgMarquee?: string[];
  imgSlides?: string[];
  pinIndex?: number;
  light?: string;
  dark?: string;
};

gsap.registerPlugin(ScrollTrigger, Flip);

export default function WonjyouSection({
  imgMarquee = [
    "/img-1.jpg","/img-2.jpg","/img-3.jpg","/img-4.jpg","/img-5.jpg","/img-6.jpg",
    "/img-7.jpg", // <-- di default questa sarà “pin”
    "/img-8.jpg","/img-9.jpg","/img-10.jpg","/img-11.jpg","/img-12.jpg","/img-13.jpg",
  ],
  imgSlides = ["/slide-1.jpg", "/slide-2.jpg"],
  pinIndex = 6,
  light = "#edf1e8",
  dark = "#101010",
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    // Lenis (smooth scroll) senza wrapper react
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, smoothTouch: false });
    const raf = (time: number) => {
      lenis.raf(time);
      requestId = requestAnimationFrame(raf);
    };
    let requestId = requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger, Flip);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    // Utils locali (scoped alla sezione)
    const $ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = root) =>
      ctx.querySelector(sel) as T | null;
    const $$ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = root) =>
      Array.from(ctx.querySelectorAll(sel)) as T[];

    // Nodi
    const marquee = $(".wj-marquee");
    const marqueeImages = $(".wj-marquee-images");
    const marqueeImgs = $$(".wj-marquee-img", marquee ?? root);
    const pinWrap = marqueeImgs[pinIndex];
    const pinImg = pinWrap?.querySelector("img") as HTMLImageElement | null;

    const horiz = $(".wj-horizontal");
    const horizWrapper = $(".wj-horizontal-wrapper");

    if (!marquee || !marqueeImages || !pinImg || !horiz || !horizWrapper) {
      // cleanup lenis se qualcosa manca
      cancelAnimationFrame(requestId);
      lenis.destroy();
      return;
    }

    // Stato clone “pinnato”
    let pinnedClone: HTMLImageElement | null = null;
    let cloneActive = false;
    let flipAnim: gsap.core.Tween | null = null;

    // 1) Marquee: movimento X su avvicinamento, con yPercent fisso
    let currentX = -75; // parte da -75%
    gsap.set(marqueeImages, { xPercent: currentX, yPercent: -50, force3D: true });

    ScrollTrigger.create({
      trigger: marquee,
      start: "top bottom",
      end: "top top",
      scrub: 0.6,
      onUpdate: (self) => {
        const targetX = -75 + self.progress * 25; // -75% -> -50%
        currentX = currentX + (targetX - currentX) * 0.18; // easing manuale
        gsap.to(marqueeImages, {
          xPercent: currentX,
          yPercent: -50,         // IMPORTANT: non perdere la Y
          duration: 0.12,
          ease: "none",
          overwrite: "auto",
        });
      },
    });

    // 2) Crea clone fisso dell’immagine “pin” quando entri nella marquee
    const createPinnedClone = () => {
      if (cloneActive || !pinImg) return;
      const rect = pinImg.getBoundingClientRect();
      pinnedClone = pinImg.cloneNode(true) as HTMLImageElement;

      gsap.set(pinnedClone, {
        position: "fixed",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        transform: "rotate(-5deg)",
        transformOrigin: "center center",
        pointerEvents: "none",
        willChange: "transform",
        zIndex: 100,
      });

      document.body.appendChild(pinnedClone);
      gsap.set(pinImg, { opacity: 0 });
      cloneActive = true;
    };

    const removePinnedClone = () => {
      if (!cloneActive) return;
      if (pinnedClone) pinnedClone.remove();
      pinnedClone = null;
      gsap.set(pinImg, { opacity: 1 });
      cloneActive = false;
    };

    ScrollTrigger.create({
      trigger: marquee,
      start: "top top",
      onEnter: createPinnedClone,
      onEnterBack: createPinnedClone,
      onLeaveBack: removePinnedClone,
    });

    // 3) Pin della sezione orizzontale
    ScrollTrigger.create({
      trigger: horiz,
      start: "top top",
      end: () => `+=${window.innerHeight * 5}`,
      pin: true,
      pinSpacing: true,
    });

    // 4) Prepara FLIP all’ingresso della sezione orizzontale
    ScrollTrigger.create({
      trigger: horiz,
      start: "top 50%",
      end: () => `+=${window.innerHeight * 5.5}`,
      onEnter: () => {
        if (!pinnedClone || !cloneActive || flipAnim) return;

        const state = Flip.getState(pinnedClone);
        gsap.set(pinnedClone, {
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100svh",
          transform: "rotate(0deg)",
          transformOrigin: "center center",
        });
        flipAnim = Flip.from(state, {
          duration: 1,
          ease: "power2.out",
          paused: true,
        });
      },
      onLeaveBack: () => {
        if (flipAnim) {
          flipAnim.kill();
          flipAnim = null;
        }
        gsap.set(root, { backgroundColor: light });
        gsap.set(horizWrapper, { xPercent: 0 });
      },
    });

    // 5) Master onUpdate: bg fade + flip progress + scroll orizzontale + parallax clone
    ScrollTrigger.create({
      trigger: horiz,
      start: "top 50%",
      end: () => `+=${window.innerHeight * 5.5}`,
      onUpdate: (self) => {
        const p = self.progress;

        // 0 → 0.06: fade bg light→dark
        if (p <= 0.06) {
          const t = Math.min(p / 0.06, 1);
          const bg = gsap.utils.interpolate(light, dark, t);
          gsap.to(root, { backgroundColor: bg, duration: 0.12, ease: "none" });
        } else {
          gsap.to(root, { backgroundColor: dark, duration: 0.12, ease: "none" });
        }

        // 0 → 0.2: flip fullscreen
        if (p <= 0.2) {
          if (flipAnim) flipAnim.progress(p / 0.2);
        }

        // 0.2 → 0.95: orizzontale & parallax
        if (p > 0.2 && p <= 0.95) {
          if (flipAnim) flipAnim.progress(1);
          const h = (p - 0.2) / 0.75; // 0..1
          const wrapperX = -66.67 * h;
          gsap.to(horizWrapper, { xPercent: wrapperX, duration: 0.12, ease: "none" });

          // parallax clone (si muove più veloce della wrapper)
          const slideMovement = (66.67 / 100) * 3 * h;
          const imgX = -slideMovement * 100;
          if (pinnedClone) gsap.to(pinnedClone, { xPercent: imgX, duration: 0.12, ease: "none" });
        } else if (p > 0.95) {
          if (flipAnim) flipAnim.progress(1);
          if (pinnedClone) gsap.to(pinnedClone, { xPercent: -200, duration: 0.2, ease: "power1.in" });
          gsap.to(horizWrapper, { xPercent: -66.67, duration: 0.2, ease: "none" });
        }
      },
    });

    // Cleanup
    return () => {
      removePinnedClone();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.globalTimeline.clear();
      cancelAnimationFrame(requestId);
      lenis.destroy();
    };
  }, [dark, light, pinIndex]);

  return (
    <div ref={rootRef} className="wj-container">
      {/* HERO */}
      <section className="wj-hero">
        <h1>
          Fragments of thought arranged in sequence become patterns. They unfold
          step by step, shaping meaning as they move forward.
        </h1>
      </section>

      {/* MARQUEE */}
      <section className="wj-marquee">
        <div className="wj-marquee-wrapper">
          <div className="wj-marquee-images">
            {imgMarquee.map((src, i) => (
              <div className={`wj-marquee-img ${i === pinIndex ? "pin" : ""}`} key={src + i}>
                {/* uso <img> nativa (non <Image/>) per clonare 1:1 col Flip */}
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HORIZONTAL SCROLL */}
      <section className="wj-horizontal">
        <div className="wj-horizontal-wrapper">
          <div className="wj-horizontal-slide wj-horizontal-spacer" />
          <div className="wj-horizontal-slide">
            <div className="col">
              <h3>
                A landscape in constant transition, where every shape, sound,
                and shadow refuses to stay still. What seems stable begins to
                dissolve, and what fades returns again in a new form.
              </h3>
            </div>
            <div className="col">
              <Image src={imgSlides[0] ?? "/slide-1.jpg"} alt="" width={1600} height={1066} />
            </div>
          </div>
          <div className="wj-horizontal-slide">
            <div className="col">
              <h3>
                The rhythm of motion carries us forward into spaces that feel
                familiar yet remain undefined. Each shift is subtle, yet
                together they remind us that nothing we see is ever permanent.
              </h3>
            </div>
            <div className="col">
              <Image src={imgSlides[1] ?? "/slide-2.jpg"} alt="" width={1600} height={1066} />
            </div>
          </div>
        </div>
      </section>

      {/* OUTRO */}
      <section className="wj-outro">
        <h1>
          Shadows fold into light. Shapes shift across the frame, reminding us
          that stillness is only temporary.
        </h1>
      </section>

      {/* STILI */}
      <style jsx>{`
        @import url("https://fonts.cdnfonts.com/css/pp-neue-montreal");

        :root { --light: ${light}; --dark: ${dark}; --marqueeH: 50svh; }

        *,*::before,*::after{ box-sizing:border-box; margin:0; padding:0; }
        .wj-container{ position:relative; width:100%; min-height:100%; background-color:var(--light); will-change:background-color; font-family:"PP Neue Montreal"; color:#111; }

        h1{ font-size:4rem; font-weight:500; letter-spacing:-0.075rem; line-height:1.125; }
        h3{ font-size:2.25rem; font-weight:500; letter-spacing:-0.025rem; line-height:1.125; }

        .wj-hero,.wj-outro{ position:relative; width:100%; height:100svh; padding:2rem; align-content:center; text-align:center; }
        .wj-hero h1,.wj-outro h1{ width:75%; margin:0 auto; }
        .wj-outro{ background:var(--dark); color:var(--light); }

        /* MARQUEE */
        .wj-marquee{ position:relative; width:100%; height:var(--marqueeH); overflow:hidden; }
        .wj-marquee-wrapper{
          position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-5deg);
          width:150%; height:100%; pointer-events:none;
        }
        .wj-marquee-images{
          position:absolute; top:50%; left:50%;
          transform:translate(-75%, -50%); /* x parte da -75%, y fisso a -50% */
          width:200%; height:100%;
          display:flex; align-items:center; gap:1rem;
          will-change: transform;
        }
        .wj-marquee-img{
          flex:0 0 auto;
          height:100%;
          aspect-ratio:5/3;
          width:auto;
          overflow:hidden;
          border-radius:8px;
          background:#ddd; /* debug fallback */
        }
        .wj-marquee-img img{ height:100%; width:auto; object-fit:cover; display:block; }

        /* HORIZONTAL */
        .wj-horizontal{ position:relative; width:100%; height:100svh; overflow:hidden; }
        .wj-horizontal-wrapper{ position:relative; width:300%; height:100svh; display:flex; will-change:transform; }

        .wj-horizontal-slide{
          flex:1; height:100%; display:flex; gap:2rem; padding:2rem;
        }
        .wj-horizontal-slide:not(.wj-horizontal-spacer){
          background:var(--dark); color:var(--light);
        }

        .wj-horizontal-slide .col:nth-child(1){ flex:3; display:flex; justify-content:center; align-items:center; }
        .wj-horizontal-slide .col:nth-child(2){ flex:2; display:flex; justify-content:center; align-items:center; }

        .wj-horizontal-slide .col h3{ width:75%; }
        :global(.wj-horizontal-slide .col img){ width:75%; height:75%; object-fit:cover; }

        /* Responsive */
        @media (max-width:1000px){
          h1{ font-size:2.25rem; letter-spacing:-0.05rem; }
          h3{ font-size:1.5rem; }
          .wj-hero h1,.wj-outro h1{ width:100%; }
          .wj-marquee-wrapper{ width:300%; }

          .wj-horizontal-slide{ padding:4rem; flex-direction:column-reverse; gap:2rem; }
          .wj-horizontal-slide .col:nth-child(1){ align-items:flex-start; }
          .wj-horizontal-slide .col h3{ width:100%; }
          :global(.wj-horizontal-slide .col img){ width:100%; height:100%; }
        }
      `}</style>
    </div>
  );
}