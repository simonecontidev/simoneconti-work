export type Project = {
  slug: string;
  title: string;
  role: string;
  img: string;      // file in /public/portfolio/
  size: "lg" | "sm";
};

export const PROJECTS: Project[] = [
  { slug: "pet-finder",  title: "Pet Finder",  role: "Frontend",             img: "project-1.jpg", size: "lg" },
  { slug: "tropify", title: "Tropify", role: "UI Motion + Frontend", img: "project-2.jpg", size: "sm" },
  { slug: "react-3d-portfolio",  title: "React 3D Portfolio",  role: "UI/UX + Frontend",     img: "project-3.jpg", size: "lg" },
  { slug: "job-filtering-board",   title: "VJob Filtering Board",   role: "Frontend",             img: "project-4.jpg", size: "sm" },
  { slug: "planet-portfolio", title: "Planet Portfolio", role: "UI/UX",                img: "project-5.jpg", size: "lg" },
  { slug: "taskboard",  title: "Taskboard",  role: "Frontend",             img: "project-6.jpg", size: "lg" },
  { slug: "split-the-bill",   title: "Split the Bill",   role: "UI/UX + Frontend",     img: "project-7.jpg", size: "lg" },
  { slug: "mortgage-calculator",   title: "Mortgage Calculator",   role: "Frontend",             img: "project-8.jpg", size: "lg" },
  { slug: "social-profile",  title: "Social Profile",  role: "UI/UX",                img: "project-9.jpg", size: "sm" },
];