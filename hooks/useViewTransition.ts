"use client";
import { useRouter } from "next/navigation";

function slideInOut() {
  document.documentElement.animate(
    [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.5)" }],
    { duration: 600, easing: "cubic-bezier(0.87, 0, 0.13, 1)", fill: "forwards", pseudoElement: "::view-transition-old(root)" }
  );
  document.documentElement.animate(
    [{ clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)" }],
    { duration: 600, easing: "cubic-bezier(0.87, 0, 0.13, 1)", fill: "forwards", pseudoElement: "::view-transition-new(root)" }
  );
}

export default function useViewTransition() {
  const router = useRouter();

  function navigateWithTransition(href: string, options?: { scroll?: boolean }) {
    const current = typeof window !== "undefined" ? window.location.pathname : "";
    if (current === href) return;

    const startVT = (document as unknown as {
  startViewTransition?: (cb: () => void) => void;
}).startViewTransition;

    const start = typeof startVT === "function" ? startVT.bind(document) : undefined;

if (start) {
  start(() => {
    router.push(href, options);
  });
  slideInOut();
} else {
  router.push(href, options);
}
  }

  const supported = typeof document !== "undefined" && "startViewTransition" in document;
  return { navigateWithTransition, supported, router };
}