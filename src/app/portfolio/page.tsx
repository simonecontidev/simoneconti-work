// src/app/portfolio/page.tsx
import { PROJECTS as RAW_PROJECTS } from "./_data";
import PortfolioReveal from "../../../components/PortfolioReveal/PortfolioReveal";

export const metadata = { title: "Portfolio — Simone Conti" };

export default function PortfolioPage() {
  // solo featured + webapp + commercial, ordinati
  const PROJECTS = RAW_PROJECTS.filter(
    (p) =>
      p.category === "featured" ||
      p.category === "webapp" ||
      p.category === "commercial"
  );

  return <PortfolioReveal projects={PROJECTS} />;
}