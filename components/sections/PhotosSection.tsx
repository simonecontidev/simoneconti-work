"use client";

import { useEffect, useRef } from "react";
import "../photos.css";
import { useGsapRegister } from "@/lib/gsap";

type NullableEl = HTMLDivElement | null;

export default function PhotosSection() {
  const { gsap, CustomEase } = useGsapRegister();

  const sliderRef = useRef<NullableEl>(null);
  const sliderImagesRef = useRef<NullableEl>(null);
  const counterRef = useRef<NullableEl>(null);
  const titlesRef = useRef<NullableEl>(null);
  const indicatorsRef = useRef<NullableEl>(null);

  // runtime refs
  const previewsRef = useRef<HTMLDivElement[]>([]);
  const currentImgRef = useRef(1);
  const indicatorRotationRef = useRef(0);
  const totalSlides = 4;

  useEffect(() => {
    if (!sliderRef.current) return;

    // GSAP context
    const ctx = gsap.context(() => {
      // Easing personalizzato come nel template
      if (CustomEase && !CustomEase.get("hop2")) {
        CustomEase.create(
          "hop2",
          "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
        );
      }
      const ease = "hop2";

      // Cache elementi effettivi
      const slider = sliderRef.current!;
      const sliderImages = sliderImagesRef.current!;
      const counter = counterRef.current!;
      const titles = titlesRef.current!;
      const indicators = indicatorsRef.current!;

      // raccogli le preview (evita push duplicati)
      previewsRef.current = Array.from(
        slider.querySelectorAll<HTMLDivElement>(".preview")
      );

      // helper per aggiornare counter/titoli
      function updateCounterAndTitlePosition() {
        const current = currentImgRef.current;
        const counterY = -20 * (current - 1);
        const titleY = -60 * (current - 1);

        gsap.to(counter, { y: counterY, duration: 1, ease });
        gsap.to(titles, { y: titleY, duration: 1, ease });
      }

      // helper per stato “active” preview
      function updateActiveSlidePreview() {
        previewsRef.current.forEach((p, i) => {
          p.classList.toggle("active", i === currentImgRef.current - 1);
        });
      }

      // cleanup vecchie slide extra
      function cleanupSlides() {
        const imgs = sliderImages.querySelectorAll<HTMLDivElement>(".img");
        if (imgs.length > totalSlides) {
          gsap.to(imgs[0], {
            opacity: 0,
            duration: 0.5,
            onComplete: () => imgs[0]?.remove(),
          });
        }
      }

      // animazione principale
      function animateSlide(direction: "left" | "right") {
        const currentSlide = sliderImages.lastElementChild as HTMLDivElement;

        const nextWrap = document.createElement("div");
        nextWrap.classList.add("img");
        const nextImg = document.createElement("img");
        nextImg.src = `/assets/img${currentImgRef.current}.jpg`;
        gsap.set(nextImg, { x: direction === "left" ? -500 : 500 });
        nextWrap.appendChild(nextImg);
        sliderImages.appendChild(nextWrap);

        const tl = gsap.timeline();
        tl.to(currentSlide.querySelector("img"), {
          x: direction === "left" ? 500 : -500,
          duration: 1.5,
          ease,
        })
          .fromTo(
            nextWrap,
            {
              clipPath:
                direction === "left"
                  ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
                  : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
            },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.5,
              ease,
            },
            0
          )
          .to(
            nextImg,
            {
              x: 0,
              duration: 1.5,
              ease,
            },
            0
          )
          .call(cleanupSlides, null, 1.5);

        // ruota gli indicatori
        indicatorRotationRef.current += direction === "left" ? -90 : 90;
        gsap.to(indicators.children, {
          rotate: indicatorRotationRef.current,
          duration: 1,
          ease,
        });
      }

      function goTo(index: number) {
        const prev = currentImgRef.current;
        if (index === prev) return;
        currentImgRef.current = Math.min(Math.max(index, 1), totalSlides);
        animateSlide(index < prev ? "left" : "right");
        updateActiveSlidePreview();
        updateCounterAndTitlePosition();
      }

      // click handling (intero slider)
      function handleClick(ev: MouseEvent) {
        const target = ev.target as HTMLElement;
        // click su preview
        const preview = target.closest(".preview") as HTMLDivElement | null;
        if (preview) {
          const idx = previewsRef.current.indexOf(preview);
          if (idx >= 0) goTo(idx + 1);
          return;
        }

        // click sinistra/destra
        const rect = slider.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        if (x < rect.width / 2 && currentImgRef.current !== 1) {
          goTo(currentImgRef.current - 1);
        } else if (x >= rect.width / 2 && currentImgRef.current !== totalSlides) {
          goTo(currentImgRef.current + 1);
        }
      }

      slider.addEventListener("click", handleClick);
      // stato iniziale
      updateActiveSlidePreview();
      updateCounterAndTitlePosition();

      return () => {
        slider.removeEventListener("click", handleClick);
      };
    }, sliderRef);

    return () => ctx.revert();
  }, [gsap, CustomEase]);

  return (
    <section className="slider" ref={sliderRef}>
      {/* Images layer */}
      <div className="slider-images" ref={sliderImagesRef}>
        <div className="img">
          <img src="/assets/img1.jpg" alt="" />
        </div>
      </div>

      {/* Title stack */}
      <div className="slider-title">
        <div className="slider-title-wrapper" ref={titlesRef}>
          <p>The Revival Ensemble</p>
          <p>Above The Canvas</p>
          <p>Harmony in Every Note</p>
          <p>Redefining Imagination</p>
        </div>
      </div>

      {/* Counter */}
      <div className="slider-counter">
        <div className="counter" ref={counterRef}>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
        <div><p>&mdash;</p></div>
        <div><p>4</p></div>
      </div>

      {/* Previews */}
      <div className="slider-preview">
        {[1, 2, 3, 4].map((n, i) => (
          <div key={n} className={`preview ${i === 0 ? "active" : ""}`}>
            <img src={`/assets/img${n}.jpg`} alt={`Preview ${n}`} />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="slider-indicators" ref={indicatorsRef}>
        <p>+</p>
        <p>+</p>
      </div>
    </section>
  );
}