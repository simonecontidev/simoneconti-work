"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP as _useGSAP } from "@gsap/react";

let registered = false;

export function useGsapRegister() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, Flip);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export const useGSAP = _useGSAP;