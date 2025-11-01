"use client";
import { useEffect, useRef } from "react";
import { useGsapRegister } from "@/lib/gsap";

export default function HomePage() {
  const { gsap, ScrollTrigger } = useGsapRegister();
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!boxRef.current) return;
    gsap.fromTo(
      boxRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: boxRef.current, start: "top 80%" },
      }
    );
  }, [gsap]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold">Simone Conti — Frontend Developer</h1>
      <p className="mt-4 text-zinc-500">Next.js • Tailwind • GSAP • Lenis</p>
      <div ref={boxRef} className="mt-12 rounded-xl border p-6">
        <p className="text-zinc-700">Scroll-triggered fade & slide test.</p>
      </div>
    </main>
  );
}