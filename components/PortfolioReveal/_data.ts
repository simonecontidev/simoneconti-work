export type Project = {
  slug: string;
  title: string;
  role: string;      // breve descrizione/stack
  img: string;       // nome file immagine dentro /public/portfolio
  bgColor?: string;  // opzionale: colore overlay quando entra in viewport
};

export const PROJECTS: Project[] = [
  // --- WordPress / Shopify ---
  {
    slug: "iniesta-academy",
    title: "Iniesta Academy",
    role: "WordPress + WooCommerce",
    img: "iniesta.jpg",
    bgColor: "#1a1a1a",
  },
  {
    slug: "guava",
    title: "Guava",
    role: "Shopify — custom component",
    img: "guava.jpg",
    bgColor: "#0f2027",
  },
  {
    slug: "mikakus",
    title: "Mikakus",
    role: "Shopify — Liquid component",
    img: "mikakus.jpg",
    bgColor: "#2b1b1b",
  },

  // --- Next.js / React / Three.js ---
  {
    slug: "petfinder",
    title: "PetFinder",
    role: "Next.js app",
    img: "petfinder.jpg",
    bgColor: "#1d1e26",
  },
  {
    slug: "tropify",
    title: "Tropify",
    role: "Next.js — audio visuals",
    img: "tropify.jpg",
    bgColor: "#132d2a",
  },
  {
    slug: "3d-portfolio",
    title: "3D Portfolio",
    role: "Three.js + React",
    img: "3dportfolio.jpg",
    bgColor: "#101820",
  },
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator",
    role: "React — finance UI",
    img: "mortgage.jpg",
    bgColor: "#1a1423",
  },
  {
    slug: "split-the-bill",
    title: "Split The Bill",
    role: "React — utilities",
    img: "splitbill.jpg",
    bgColor: "#1f1b24",
  },
  {
    slug: "job-filtering-board",
    title: "Job Filtering Board",
    role: "Next.js — filters",
    img: "jobboard.jpg",
    bgColor: "#14213d",
  },
  {
    slug: "taskboard",
    title: "Taskboard",
    role: "Next.js — Kanban",
    img: "taskboard.jpg",
    bgColor: "#1b2a41",
  },
  {
    slug: "link-tree",
    title: "Link Tree",
    role: "Next.js — profile hub",
    img: "linktree.jpg",
    bgColor: "#22333b",
  },
  {
    slug: "taskflow",
    title: "Taskflow",
    role: "React — flows",
    img: "taskflow.jpg",
    bgColor: "#1a2f2a",
  },
];