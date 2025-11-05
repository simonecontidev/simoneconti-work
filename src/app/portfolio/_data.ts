// src/app/portfolio/_data.ts

export type ProjectImage = {
  src: string;
  alt?: string;
};

export type Project = {
  slug: string;
  title: string;
  period?: string;            // es. "2011 — 2017"
  excerpt?: string;           // opzionale
  images: ProjectImage[];     // [0] sarà l'hero
  copy?: string[];            // blocchi di testo in ordine
};

export const PROJECTS: Project[] = [
  {
    slug: "wonjyou",
    title: "WonJYou — Horizontal Showcase",
    period: "2011 — 2017",
    excerpt: "A motion-driven horizontal showcase with GSAP + ScrollTrigger.",
    images: [
      { src: "/portfolio/project-1.jpg", alt: "Hero — WonJYou" },
      { src: "/portfolio/project-2.jpg", alt: "Detail 1 — WonJYou" },
      { src: "/portfolio/project-3.jpg", alt: "Detail 2 — WonJYou" },
      { src: "/portfolio/project-4.jpg", alt: "Detail 3 — WonJYou" },
      { src: "/portfolio/project-5.jpg", alt: "Detail 4 — WonJYou" },
      { src: "/portfolio/project-6.jpg", alt: "Detail 5 — WonJYou" },
    ],
    copy: [
      "A landscape in constant transition, where every shape, sound and shadow refuses to stay still.",
      "What seems stable begins to dissolve, and what fades returns again in rhythm with the scroll.",
    ],
  },
  {
    slug: "camille-mormal",
    title: "Camille Mormal — Slider",
    period: "2018 — 2024",
    images: [
      { src: "/portfolio/cm-hero.jpg", alt: "Hero — CM" },
      { src: "/portfolio/cm-2.jpg" },
      { src: "/portfolio/cm-3.jpg" },
    ],
    copy: [
      "A cinematic slider with letter-by-letter motion and parallax.",
      "Built for performance: lazy images, GPU transforms, minimal layout shifts.",
    ],
  },
  // ...altri progetti
];