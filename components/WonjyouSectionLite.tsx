"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

type Props = {
  pinIndex?: number; // quale immagine “marquee” si “pinna” e va fullscreen (0-based)
};

export default function WonjyouSectionLite({ pinIndex = 6 }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cloneRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const marquee = root.querySelector(".wj-marquee") as HTMLElement | null;
      const marqueeImages = root.querySelector(".wj-marquee-images") as HTMLElement | null;
      const marqueeImgs = Array.from(root.querySelectorAll(".wj-marquee-img")) as HTMLElement[];
      const pinWrap = marqueeImgs[pinIndex];
      const pinImg = pinWrap?.querySelector("img") as HTMLImageElement | null;

      const horiz = root.querySelector(".wj-horizontal") as HTMLElement | null;
      const horizWrapper = root.querySelector(".wj-horizontal-wrapper") as HTMLElement | null;

      if (!marquee || !marqueeImages || !pinImg || !horiz || !horizWrapper) {
        // Debug rapido in console
        console.warn("[WonjyouLite] Missing nodes", {
          marquee: !!marquee,
          marqueeImages: !!marqueeImages,
          pinImg: !!pinImg,
          horiz: !!horiz,
          horizWrapper: !!horizWrapper,
        });
        return;
      }

      // Stato clone
      let pinnedClone: HTMLImageElement | null = null;
      let flipAnim: gsap.core.Tween | null = null;

      // Marquee: muovi X da -75% a -50% mentre ti avvicini
      gsap.set(marqueeImages, { xPercent: -75, yPercent: -50, force3D: true });

      ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const x = -75 + self.progress * 25; // -75% -> -50%
          gsap.set(marqueeImages, { xPercent: x });
        },
      });

      // Crea clone “pinned” quando entri nella marquee
      const createPinnedClone = () => {
        if (pinnedClone) return;
        const rect = pinImg.getBoundingClientRect();
        pinnedClone = pinImg.cloneNode(true) as HTMLImageElement;
        cloneRef.current = pinnedClone;

        gsap.set(pinnedClone, {
          position: "fixed",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          transform: "rotate(-5deg)",
          transformOrigin: "center center",
          pointerEvents: "none",
          zIndex: 100,
        });

        document.body.appendChild(pinnedClone);
        gsap.set(pinImg, { opacity: 0 });
      };

      const removePinnedClone = () => {
        if (!pinnedClone) return;
        pinnedClone.remove();
        pinnedClone = null;
        gsap.set(pinImg, { opacity: 1 });
      };

      ScrollTrigger.create({
        trigger: marquee,
        start: "top top",
        onEnter: createPinnedClone,
        onEnterBack: createPinnedClone,
        onLeaveBack: removePinnedClone,
      });

      // Pinna la sezione orizzontale
      ScrollTrigger.create({
        trigger: horiz,
        start: "top top",
        end: () => `+=${window.innerHeight * 5}`,
        pin: true,
        pinSpacing: true,
      });

      // Prepara flip quando entri nella sezione orizzontale
      ScrollTrigger.create({
        trigger: horiz,
        start: "top 50%",
        end: () => `+=${window.innerHeight * 5.5}`,
        onEnter: () => {
          if (!pinnedClone || flipAnim) return;
          const state = Flip.getState(pinnedClone);

          gsap.set(pinnedClone, {
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100svh",
            transform: "rotate(0deg)",
          });

            // flip a controllo “manuale” (via progress)
          flipAnim = Flip.from(state, { duration: 1, ease: "none", paused: true });
        },
        onLeaveBack: () => {
          if (flipAnim) {
            flipAnim.kill();
            flipAnim = null;
          }
          gsap.set(root, { backgroundColor: "var(--light)" });
          gsap.set(horizWrapper, { xPercent: 0 });
        },
      });

      // Master onUpdate: colore bg + flip + orizzontale + parallax clone
      ScrollTrigger.create({
        trigger: horiz,
        start: "top 50%",
        end: () => `+=${window.innerHeight * 5.5}`,
        onUpdate: (self) => {
          const p = self.progress;

          // bg fade 0→0.06
          if (p <= 0.06) {
            const t = Math.min(p / 0.06, 1);
            const bg = gsap.utils.interpolate("#edf1e8", "#101010", t);
            gsap.set(root, { backgroundColor: bg });
          } else {
            gsap.set(root, { backgroundColor: "var(--dark)" });
          }

          // flip 0→0.2
          if (flipAnim) {
            if (p <= 0.2) flipAnim.progress(p / 0.2);
            else flipAnim.progress(1);
          }

          // orizzontale 0.2→0.95
          if (p > 0.2 && p <= 0.95) {
            const h = (p - 0.2) / 0.75; // 0..1
            gsap.set(horizWrapper, { xPercent: -66.67 * h });

            // parallax clone
            if (cloneRef.current) {
              const slideMovement = (66.67 / 100) * 3 * h;
              gsap.set(cloneRef.current, { xPercent: -slideMovement * 100 });
            }
          } else if (p > 0.95) {
            gsap.set(horizWrapper, { xPercent: -66.67 });
            if (cloneRef.current) gsap.set(cloneRef.current, { xPercent: -200 });
          }
        },
      });

      // Cleanup su smontaggio/ri-render
      return () => {
        removePinnedClone();
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.globalTimeline.clear();
      };
    }, root);

    return () => ctx.revert();
  }, [pinIndex]);

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
            {Array.from({ length: 13 }).map((_, i) => (
              <div className={`wj-marquee-img ${i === pinIndex ? "pin" : ""}`} key={i}>
                {/* <img> nativa per poter clonare l’elemento 1:1 col Flip */}
                <img src={`/img-${i + 1}.jpg`} alt="" />
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
              <Image src="/slide-1.jpg" alt="" width={1600} height={1066} />
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
              <Image src="/slide-2.jpg" alt="" width={1600} height={1066} />
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
        :root { --light: #edf1e8; --dark: #101010; }

        *,*::before,*::after{ box-sizing:border-box; margin:0; padding:0; }
        .wj-container{ position:relative; width:100%; min-height:100%; background:var(--light); color:#111; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial; }

        h1{ font-size:4rem; font-weight:500; letter-spacing:-0.075rem; line-height:1.125; }
        h3{ font-size:2.25rem; font-weight:500; letter-spacing:-0.025rem; line-height:1.125; }

        .wj-hero,.wj-outro{ position:relative; width:100%; height:100svh; padding:2rem; align-content:center; text-align:center; }
        .wj-hero h1,.wj-outro h1{ width:75%; margin:0 auto; }
        .wj-outro{ background:var(--dark); color:var(--light); }

        /* MARQUEE */
        .wj-marquee{ position:relative; width:100%; height:50svh; overflow:hidden; }
        .wj-marquee-wrapper{
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%) rotate(-5deg);
          width:150%; height:100%; pointer-events:none;
        }
        .wj-marquee-images{
          position:absolute; top:50%; left:50%;
          transform:translate(-75%, -50%); /* x = -75%, y = -50% (centratura verticale stabile) */
          width:200%; height:100%;
          display:flex; align-items:center; gap:1rem;
          will-change:transform;
        }
        .wj-marquee-img{
          flex:0 0 auto;
          height:100%;
          aspect-ratio:5/3;
          width:auto;
          overflow:hidden;
          border-radius:8px;
          background:#ddd;
        }
        .wj-marquee-img img{ height:100%; width:auto; object-fit:cover; display:block; }

        /* HORIZONTAL */
        .wj-horizontal{ position:relative; width:100%; height:100svh; overflow:hidden; }
        .wj-horizontal-wrapper{ position:relative; width:300%; height:100svh; display:flex; will-change:transform; }

        .wj-horizontal-slide{ flex:1; height:100%; display:flex; gap:2rem; padding:2rem; }
        .wj-horizontal-slide:not(.wj-horizontal-spacer){ background:var(--dark); color:var(--light); }

        .wj-horizontal-slide .col:nth-child(1){ flex:3; display:flex; justify-content:center; align-items:center; }
        .wj-horizontal-slide .col:nth-child(2){ flex:2; display:flex; justify-content:center; align-items:center; }

        .wj-horizontal-slide .col h3{ width:75%; }
        :global(.wj-horizontal-slide .col img){ width:75%; height:75%; object-fit:cover; }

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