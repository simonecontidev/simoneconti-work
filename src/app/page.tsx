"use client";
import WonJYou from "../../components/sections/HorizontalShowcase/HorizontalShowcase";

import ScrollShowcase from "../../components/sections/ScrollShowcase/ScrollShowcase";



export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center bg-black text-zinc-100">
      <h1>ciao</h1>
      <WonJYou
        images={[
          "/img-1.jpg","/img-2.jpg","/img-3.jpg","/img-4.jpg",
          "/img-5.jpg","/img-6.jpg","/img-7.jpg","/img-8.jpg",
        ]}
        slides={[
          { image: "/img-1.jpg", text: "Slide one text…" },
          { image: "/img-2.jpg", text: "Slide two text…" },
          { image: "/img-3.jpg", text: "Slide three text…" },
        ]}
        featuredIndex={3}
      />

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