"use client";
import { useEffect, useRef } from "react";
import { useGsapRegister } from "@/lib/gsap";
import Container from "@/components/ui/Container";
import { H1 } from "@/components/ui/Heading";

export default function Hero() {
  const { gsap } = useGsapRegister();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" });
  }, [gsap]);

  return (
    <div className="pt-20">
      <Container>
        <div ref={ref}>
          <H1>Frontend Developer — Next.js, Tailwind, GSAP</H1>
          <p className="mt-4 text-zinc-500">Barcelona · Available for hire</p>
        </div>
      </Container>
    </div>
  );
}