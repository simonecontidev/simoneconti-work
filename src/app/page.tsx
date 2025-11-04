"use client";
import dynamic from "next/dynamic";
import type { HorizontalShowcaseProps } from "../../components/sections/HorizontalShowcase/HorizontalShowcase.tsx"

const HorizontalShowcase = dynamic(() => import("../../components/sections/HorizontalShowcase/HorizontalShowcase"), { ssr: false });


const images = [
  "/img-1.jpg","/img-2.jpg","/img-3.jpg","/img-4.jpg","/img-5.jpg","/img-6.jpg",
  "/img-7.jpg","/img-8.jpg","/img-9.jpg","/img-10.jpg","/img-11.jpg","/img-12.jpg","/img-13.jpg",
];


const slides: WonJYouProps["slides"] = [
  { image: "/img-1.jpg", text: "A landscape in constant transition..." },
  { image: "/img-2.jpg", text: "The rhythm of motion carries us forward..." },
];

export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center bg-black text-zinc-100">
      <h1>ciao</h1>
      <HorizontalShowcase images={images} slides={slides} featuredIndex={6} />
    </main>
  );
}