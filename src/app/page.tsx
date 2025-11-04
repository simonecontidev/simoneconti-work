"use client";
import dynamic from "next/dynamic";
import type { HorizontalShowcaseProps } from "../../components/sections/HorizontalShowcase/HorizontalShowcase.tsx"
import ScrollShowcase from "../../components/sections/ScrollShowcase/ScrollShowcase";

const HorizontalShowcase = dynamic(() => import("../../components/sections/HorizontalShowcase/HorizontalShowcase"), { ssr: false });


const images = [
  "/img-1.jpg","/img-2.jpg","/img-3.jpg","/img-4.jpg","/img-5.jpg","/img-6.jpg",
  "/img-7.jpg","/img-8.jpg","/img-9.jpg","/img-10.jpg","/img-11.jpg","/img-12.jpg","/img-13.jpg",
];


const slides: HorizontalShowcaseProps["slides"] = [
  { image: "/img-1.jpg", text: "A landscape in constant transition..." },
  { image: "/img-2.jpg", text: "The rhythm of motion carries us forward..." },
];

export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center bg-black text-zinc-100">
      <h1>ciao</h1>
      <HorizontalShowcase images={images} slides={slides} featuredIndex={6} />

      <ScrollShowcase
      hero={{ src: '/hero.jpg', alt: 'Studio hero' }}
      outro={{ src: '/outro.jpg', alt: 'Studio outro' }}
      services={[
        { src: '/whatido.svg', alt: 'What I do 1' },
        { src: '/whatido.svg', alt: 'What I do 2' },
        { src: '/whatido.svg', alt: 'What I do 3' },
      ]}
      aboutText={`A space for work shaped with clarity and intention. Each project follows
a simple path from thought to form, from form to function.`}
      copyText={`I create websites and digital experiences that value clarity above excess.
Through minimal form and precise detail, I aim to build work that lasts and offers a quiet sense of order.`}
      options={{
        minScale: 0.12,
        minScaleMobile: 0.32,
        breakpoint: 1000,
        pinMultiplier: 2,
        enableSmooth: true,
      }}
    />
    </main>
  );
}