"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { gsap } from "gsap";

/**
 * Uscita sincronizzata + ViewTransition nativa + Entrata overlay GSAP.
 */
export async function navigateProjectWithTransition(opts: {
  router: AppRouterInstance;
  href: string;
  overlay: HTMLDivElement | null;
  nextTitle: string;
}) {
  const { router, href, overlay, nextTitle } = opts;

  // 1) Blocca scroll e dissolvi la pagina corrente (solo il contenuto con data-page)
  const body = document.body;
  const prevOverflow = body.style.overflow;
  body.style.overflow = "hidden";

  const exitTl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  exitTl
    .to("[data-page]", { opacity: 0.85, duration: 0.25 })
    .to("[data-page]", { y: -12, duration: 0.35 }, "<");

  // 2) startViewTransition nativo (fallback se non disponibile)
  const start = (cb: () => void) => {
    // @ts-ignore
    if (!document.startViewTransition) return cb();
    // @ts-ignore
    return document.startViewTransition(cb);
  };

  const vt = start(() => {
    router.push(href);
  });

  // 3) Overlay “cinematico” in entrata con titolo del prossimo progetto
  const showOverlay = () => {
    if (!overlay) return;
    const titleEl = overlay.querySelector(".transition-title") as HTMLElement | null;
    if (titleEl) titleEl.textContent = nextTitle;

    gsap.set(overlay, {
      yPercent: 100,
      opacity: 1,
      pointerEvents: "auto",
    });

    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
    tl.to(overlay, { yPercent: 0, duration: 1.3 })
      .fromTo(
        titleEl,
        { opacity: 0, letterSpacing: "0.1em", y: 40 },
        { opacity: 1, y: 0, letterSpacing: "0em", duration: 1.15 },
        "-=0.85"
      )
      .to({}, { duration: 0.2 }); // micro pausa
    return tl;
  };

  // 4) Coordina il timing con VT
  if (vt?.ready) {
    await vt.ready;
    showOverlay();
    await vt.updateCallbackDone?.catch(() => {});
  } else {
    showOverlay();
  }

  // 5) Ripristina scroll (la nuova pagina prende il controllo)
  setTimeout(() => {
    body.style.overflow = prevOverflow;
  }, 450);
}