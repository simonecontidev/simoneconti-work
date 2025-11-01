// niente "use client"
import ProjectClient from "./ProjectClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `${slug.replaceAll("-", " ")} — Portfolio — Simone Conti` };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <ProjectClient slug={slug} />;
}