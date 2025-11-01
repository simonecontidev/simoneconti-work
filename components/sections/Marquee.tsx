"use client";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export default function Marquee() {
  // TODO: replace with template marquee (GSAP/auto-scroll)
  return (
    <Section className="border-y">
      <Container>
        <div className="whitespace-nowrap overflow-hidden">
          <div className="animate-[marquee_20s_linear_infinite] text-sm tracking-wider">
            NEXT.JS · TAILWIND · GSAP · LENIS · UI/UX · SEO · E-COMMERCE ·
          </div>
        </div>
      </Container>
    </Section>
  );
}