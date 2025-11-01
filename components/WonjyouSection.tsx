"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MarqueeGsapFixed() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const images = imagesRef.current!;
      const wrapper = wrapperRef.current!;

      // Stato iniziale SOLO via GSAP (niente transform nel CSS)
      gsap.set(wrapper, {
        xPercent: -50,
        yPercent: -50,
        rotate: -5,
        force3D: true,
      });

      gsap.set(images, {
        xPercent: -75,   // posizione iniziale come nell’HTML originale
        yPercent: -50,
        force3D: true,
      });

      // ScrollTrigger per muovere da -75% a -50% (marquee visibile sempre)
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          const x = -75 + self.progress * 25; // -75% -> -50%
          gsap.set(images, { xPercent: x, force3D: true });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="wj-page">
      <section className="wj-marquee">
        <div ref={wrapperRef} className="wj-marquee-wrapper">
          <div ref={imagesRef} className="wj-marquee-images">
            {[
              "https://picsum.photos/id/1015/1200/800",
              "https://picsum.photos/id/1016/1200/800",
              "https://picsum.photos/id/1018/1200/800",
              "https://picsum.photos/id/1020/1200/800",
              "https://picsum.photos/id/1024/1200/800",
              "https://picsum.photos/id/1035/1200/800",
              "https://picsum.photos/id/1039/1200/800",
              "https://picsum.photos/id/1041/1200/800",
              "https://picsum.photos/id/1043/1200/800",
              "https://picsum.photos/id/1045/1200/800",
            ].map((src, i) => (
              <div className="wj-marquee-img" key={i}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        :root{ --light:#edf1e8; --dark:#101010; }
        *,*::before,*::after{ box-sizing:border-box; margin:0; padding:0; }
        html, body, #__next{ height:100%; }
        img{ display:block; width:100%; height:100%; object-fit:cover; }
      `}</style>

      <style jsx>{`
        .wj-page{
          min-height:120vh; /* serve un po' di scroll per test */
          display:grid; place-items:center;
          background:var(--light);
        }
        .wj-marquee{
          position:relative;
          width:100%;
          max-width:1200px;
          height:50vh;
          overflow:hidden;
          outline:2px dashed rgba(0,0,0,.12); /* debug */
        }
        .wj-marquee-wrapper{
          /* nessun transform in CSS: lo mette GSAP */
          position:absolute;
          top:50%; left:50%;
          width:150%;
          height:100%;
          pointer-events:none;
        }
        .wj-marquee-images{
          /* nessun transform in CSS: lo mette GSAP */
          position:absolute;
          top:50%; left:50%;
          width:200%;
          height:100%;
          display:flex; gap:1rem;
          align-items:center; justify-content:space-between;
          will-change: transform;
        }
        .wj-marquee-img{
          flex:1; width:100%;
          aspect-ratio:5/3;
          border-radius:12px; overflow:hidden;
          background:#ddd;
          box-shadow:0 10px 28px rgba(0,0,0,.15);
        }
        @media (max-width: 900px){
          .wj-marquee-wrapper{ width:300%; }
        }
      `}</style>
    </div>
  );
}