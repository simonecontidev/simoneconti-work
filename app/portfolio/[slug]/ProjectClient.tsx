"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGsapRegister } from "@/lib/gsap";

// ✅ mini componente locale: split linee + reveal
function CopyReveal({
  children,
  className = "",
  start = "top 80%",
  fromY = 36,
}: {
  children: React.ReactNode;
  className?: string;
  start?: string;
  fromY?: number;
}) {
  const { gsap, ScrollTrigger } = useGsapRegister();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // import dinamico per evitare problemi SSR
    (async () => {
      const SplitType = (await import("@/lib/SplitType")).default ?? (await import("@/lib/SplitType/index")).default;

      // 1) split per linee
      const split = new SplitType(ref.current, { types: "lines", tagName: "span" });

      // 2) wrappa ogni linea in un contenitore con clip-path
      split.lines.forEach((line: HTMLElement) => {
        const wrapper = document.createElement("div");
        wrapper.className = "line";
        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      // 3) stato iniziale + animazione on-scroll
      const lines = ref.current.querySelectorAll<HTMLElement>(".line span");
      gsap.set(lines, { y: fromY, willChange: "transform" });
      gsap.to(lines, {
        y: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.02,
        scrollTrigger: {
          trigger: ref.current,
          start,
          once: true,
        },
      });

      // cleanup
      return () => {
        try {
          if ((split as any)?.revert) (split as any).revert();
        } catch {}
      };
    })();
  }, [gsap, ScrollTrigger, start, fromY]);

  return (
    <div ref={ref} className={className}>
      {children}
      <style jsx global>{`
        .line {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default function ProjectClient({ slug }: { slug: string }) {
  const title = slug.replaceAll("-", " ");
  const { gsap } = useGsapRegister();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      // Titolo + data
      gsap.fromTo(".pj-title", { y: 100 }, { y: 0, duration: 1.2, ease: "power4.out", delay: 0.2 });
      gsap.fromTo(".pj-date",  { y: 100 }, { y: 0, duration: 1.2, ease: "power4.out", delay: 0.1 });

      // Prima immagine (on enter)
      gsap.set(".pj-img-clip", { clipPath: "polygon(0% 100%,100% 100%,100% 100%,0% 100%)" });
      gsap.to(".pj-img-clip",   { clipPath: "polygon(0% 100%,100% 100%,100% 0%,0% 0%)", duration: 1.2, ease: "power4.out", delay: 0.25 });

      // Immagini successive (on scroll)
      gsap.utils.toArray<HTMLElement>(".pj-img-clip-st").forEach((el) => {
        gsap.set(el, { clipPath: "polygon(0% 100%,100% 100%,100% 100%,0% 100%)" });
        gsap.to(el, {
          clipPath: "polygon(0% 100%,100% 100%,100% 0%,0% 0%)",
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 60%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [gsap]);

  return (
    <div ref={rootRef} className="bg-black text-white">
      <div className="mx-auto max-w-5xl px-6">
        {/* Title + date */}
        <div className="mx-auto mb-6 mt-8 w-full max-w-2xl text-center">
          <h1 className="pj-title text-5xl font-semibold md:text-6xl">{title}</h1>
        </div>
        <div className="pj-date mb-12 text-center text-white/70">2011 — 2017</div>

        {/* Hero image */}
        <div className="pj-img-clip relative mb-12 h-[60vh] overflow-hidden rounded-2xl border border-white/10">
          <Image src="/portfolio/project-1.jpg" alt="" fill className="object-cover" priority />
        </div>

        {/* Copy block 1 */}
        <div className="pj-copy mx-auto my-24 max-w-3xl">
          <CopyReveal className="text-lg md:text-xl text-white">
            Lorem ipsum dolor sit amet…
          </CopyReveal>
        </div>

        {/* Gallery */}
        <div className="pj-img-clip-st relative mb-10 h-[55vh] overflow-hidden rounded-2xl border border-white/10">
          <Image src="/portfolio/project-2.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="pj-img-clip-st relative mb-10 h-[55vh] overflow-hidden rounded-2xl border border-white/10">
          <Image src="/portfolio/project-3.jpg" alt="" fill className="object-cover" />
        </div>

        {/* Copy block 2 */}
        <div className="pj-copy mx-auto my-24 max-w-3xl">
          <CopyReveal className="text-lg md:text-xl" start="top 85%" fromY={40}>
            Mauris iaculis porttitor posuere…
          </CopyReveal>
        </div>

        <div className="pj-img-clip-st relative mb-10 h-[55vh] overflow-hidden rounded-2xl border border-white/10">
          <Image src="/portfolio/project-4.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="pj-img-clip-st relative mb-10 h-[55vh] overflow-hidden rounded-2xl border border-white/10">
          <Image src="/portfolio/project-5.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="pj-img-clip-st relative mb-16 h-[55vh] overflow-hidden rounded-2xl border border-white/10">
          <Image src="/portfolio/project-6.jpg" alt="" fill className="object-cover" />
        </div>

        {/* Next project */}
        <div className="mb-2 text-center text-sm text-white/60">Next Project</div>
        <div className="mx-auto mb-24 w-full max-w-2xl text-center">
          <a href="/portfolio/secure-vote" className="inline-block text-2xl font-medium hover:underline">
            Secure Vote
          </a>
        </div>
      </div>
    </div>
  );
}