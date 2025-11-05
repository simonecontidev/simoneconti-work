"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useGsapRegister } from "@/lib/gsap";
import { PROJECTS } from "@/app/portfolio/_data";
import { useRouter } from "next/navigation";
import { navigateProjectWithTransition } from "@/lib/pageTransition";

import AnimatedButton from "../../../../components/ui/AnimatedButton";
function AnimatedViewLive({
  href,
  className = "",
  label = "View Live",
}: {
  href?: string;
  className?: string;
  label?: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "group relative inline-flex items-center justify-center rounded-full px-6 py-3",
        "font-medium tracking-tight",
        "border border-white/15 text-white/90",
        "transition-[transform,box-shadow] duration-300",
        "hover:shadow-[0_10px_40px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        className,
      ].join(" ")}
    >
      <span className="relative z-10">{label}</span>
      {/* underline sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </span>
      {/* subtle border glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-colors"
      />
    </a>
  );
}

/* ---------------- Split/Reveal utility for paragraphs ---------------- */
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

/* ----------------------- Project Page ----------------------- */
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
  const extraCopy = (project.copy ?? []).slice(1); // la [0] la usiamo nella colonna sticky

  const rootRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // ---- REVEAL DINAMICI ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // image clip reveal
    const clips = Array.from(root.querySelectorAll<HTMLElement>(".pj-img-clip, .pj-img-clip-st"));
    clips.forEach((el, i) => {
      gsap.set(el, { clipPath: "inset(18% 18% 18% 18% round 24px)" });
      gsap.to(el, {
        clipPath: "inset(0% 0% 0% 0% round 24px)",
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: i === 0 ? "top 65%" : "top 75%" },
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
        nextTitle: prev.title,
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (wheelCooldown) return;
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

  /* --------- build stream: interleave immagini e copy sul lato destro --------- */
  const rightStream = useMemo(() => {
    // alterna: img, testo, img, testo... dove disponibile
    const items: Array<
      | { type: "image"; src: string; alt: string }
      | { type: "copy"; text: string; key: string }
    > = [];

    const max = Math.max(gallery.length, extraCopy.length);
    for (let i = 0; i < max; i++) {
      if (gallery[i]) {
        const gi = gallery[i] as any;
        items.push({
          type: "image",
          src: typeof gi === "string" ? gi : gi.src,
          alt:
            typeof gi === "string"
              ? project.title
              : gi.alt ?? project.title,
        });
      }
      if (extraCopy[i]) {
        items.push({ type: "copy", text: extraCopy[i]!, key: `c-${i}` });
      }
    }
    return items;
  }, [gallery, extraCopy, project.title]);

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

      {/* Header: Title + Period + Hero */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-6 mt-8 w-full max-w-3xl text-center">
          <h1 className="pj-title text-5xl font-semibold md:text-6xl">{project.title}</h1>
        </div>
        {project.period && (
          <div className="pj-date mb-12 text-center text-white/70">{project.period}</div>
        )}

        {heroSrc && (
          <div className="pj-img-clip relative mb-16 h-[65vh] overflow-hidden rounded-2xl border border-white/10">
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
      </div>

      {/* Body: 2 colonne — sinistra sticky (descrizione + tech + CTA), destra stream scroll */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-12">
        {/* LEFT (sticky) */}
        <aside className="md:col-span-4 md:sticky md:top-24 md:self-start">
          {/* Descrizione larga */}
          {project.copy?.[0] && (
            <CopyReveal className="text-base md:text-lg leading-relaxed text-white/90">
              {project.copy[0]}
            </CopyReveal>
          )}

          {/* Tech stack */}
          {Array.isArray((project as any).tech) && (project as any).tech.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 text-sm uppercase tracking-widest text-white/40">Tech</div>
              <ul className="flex flex-wrap gap-2">
                {(project as any).tech.map((t: string, i: number) => (
                  <li
                    key={`tech-${i}`}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/80"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* View Live */}
          {(project as any).liveUrl && (
  <div className="mt-8">
    <AnimatedButton
      label="View Live"
      hoverLabel="Open"
      size="md"
      onClick={() => {
        const url = (project as any).liveUrl as string;
        // nuova tab + rel per sicurezza
        window.open(url, "_blank", "noopener,noreferrer");
      }}
    />
  </div>
          )}
        </aside>

        {/* RIGHT (scrolling stream) */}
        <section className="md:col-span-8">
          <div className="flex flex-col gap-10">
            {rightStream.map((it, i) =>
              it.type === "image" ? (
                <div
                  key={`rs-img-${i}`}
                  className="pj-img-clip-st relative h-[55vh] overflow-hidden rounded-2xl border border-white/10"
                >
                  <Image src={it.src} alt={it.alt} fill className="object-cover" />
                </div>
              ) : (
                <CopyReveal
                  key={it.key}
                  className="text-base md:text-lg leading-relaxed text-white/85"
                  start="top 85%"
                  fromY={32}
                >
                  {it.text}
                </CopyReveal>
              )
            )}
          </div>

          {/* Next project teaser */}
          <div ref={nextRef} className="relative mx-auto mb-24 mt-28 max-w-xl text-center">
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
            <div className="mt-6 text-xs text-white/50">Continua a scorrere per aprire →</div>
          </div>
        </section>
      </div>
    </div>
  );
}