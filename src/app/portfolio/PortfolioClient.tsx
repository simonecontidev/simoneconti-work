// src/app/portfolio/PortfolioClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import NextImage, { ImageProps } from "next/image";
import { PROJECTS } from "./_data";
import { useGsapRegister } from "@/lib/gsap";

// Tipo “Project” derivato dai dati
type Project = (typeof PROJECTS)[number];

/** Ritorna un path valido per <Image/> (root-relative) cercando nei vari campi. */
function getPrimaryImage(p: any): string | null {
  // 1) p.img (string)
  if (typeof p?.img === "string" && p.img.trim()) {
    return p.img.startsWith("/portfolio/") ? p.img : `/portfolio/${p.img}`;
  }
  // 2) p.image (string)
  if (typeof p?.image === "string" && p.image.trim()) {
    return p.image.startsWith("/portfolio/") ? p.image : `/portfolio/${p.image}`;
  }
  // 3) p.images[0] (string | {src})
  if (Array.isArray(p?.images) && p.images.length > 0) {
    const first = p.images[0];
    if (typeof first === "string" && first.trim()) {
      return first.startsWith("/portfolio/") ? first : `/portfolio/${first}`;
    }
    if (first && typeof first?.src === "string" && first.src.trim()) {
      return first.src.startsWith("/portfolio/") ? first.src : `/portfolio/${first.src}`;
    }
  }
  return null;
}

/** <Image/> con fallback automatico a /portfolio/placeholder.jpg se l’asset manca. */
function FallbackImage(props: Omit<ImageProps, "src"> & { src: string }) {
  const [src, setSrc] = useState(props.src);
  return (
    <NextImage
      {...props}
      src={src}
      onError={() => setSrc("/portfolio/placeholder.jpg")}
    />
  );
}

export default function PortfolioClient() {
  const { gsap } = useGsapRegister();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload immagini (usa la sorgente risolta)
  useEffect(() => {
    let alive = true;
    (async () => {
      const tasks = PROJECTS.map((p) => {
        const src = getPrimaryImage(p);
        if (!src) return Promise.resolve();
        return new Promise<void>((res) => {
          const img = new window.Image();
          img.onload = () => res();
          img.onerror = () => res();
          img.src = src;
        });
      });
      await Promise.all(tasks);
      if (alive) setIsLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !rootRef.current) return;

    const ctx = gsap.context(() => {
      // header
      gsap.fromTo(
        ".portfolio-header h1",
        { y: 64 },
        { y: 0, delay: 0.6, duration: 1.2, ease: "power4.out" }
      );

      const cols = gsap.utils.toArray<HTMLElement>(".p-col");

      // reveal colonne
      gsap.set(cols, {
        clipPath: "polygon(0 100%,100% 100%,100% 100%,0 100%)",
      });
      gsap.to(cols, {
        clipPath: "polygon(0 100%,100% 100%,100% 0%,0 0%)",
        delay: 0.8,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.08,
      });

      // stato iniziale overlays
      gsap.set(".p-title", { y: 0, opacity: 1 }); // titolo sempre visibile
      gsap.set(".p-role", { y: 12, opacity: 0 }); // role nascosto

      // hover handlers
      cols.forEach((col) => {
        const img = col.querySelector(".p-img") as HTMLElement | null;
        const role = col.querySelector(".p-role") as HTMLElement | null;

        col.addEventListener("mouseenter", () => {
          if (img) gsap.to(img, { scale: 1.15, duration: 1.2, ease: "power4.out" });
          if (role)
            gsap.to(role, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
              delay: 0.08,
            });
        });

        col.addEventListener("mouseleave", () => {
          if (img) gsap.to(img, { scale: 1, duration: 1.2, ease: "power4.out" });
          if (role)
            gsap.to(role, {
              y: 12,
              opacity: 0,
              duration: 0.5,
              ease: "power3.out",
            });
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [gsap, isLoaded]);

  // Filtra i progetti con immagine valida e spezzali in righe da 3
  const rows = useMemo(() => {
    const withImg = PROJECTS.filter((p) => !!getPrimaryImage(p));
    const out: Project[][] = [];
    for (let i = 0; i < withImg.length; i += 3) out.push(withImg.slice(i, i + 3));
    return out;
  }, []);

  return (
    <div ref={rootRef} className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 pb-40">
        <div className="portfolio-header mx-auto mt-8 mb-12 w/full max-w-2xl text-center">
          <h1 className="text-5xl font-semibold md:text-6xl">Portfolio</h1>
        </div>

        {isLoaded &&
          rows.map((group, idx) => (
            <div key={idx} className="mb-8 flex gap-8 max-md:flex-col">
              {group.map((p) => {
                const src = getPrimaryImage(p);
                if (!src) return null;
                return (
                  <Link
                    key={p.slug}
                    href={`/portfolio/${p.slug}/`} // trailing slash per export
                    className={[
                      "p-col group relative overflow-hidden rounded-2xl border border-white/10",
                      (p as any).size === "lg" ? "flex-[2]" : "flex-[1.25]",
                      "h-[380px] max-md:h-[300px]",
                    ].join(" ")}
                  >
                    <FallbackImage
                      src={src}
                      alt={p.title}
                      fill
                      className="p-img object-cover will-change-transform"
                      sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                      priority={idx < 1}
                    />

                    <div className="absolute left-4 bottom-4">
                      <div className="clip-mask">
                        {/* Mostra ruolo se c'è, altrimenti il titolo */}
                        <p className="p-title text-lg font-medium tracking-tight">
                          {(p as any).role ?? p.title}
                        </p>
                      </div>
                      {/* Seconda riga: titolo (o vuoto) */}
                      <p className="p-role mt-1 text-xs text-white/80">
                        {p.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
      </div>

      <style jsx global>{`
        .clip-mask {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
      `}</style>
    </div>
  );
}