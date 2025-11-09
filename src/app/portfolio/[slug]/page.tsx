// src/app/portfolio/[slug]/page.tsx
import ProjectClient from "./ProjectClient";
import { PROJECTS } from "../_data";

type Props = { params: Promise<{ slug: string }> };

// ✅ Necessario per output: "export" — pre-genera tutte le pagine
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

// ✅ Metadata: rispetta il tipo con Promise e usa titolo dal dataset se disponibile
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  const base = project?.title || slug.replace(/-/g, " ");
  return {
    title: `${base} — Portfolio — Simone Conti`,
  };
}

// ✅ Pagina: rispetta il tipo con Promise
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <ProjectClient slug={slug} />;
}