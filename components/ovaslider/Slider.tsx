"use client";

import { useRef } from "react";
import { useGsapRegister, useGSAP } from "@/lib/gsap";

// Usa <img> con URL Unsplash (niente configurazione next/image necessaria)
type Slide = { title: string; image: string };

const slides: Slide[] = [
  {
    title:
      "Under the soft hum of streetlights she watches the world ripple in glass and shadow.",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title:
      "A car slices through the desert as the road thins into heat and sky.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title:
      "Reflections ripple across mirrored faces—fragments of certainty and mystery.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title:
      "Soft light spills through the café windows, capturing quiet human routine.",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title:
      "Every serve becomes a battle between focus and instinct on the court.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title:
      "Amber light over the stage where music and motion merge into energy.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title:
      "Dust erupts beneath his stride—every step pushing closer to grit and will.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
  },
];

export default function Slider() {
  // ❌ NON destrutturiamo SplitText: non è tipizzato in useGsapRegister
  const { gsap, ScrollTrigger } = useGsapRegister();

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderImagesRef = useRef<HTMLDivElement | null>(null);
  const sliderTitleRef = useRef<HTMLDivElement | null>(null);
  const sliderIndicesRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  // ✅ SplitText dinamico, registrato a runtime e usato da ref
  const splitRef = useRef<any>(null);

  useGSAP(
    () => {
      // Importa e registra SplitText una volta (non blocca se fallisce)
      (async () => {
        try {
          const mod = await import("gsap/SplitText");
          // mod può esportare come default o named; gestiamo entrambi
          const SplitText = (mod as any).SplitText ?? (mod as any).default ?? null;
          if (SplitText) {
            gsap.registerPlugin(SplitText);
            splitRef.current = SplitText;
          }
        } catch {
          // ok: useremo il fallback senza SplitText
        }
      })();

      let activeSlide = 0;
      let currentSplit: any = null;

      // spazio totale di scroll (un viewport per slide, +10%)
      const sectionSpan = Math.max(1, slides.length) * window.innerHeight * 1.1;

      const createIndices = () => {
        if (!sliderIndicesRef.current) return;
        sliderIndicesRef.current.innerHTML = "";
        slides.forEach((_, index) => {
          const el = document.createElement("p");
          el.dataset.index = String(index);
          el.className = "flex items-center gap-3 text-white";
          const indexNum = (index + 1).toString().padStart(2, "0");
          el.innerHTML = `
            <span class="marker block w-3 h-px bg-white origin-right"></span>
            <span class="index inline-flex w-5 justify-end">${indexNum}</span>
          `;
          sliderIndicesRef.current!.appendChild(el);

          gsap.set(el.querySelector(".index"), { opacity: index === 0 ? 1 : 0.35 });
          gsap.set(el.querySelector(".marker"), { scaleX: index === 0 ? 1 : 0 });
        });
      };

      const animateIndicators = (index: number) => {
        if (!sliderIndicesRef.current) return;
        const indicators = sliderIndicesRef.current.querySelectorAll("p");
        indicators.forEach((indicator, i) => {
          const marker = indicator.querySelector(".marker") as HTMLElement | null;
          const num = indicator.querySelector(".index") as HTMLElement | null;
          if (!marker || !num) return;
          gsap.to(num, { opacity: i === index ? 1 : 0.35, duration: 0.3, ease: "power2.out" });
          gsap.to(marker, { scaleX: i === index ? 1 : 0, duration: 0.3, ease: "power2.out" });
        });
      };

      const animateNewTitle = (index: number) => {
        if (!sliderTitleRef.current) return;
        if (currentSplit) currentSplit.revert();

        sliderTitleRef.current.innerHTML = `
          <h1 class="text-balance text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
            ${slides[index].title}
          </h1>
        `;

        const h1 = sliderTitleRef.current.querySelector("h1") as HTMLElement | null;

        if (splitRef.current && h1) {
          try {
            // Usa la classe SplitText registrata
            currentSplit = new splitRef.current(h1, {
              type: "lines",
              linesClass: "line block will-change-transform",
              mask: "lines",
            });
            const lines = (currentSplit.lines || []) as HTMLElement[];
            gsap.fromTo(
              lines,
              { yPercent: 100, opacity: 0, filter: "blur(6px)", letterSpacing: "0.06em" },
              {
                yPercent: 0,
                opacity: 1,
                filter: "blur(0px)",
                letterSpacing: "0em",
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.06,
                clearProps: "transform,opacity,filter,letterSpacing",
              }
            );
            return;
          } catch {
            // fallback sotto
          }
        }

        // fallback se SplitText non disponibile
        if (h1) {
          gsap.fromTo(
            h1,
            { yPercent: 30, opacity: 0, filter: "blur(4px)" },
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "power3.out",
              clearProps: "transform,opacity,filter",
            }
          );
        }
      };

      const animateNewSlide = (index: number) => {
        if (!sliderImagesRef.current) return;
        const wrapper = sliderImagesRef.current;

        const pic = document.createElement("div");
        pic.className = "absolute inset-0 z-0";
        pic.innerHTML = `
          <img src="${slides[index].image}" alt="Slide ${index + 1}" class="w-full h-full object-cover"/>
          <div class="absolute inset-0 pointer-events-none z-10" style="background: radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)"></div>
        `;

        gsap.set(pic, { opacity: 0, scale: 1.06 });
        wrapper.appendChild(pic);

        gsap.to(pic, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(pic, { scale: 1, duration: 1, ease: "power2.out" });

        // lascia solo l'ultimo frame
        const all = wrapper.querySelectorAll(":scope > div");
        for (let i = 0; i < all.length - 1; i++) wrapper.removeChild(all[i]);

        animateNewTitle(index);
        animateIndicators(index);
      };

      // init
      createIndices();
      animateNewSlide(0);

      // ✅ forza visibilità iniziale del titolo sopra gli overlay
      if (sliderTitleRef.current) gsap.set(sliderTitleRef.current, { opacity: 1 });

      // ScrollTrigger (sezione pinnata verticale)
      const st = ScrollTrigger.create({
        trigger: sliderRef.current!,
        start: "top top",
        end: `+=${sectionSpan}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (progressBarRef.current) gsap.set(progressBarRef.current, { scaleY: self.progress });
          const total = slides.length;
          const idx = Math.min(total - 1, Math.floor(self.progress * total + 1e-6));
          if (idx !== activeSlide) {
            activeSlide = idx;
            animateNewSlide(activeSlide);
          }
        },
      });

      return () => {
        if (currentSplit) currentSplit.revert();
        st.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: sliderRef }
  );

  return (
    <section
      ref={sliderRef}
      className="relative w-full h-[100svh] bg-black text-white overflow-hidden"
    >
      {/* layer immagini (z-0) + overlay (z-10) */}
      <div ref={sliderImagesRef} className="absolute inset-0 z-0">
        {/* frame SSR */}
        <img
          src={slides[0].image}
          alt="Slide 1"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* titolo sopra (z-20), no click */}
      <div
        ref={sliderTitleRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72%] max-w-4xl z-20 pointer-events-none"
      >
        <h1 className="text-3xl md:text-5xl font-normal tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] text-balance">
          {slides[0].title}
        </h1>
      </div>

      {/* indicatori sopra tutto (z-30) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 z-30">
        <div ref={sliderIndicesRef} className="flex flex-col gap-4 py-4 px-5" />
        <div className="absolute top-0 right-0 h-full w-px bg-white/40">
          <div
            ref={progressBarRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white origin-top"
            style={{ transform: "translateX(-50%) scaleY(0)" }}
          />
        </div>
      </div>
    </section>
  );
}