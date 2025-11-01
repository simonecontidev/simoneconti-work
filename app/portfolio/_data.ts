export type Project = {
  slug: string;
  title: string;
  role: string;
  img: string;      // file in /public/portfolio/
  size: "lg" | "sm";
};

export const PROJECTS: Project[] = [
  { slug: "urban-oasis",  title: "Urban Oasis",  role: "Frontend",             img: "project-1.jpg", size: "lg" },
  { slug: "smart-living", title: "Smart Living", role: "UI Motion + Frontend", img: "project-2.jpg", size: "sm" },
  { slug: "eco-fashion",  title: "Eco Fashion",  role: "UI/UX + Frontend",     img: "project-3.jpg", size: "lg" },
  { slug: "vr-fitness",   title: "VR Fitness",   role: "Frontend",             img: "project-4.jpg", size: "sm" },
  { slug: "clean-energy", title: "Clean Energy", role: "UI/UX",                img: "project-5.jpg", size: "lg" },
  { slug: "ar-learning",  title: "AR Learning",  role: "Frontend",             img: "project-6.jpg", size: "lg" },
  { slug: "green-pack",   title: "Green Pack",   role: "UI/UX + Frontend",     img: "project-7.jpg", size: "lg" },
  { slug: "drone-post",   title: "Drone Post",   role: "Frontend",             img: "project-8.jpg", size: "lg" },
  { slug: "secure-vote",  title: "Secure Vote",  role: "UI/UX",                img: "project-9.jpg", size: "sm" },
];