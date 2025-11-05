"use client";
import Section from "../../ui/Section";

const ROW = "NEXT.JS · TAILWIND · GSAP · LENIS · UI/UX · SEO · E-COMMERCE · ";

export default function Marquee() {
  return (
    <Section className="border-y">
      
        <div className="overflow-hidden marquee-mask">
          <div className="flex gap-8 whitespace-nowrap animate-[marquee_20s_linear_infinite] will-change-transform">
            <span className="tracking-wider text-sm">{ROW.repeat(6)}</span>
            <span className="tracking-wider text-sm">{ROW.repeat(6)}</span>
          </div>
        </div>
    </Section>
  );
}