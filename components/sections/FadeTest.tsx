"use client";
import { useEffect, useRef } from "react";
import { useGsapRegister } from "@/lib/gsap";

export default function FadeTest() {
  const { gsap } = useGsapRegister();
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!boxRef.current) return;
    gsap.fromTo(
      boxRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, [gsap]);

  return (
    <div ref={boxRef} className="mt-12 rounded-xl border p-6">
      <p className="text-zinc-700">Scroll-triggered fade & slide test.</p>
    </div>
  );
}