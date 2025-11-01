"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGsapRegister } from "@/lib/gsap";

export default function GsapSetup() {
  const { ScrollTrigger } = useGsapRegister();
  const pathname = usePathname();

  useEffect(() => {
    // refresh ScrollTrigger on route change
    ScrollTrigger.refresh();
  }, [pathname, ScrollTrigger]);

  return null;
}