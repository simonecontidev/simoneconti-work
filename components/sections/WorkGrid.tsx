"use client";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Link from "next/link";

const projects = [
  { slug: "project-one", title: "Project One", tag: "Frontend" },
  { slug: "project-two", title: "Project Two", tag: "UI/UX" },
  { slug: "project-three", title: "Project Three", tag: "Animation" },
];

export default function WorkGrid() {
  return (
    <Section>
      <Container>
        <h2 className="text-2xl font-semibold">Selected Work</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => (
            <Link key={p.slug} href={`/portfolio/${p.slug}`} className="group rounded-xl border p-5 hover:shadow-md">
              <div className="aspect-video rounded-md bg-zinc-100 group-hover:bg-zinc-200" />
              <div className="mt-4 flex items-center justify-between">
                <span className="font-medium">{p.title}</span>
                <span className="text-xs text-zinc-500">{p.tag}</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}