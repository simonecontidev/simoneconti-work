"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useGsapRegister } from "@/lib/gsap";
import { PROJECTS } from "@/app/portfolio/_data";
import { useRouter } from "next/navigation";
import { navigateProjectWithTransition } from "@/lib/pageTransition";

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

      const split = new SplitType(ref.current, { types: "lines", tagName: "span" });

      split.lines.forEach((line: HTMLElement) => {
        const wrapper = document.createElement("div");
        wrapper.className = "line";
        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      const targets = ref.current.querySelectorAll(".line > span");
      const { gsap } = await import("gsap");
      gsap.set(targets, { y: fromY, opacity: 0 });

      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        stagger: 0.02,
        scrollTrigger: { trigger: ref.current, start, once: true },
      });

      return () => {
        try {
          (split as any)?.revert?.();
        } catch {}
      };
    })();
  }, [fromY, start]);

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

  // ---- DATI DINAMICI ----
  const currentIndex = useMemo(
    () => Math.max(0, PROJECTS.findIndex((p) => p.slug === slug)),
    [slug]
  );
  const project = PROJECTS[currentIndex] ?? PROJECTS[0];
  const nextIndex = (currentIndex + 1) % PROJECTS.length;
  const prevIndex = (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
  const next = PROJECTS[nextIndex];
  const prev = PROJECTS[prevIndex];

  // images: supporta sia {src,alt} che string
  const heroSrc =
    typeof project.images?.[0] === "string" ? project.images?.[0] : project.images?.[0]?.src;
  const heroAlt =
    typeof project.images?.[0] === "string" ? "" : project.images?.[0]?.alt ?? project.title;
  const gallery = (project.images ?? []).slice(1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // ---- REVEAL DINAMICI ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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
    const titleEl = root.querySelector<HTMLElement>(".pj-title");
    if (titleEl) {
      gsap.set(titleEl, { y: 24, opacity: 0 });
      gsap.to(titleEl, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: titleEl, start: "top 85%" },
      });
    }

    // date/period reveal
    const dateEl = root.querySelector<HTMLElement>(".pj-date");
    if (dateEl) {
      gsap.set(dateEl, { y: 16, opacity: 0 });
      gsap.to(dateEl, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: dateEl, start: "top 90%" },
      });
    }
  }, [project, gsap, ScrollTrigger]);

  // ---- SCROLL DOWN → NEXT (bidirezionale VT + GSAP) ----
  useEffect(() => {
    if (!nextRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: nextRef.current,
      start: "top 45%",
      once: true,
      onEnter: async () => {
        if (pushedRef.current) return;
        pushedRef.current = true;

        await navigateProjectWithTransition({
          router,
          href: `/portfolio/${next.slug}`,
          overlay: overlayRef.current,
          nextTitle: next.title,
        });
      },
    });

    return () => trigger.kill();
  }, [router, next.slug, next.title, gsap, ScrollTrigger]);

  // ---- SCROLL UP in cima → PREV (wheel / touch / key) ----
  useEffect(() => {
    let touchStartY = 0;
    let wheelCooldown = false;
    let touchCooldown = false;

    const goPrev = async () => {
      if (pushedRef.current) return;
      if (document.body.style.overflow === "hidden") return; // già in transizione
      pushedRef.current = true;

      await navigateProjectWithTransition({
        router,
        href: `/portfolio/${prev.slug}`,
        overlay: overlayRef.current,
        nextTitle: prev.title, // mostrato nell’overlay
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (wheelCooldown) return;
      // deltaY < 0 = scroll up; siamo in cima?
      if (window.scrollY <= 0 && e.deltaY < -30) {
        wheelCooldown = true;
        goPrev();
        setTimeout(() => (wheelCooldown = false), 1000);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (window.scrollY > 0) return;
      if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home") {
        goPrev();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchCooldown) return;
      if (window.scrollY > 0) return;
      const y = e.touches && e.touches[0] ? e.touches[0].clientY : touchStartY;
      const dy = y - touchStartY; // >0 = swipe down (scroll up)
      if (dy > 60) {
        touchCooldown = true;
        goPrev();
        setTimeout(() => (touchCooldown = false), 1200);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [router, prev.slug, prev.title]);

  return (
    <div ref={rootRef} className="min-h-screen" data-page>
      {/* Overlay transizione – dinamico nel titolo (escluso da VT) */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[999] opacity-0 pointer-events-none bg-gradient-to-t from-black via-neutral-950 to-black vt-static"
        aria-hidden="true"
      >
        <div className="absolute inset-0 grid place-items-center">
          <h2 className="transition-title text-white text-4xl md:text-6xl font-semibold tracking-tight">
            {next?.title}
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6">
        {/* Titolo + periodo */}
        <div className="mx-auto mb-6 mt-8 w-full max-w-2xl text-center">
          <h1 className="pj-title text-5xl font-semibold md:text-6xl">
            {project.title}
          </h1>
        </div>
        {project.period && (
          <div className="pj-date mb-12 text-center text-white/70">{project.period}</div>
        )}

        {/* Hero */}
        {heroSrc && (
          <div className="pj-img-clip relative mb-12 h-[60vh] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={heroSrc}
              alt={heroAlt || ""}
              fill
              className="object-cover"
              priority
              // style={{ viewTransitionName: `hero-${project.slug}` }}
            />
          </div>
        )}

        {/* Copy */}
        {(project.copy ?? []).map((paragraph, i) => (
          <div key={`copy-${i}`} className="pj-copy mx-auto my-24 max-w-3xl">
            <CopyReveal
              className="text-lg md:text-xl text-white"
              start={i === 0 ? "top 80%" : "top 85%"}
              fromY={i === 0 ? 36 : 40}
            >
              {paragraph}
            </CopyReveal>
          </div>
        ))}

        {/* Gallery */}
        {gallery.map((img, i) => {
          const src = typeof img === "string" ? img : img.src;
          const alt = typeof img === "string" ? "" : img.alt ?? project.title;
          const isLast = i === gallery.length - 1;
          return (
            <div
              key={`g-${i}`}
              className={`pj-img-clip-st relative mb-${isLast ? "16" : "10"} h-[55vh] overflow-hidden rounded-2xl border border-white/10`}
            >
              <Image src={src} alt={alt} fill className="object-cover" />
            </div>
          );
        })}

        {/* Next project teaser */}
        <div ref={nextRef} className="relative mx-auto mb-24 mt-28 max-w-2xl text-center">
          <div className="mb-2 text-sm text-white/60">Next project</div>
          <a
            href={`/portfolio/${next.slug}`}
            className="inline-block text-2xl font-medium hover:underline"
            onClick={(e) => {
              e.preventDefault();
              if (pushedRef.current) return;
              pushedRef.current = true;
              navigateProjectWithTransition({
                router,
                href: `/portfolio/${next.slug}`,
                overlay: overlayRef.current,
                nextTitle: next.title,
              });
            }}
          >
            {next.title}
          </a>
          <div className="mt-6 text-xs text-white/50">
            Continua a scorrere per aprire →
          </div>
        </div>
      </div>
    </div>
  );
}