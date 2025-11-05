"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGsapRegister } from "@/lib/gsap";
import { PROJECTS } from "@/app/portfolio/_data";
import { useRouter } from "next/navigation";

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

    (async () => {
      const SplitType =
        (await import("@/lib/SplitType")).default ??
        (await import("../../../lib/SplitType/index")).default;

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
      gsap.set(ref.current.querySelectorAll(".line > span"), {
        y: fromY,
        opacity: 0,
      });

      gsap.to(ref.current.querySelectorAll(".line > span"), {
        y: 0,
        opacity: 1,
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
  }, [gsap, ScrollTrigger, fromY, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default function ProjectClient({ slug }: { slug: string }) {
  const { gsap, ScrollTrigger } = useGsapRegister();
  const router = useRouter();
  const pushedRef = useRef(false);

  // compute next project by slug (wrap-around)
  const currentIndex = Math.max(0, PROJECTS.findIndex((p) => p.slug === slug));
  const nextIndex = (currentIndex + 1) % PROJECTS.length;
  const next = PROJECTS[nextIndex];

  const rootRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // piccoli reveal/images clip già presenti (lasciati intatti)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const kills: Array<() => void> = [];

    // image clip reveal
    const clips = Array.from(root.querySelectorAll<HTMLElement>(".pj-img-clip"));
    clips.forEach((el) => {
      gsap.set(el, { clipPath: "inset(16% 16% 16% 16% round 24px)" });
      gsap.to(el, {
        clipPath: "inset(0% 0% 0% 0% round 24px)",
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 60%" },
      });
    });

    const clipsST = Array.from(root.querySelectorAll<HTMLElement>(".pj-img-clip-st"));
    clipsST.forEach((el) => {
      gsap.set(el, { clipPath: "inset(20% 20% 20% 20% round 24px)" });
      gsap.to(el, {
        clipPath: "inset(0% 0% 0% 0% round 24px)",
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 65%" },
      });
    });

    // title reveal
    const title = root.querySelector<HTMLElement>(".pj-title");
    if (title) {
      gsap.set(title, { y: 24, opacity: 0 });
      gsap.to(title, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: title, start: "top 85%" },
      });
    }

    // date reveal
    const date = root.querySelector<HTMLElement>(".pj-date");
    if (date) {
      gsap.set(date, { y: 16, opacity: 0 });
      gsap.to(date, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: date, start: "top 90%" },
      });
    }

    return () => kills.forEach((k) => k());
  }, [gsap, ScrollTrigger]);

   // *** SCROLL-TO-NAVIGATE LOGICA ***
  useEffect(() => {
    if (!nextRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: nextRef.current,
      start: "top 45%",
      once: true,
      onEnter: () => {
        if (pushedRef.current) return;
        pushedRef.current = true;

        const ov = overlayRef.current;
        if (ov) {
          const tl = gsap.timeline({
            defaults: { ease: "power4.inOut" },
            onComplete: () => router.push(`/portfolio/${next.slug}`),
          });

          // fade in overlay con leggero blur e gradient
          gsap.set(ov, {
            yPercent: 100,
            opacity: 1,
            filter: "blur(0px)",
            pointerEvents: "auto",
          });

          tl.to(ov, {
            yPercent: 0,
            duration: 1.25,
          })
            // testo che entra in scena
            .fromTo(
              ".transition-title",
              { opacity: 0, letterSpacing: "0.1em", y: 40 },
              {
                opacity: 1,
                y: 0,
                letterSpacing: "0em",
                duration: 1.1,
              },
              "-=0.8"
            )
            .to({}, { duration: 0.2 }); // piccola pausa prima del push
        } else {
          router.push(`/portfolio/${next.slug}`);
        }
      },
    });

    return () => trigger.kill();
  }, [gsap, ScrollTrigger, router, next.slug]);

  const title = PROJECTS[currentIndex]?.title ?? slug.replaceAll("-", " ");

  return (
    <div ref={rootRef} className="min-h-screen">
      {/* Route transition overlay */}
      <div
  ref={overlayRef}
  className="fixed inset-0 z-[999] opacity-0 pointer-events-none bg-black"
  aria-hidden="true"
>
  <div className="absolute inset-0 grid place-items-center">
    <h2 className="transition-title text-white text-4xl md:text-6xl font-semibold tracking-tight">
      {next?.title}
    </h2>
  </div>
</div>

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
            Altro testo di esempio…
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

        {/* Next project: scroll-to-navigate */}
        <div ref={nextRef} className="relative mx-auto mb-24 mt-28 max-w-2xl text-center">
          <div className="mb-2 text-sm text-white/60">Next project</div>
          <a
            href={`/portfolio/${next.slug}`}
            className="inline-block text-2xl font-medium hover:underline"
          >
            {next.title}
          </a>
          <div className="mt-6 text-xs text-white/50">Continua a scorrere per aprire →</div>
        </div>
      </div>
    </div>
  );
}