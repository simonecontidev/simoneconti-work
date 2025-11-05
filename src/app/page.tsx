// app/page.tsx (o app/portfolio/page.tsx)
"use client";
import HorizontalShowcase from "../../components/sections/HorizontalShowcase/HorizontalShowcase";
import ScrollShowcase from "../../components/sections/ScrollShowcase/ScrollShowcase";
import SliderHero from "../../components/SliderHero/SliderHero";
import ScrollImageReveal from "../../components/ScrollImageReveal/ScrollImageReveal";
import HomeTextRevealSection from "../../components/HomeTextRevealSection/HomeTextRevealSection";

export default function Home() {
  // 👉 qui definisci i progetti
  const projects = [
    { src: "/projects/iniesta.jpg", alt: "Iniesta Academy", caption: "WordPress + WooCommerce", bgColor: "#1a1a1a" },
    { src: "/projects/guava.jpg", alt: "Guava", caption: "Shopify — custom component", bgColor: "#0f2027" },
    { src: "/projects/mikakus.jpg", alt: "Mikakus", caption: "Shopify Liquid component", bgColor: "#2b1b1b" },

    { src: "/projects/petfinder.jpg", alt: "PetFinder", caption: "Next.js app", bgColor: "#1d1e26" },
    { src: "/projects/tropify.jpg", alt: "Tropify", caption: "Next.js — audio visuals", bgColor: "#132d2a" },
    { src: "/projects/3dportfolio.jpg", alt: "3D Portfolio", caption: "Three.js + React", bgColor: "#101820" },

    { src: "/projects/mortgage.jpg", alt: "Mortgage Calculator", caption: "React — finance UI", bgColor: "#1a1423" },
    { src: "/projects/splitbill.jpg", alt: "Split The Bill", caption: "React — utilities", bgColor: "#1f1b24" },
    { src: "/projects/jobboard.jpg", alt: "Job Filtering Board", caption: "Next.js — filters", bgColor: "#14213d" },

    { src: "/projects/taskboard.jpg", alt: "Taskboard", caption: "Next.js — Kanban", bgColor: "#1b2a41" },
    { src: "/projects/linktree.jpg", alt: "Link Tree", caption: "Next.js — profile hub", bgColor: "#22333b" },
    { src: "/projects/taskflow.jpg", alt: "Taskflow", caption: "React — flows", bgColor: "#1a2f2a" },
  ];

  return (
    <main className="min-h-dvh grid place-items-center bg-black text-zinc-100">
      <SliderHero
        mode="bleed"
        images={[
          "/assets/img1.jpg",
          "/assets/img2.jpg",
          "/assets/img3.jpg",
          "/assets/img4.jpg",
          "/assets/img5.jpg",
        ]}
        titles={["Pet Finder", "Tropify", "Split the Bill App", "Job App", "Taskflow"]}
      />

      <HorizontalShowcase
        images={[
          "/img-1.jpg","/img-2.jpg","/img-3.jpg","/img-4.jpg",
          "/img-5.jpg","/img-6.jpg","/img-7.jpg","/img-8.jpg",
        ]}
        slides={[
          { image: "/img-1.jpg", text: "Slide one text…" },
          { image: "/img-2.jpg", text: "Slide two text…" },
          { image: "/img-3.jpg", text: "Slide three text…" },
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
        options={{ minScale: 0.12, minScaleMobile: 0.32, breakpoint: 1000, pinMultiplier: 2, enableSmooth: true }}
      />


  <ScrollImageReveal
  theme="dark"
  items={[
    { src: "/img-1.jpg", alt: "Work 1", caption: "Neo Tropic 01", bgColor: "#faba4a" },
    { src: "/img-2.jpg", alt: "Work 2", caption: "Neo Tropic 02", bgColor: "#bb2a26" },
    { src: "/img-3.jpg", alt: "Work 3", caption: "Neo Tropic 03", bgColor: "#7e7d65" },
    { src: "/img-4.jpg", alt: "Work 4", caption: "Neo Tropic 04", bgColor: "#989682" },
    { src: "/img-5.jpg", alt: "Work 5", caption: "Neo Tropic 05", bgColor: "#22333b" },
    { src: "/img-6.jpg", alt: "Work 6", caption: "Neo Tropic 06", bgColor: "#1b2a41" },
  ]}
  enableParallax
  parallaxMode="alternate"
  parallaxAmount={80}
  parallaxDriftX={24}
/>


      <HomeTextRevealSection />
    </main>
  );
}