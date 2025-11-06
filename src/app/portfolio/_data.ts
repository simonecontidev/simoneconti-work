export type ProjectImage = {
  src: string;
  alt?: string;
};

export type Project = {
  slug: string;
  title: string;
  period?: string;
  excerpt?: string;
  images: ProjectImage[];
  copy?: string[];
  tech?: string[];
  liveUrl?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "3d-portfolio",
    title: "3D Portfolio",
    period: "2025",
    excerpt:
      "A Three.js-powered portfolio blending performance and motion design.",
    images: [
      { src: "/images/covers/3d-portfolio.jpg", alt: "3D Portfolio Hero" },
      { src: "/portfolio/3d-1.jpg" },
      { src: "/portfolio/3d-2.jpg" },
    ],
    copy: [
      "Built with React, Three.js, and GSAP to showcase advanced frontend architecture and interactive motion.",
      "Scene orchestration and scroll-linked animations maintain high performance and accessibility.",
    ],
    tech: ["React", "Three.js", "GSAP", "TypeScript"],
    liveUrl: "https://simoneconti.work/3d",
  },
  {
    slug: "tropify",
    title: "Tropify — Experiential Web",
    period: "2025",
    excerpt:
      "An experiential Next.js build mixing micro-interactions, subtle 3D and audio.",
    images: [
      { src: "/images/covers/tropify.jpg", alt: "Tropify Hero" },
      { src: "/portfolio/tropify-1.jpg" },
      { src: "/portfolio/tropify-2.jpg" },
    ],
    copy: [
      "Next.js App Router with fluid route transitions, no layout shifts, and rich motion design.",
      "Composable GSAP and WebAudio interactions for a sensory UX.",
    ],
    tech: ["Next.js", "TypeScript", "GSAP", "WebAudio"],
    liveUrl: "https://simoneconti.work/tropify",
  },
  {
    slug: "petfinder",
    title: "PetFinder",
    period: "2025",
    excerpt:
      "A clean Next.js CRUD app with search, filters, and optimistic UI.",
    images: [
      { src: "/images/covers/petfinder.jpg", alt: "PetFinder Hero" },
      { src: "/portfolio/petfinder-1.jpg" },
      { src: "/portfolio/petfinder-2.jpg" },
    ],
    copy: [
      "Built to demonstrate state management, data fetching, and accessibility in modern React apps.",
      "Includes server + client components, Zod validation, and robust error boundaries.",
    ],
    tech: ["Next.js", "TypeScript", "REST", "Zustand"],
    liveUrl: "https://simoneconti.work/petfinder",
  },
  {
    slug: "guava-bikes",
    title: "Guava Bikes — Shopify Components",
    period: "2025",
    excerpt:
      "Custom Shopify components and cart integrations focused on UX and performance.",
    images: [
      { src: "/images/covers/guava.jpg", alt: "Guava Bikes" },
      { src: "/portfolio/guava-1.jpg" },
      { src: "/portfolio/guava-2.jpg" },
    ],
    copy: [
      "Developed advanced cart integrations for Live Product Options, maintaining dynamic previews and persisted selections.",
      "Added market-based navigation logic without flicker, ensuring full accessibility and Liquid-only fallbacks.",
    ],
    tech: ["Shopify", "Liquid", "JavaScript"],
    liveUrl: "https://guavabikes.com",
  },
  {
    slug: "mikakus-shopify",
    title: "Mikakus — Shopify Slider & LPO",
    period: "2025",
    excerpt:
      "A high-touch Shopify slider with video backgrounds and GSAP animation.",
    images: [
      { src: "/images/covers/mikakus.jpg", alt: "Mikakus Slider" },
      { src: "/portfolio/mikakus-1.jpg" },
      { src: "/portfolio/mikakus-2.jpg" },
    ],
    copy: [
      "Custom slider component with video fallback and restart-on-slide logic.",
      "Seamless GSAP hover micro-interactions and deep links to product configurations.",
    ],
    tech: ["Shopify", "Liquid", "GSAP", "JS"],
    liveUrl: "https://mikakus.com",
  },
  {
    slug: "iniesta-academy",
    title: "Iniesta Academy — WooCommerce",
    period: "2024",
    excerpt:
      "WooCommerce site optimized for clarity, conversions, and maintainability.",
    images: [
      { src: "/images/covers/iniesta.jpg", alt: "Iniesta Academy" },
      { src: "/portfolio/iniesta-1.jpg" },
      { src: "/portfolio/iniesta-2.jpg" },
    ],
    copy: [
      "Built with ACF and custom templates for scalability and fast content editing.",
      "Emphasized clean structure, SEO performance, and conversion UX.",
    ],
    tech: ["WordPress", "WooCommerce", "ACF"],
    liveUrl: "https://iniesta-academy.example",
  },
  {
    slug: "taskboard",
    title: "Taskboard",
    period: "2025",
    excerpt:
      "A Trello-style board with complex drag-and-drop and persistent state.",
    images: [
      { src: "/images/covers/taskboard.jpg", alt: "Taskboard" },
      { src: "/portfolio/taskboard-1.jpg" },
    ],
    copy: [
      "Built with Next.js and dnd-kit for smooth drag-and-drop.",
      "Zustand selectors and local persistence ensure fast, fluid UX.",
    ],
    tech: ["Next.js", "TypeScript", "dnd-kit", "Zustand"],
    liveUrl: "https://simoneconti.work/taskboard",
  },
];