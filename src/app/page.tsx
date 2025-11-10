// src/app/page.tsx
"use client";

import HorizontalShowcase from "../../components/HorizontalShowcase/HorizontalShowcase";
import ScrollShowcase from "../../components/sections/ScrollShowcase/ScrollShowcase";
import SliderHero from "../../components/SliderHero/SliderHero";
import ScrollImageReveal from "../../components/ScrollImageReveal/ScrollImageReveal";
import HomeTextRevealSection from "../../components/HomeTextRevealSection/HomeTextRevealSection";

export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center bg-black text-zinc-100">
      <SliderHero
        mode="bleed"
        images={[
          "/assets/img1-new.jpg",
          "/assets/img5-new.jpg",
          "/assets/img2-new.jpg",
          "/assets/img4-new.jpg",
          "/assets/img3-new.jpg",
        ]}
        titles={["Pet Finder", "Tropify", "Split the Bill App", "Job App", "Taskflow"]}
      />

      <HorizontalShowcase
        images={[
          "/img-1-new.jpg",
          "/img-2-new.jpg",
          "/img-3-new.jpg",
          "/img-4-new.jpg",
          "/img-5.jpg",
          "/img-6.jpg",
          "/img-7.jpg",
          "/img-8.jpg",
        ]}
        slides={[
          { image: "/img-1-new.jpg", text: "" },
          {
            image: "/img-2-new.jpg",
            text:
              "From fast Next.js apps to tactile GSAP animations. From Shopify integrations to 3D storytelling.",
          },
          { image: "/img-3-new.jpg", text: "Inspired by nature, crafted with motion." },
        ]}
        featuredIndex={3}
      />

      <ScrollShowcase
        hero={{ src: "/hero.jpg", alt: "Studio hero" }}
        outro={{ src: "/outro.jpg", alt: "Studio outro" }}
        services={[
          { src: "/whatido.svg", alt: "What I do 1" },
          { src: "/whatido.svg", alt: "What I do 2" },
          { src: "/whatido.svg", alt: "What I do 3" },
        ]}
        aboutText={`From concept to production: performant UX, elegant motion, real results.`}
        copyText={`Selected work across corporate, e-commerce, and editorial platforms.`}
        options={{
          minScale: 0.12,
          minScaleMobile: 0.32,
          breakpoint: 1000,
          pinMultiplier: 2,
          enableSmooth: true,
        }}
      />

      <HomeTextRevealSection />

      {/* ✅ ScrollImageReveal con link ai progetti */}
      <ScrollImageReveal
        items={[
  { src: "/portfolio/petfinder-1.png", alt: "PetFinder — Cover", caption: "PetFinder — Next.js App", bgColor: "#7e7d65", href: "/portfolio/petfinder" },
  { src: "/portfolio/tropify-1.png", alt: "Tropify — Experimental web", caption: "Tropify — Experiential Web", bgColor: "#989682", href: "/portfolio/tropify" },
  { src: "/portfolio/guava-preview.png", alt: "Guava — Cover", caption: "Guava Bikes — Shopify Components", bgColor: "#faba4a", href: "/portfolio/guava-bikes" },
  { src: "/portfolio/taskflow-1.png", alt: "Taskboard — Cover", caption: "Taskboard — Kanban App", bgColor: "#22333b", href: "/portfolio/taskboard" },
  { src: "/portfolio/mikakus-preview.png", alt: "Mikakus — Slider", caption: "Mikakus — Shopify Slider & LPO", bgColor: "#bb2a26", href: "/portfolio/mikakus-shopify" },
  { src: "/portfolio/jobboard-1.png", alt: "Job Board — Cover", caption: "Job Board — Real-Time Filtering App", bgColor: "#14213d", href: "/portfolio/job-board" },
  { src: "/portfolio/split-1.png", alt: "Split the Bill — Cover", caption: "Split the Bill — React Utility App", bgColor: "#1f1b24", href: "/portfolio/split-bill" },
  
  // “gli altri” (Mortgage, Links, Iniesta Academy)  
  { src: "/portfolio/mortgage-1.png", alt: "Mortgage Calculator — Cover", caption: "Mortgage Calculator — Finance UI", bgColor: "#1a1423", href: "/portfolio/mortgage-calculator" },
  { src: "/portfolio/links-1.png", alt: "Links — Cover", caption: "Links — Minimal Link Hub", bgColor: "#22333b", href: "/portfolio/links" },
  { src: "/portfolio/iniesta-academy-preview.png", alt: "Iniesta Academy — Cover", caption: "Iniesta Academy — WooCommerce Multilingual", bgColor: "#1a1a1a", href: "/portfolio/iniestacademy" }
]}
        enableParallax
        parallaxMode="alternate"
        parallaxAmount={80}
        colors={{
          bg: "#0b0b0b",
          text: "#ffffff",
          textMuted: "#b3b3b3",
          mediaBg: "#111111",
          accentStrong: "#222222",
        }}
      />
    </main>
  );
}