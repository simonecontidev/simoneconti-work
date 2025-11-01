"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  text: string;
  href?: string;
  className?: string;
  primaryColor?: string;        // colore layer inferiore
  rowHeight?: string;
  fontSize?: string;
  underline?: boolean;
};

export default function SlidingTextLink({
  text,
  href = "#",
  className = "",
  primaryColor = "#157aa9",
  rowHeight = "clamp(56px, 12vw, 140px)",
  fontSize = "calc(var(--rowH) * 0.857)",
  underline = true,
}: Props) {
  const chars = useMemo(() => [...text].map(c => (c === " " ? "\u00A0" : c)), [text]);

  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [underlineW, setUnderlineW] = useState<number | null>(null);
  const isCoarseRef = useRef(false);

  const recalc = () => {
    if (!measureRef.current) return;
    setUnderlineW(Math.ceil(measureRef.current.getBoundingClientRect().width));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      isCoarseRef.current = window.matchMedia("(pointer: coarse)").matches;
    }
    recalc();
    const ro = new ResizeObserver(recalc);
    if (rootRef.current) ro.observe(rootRef.current);
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    (document as any).fonts?.ready?.then?.(() => recalc());
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setIsTouchActive(false);
    };
    document.addEventListener("click", onDocClick, { capture: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onDocClick, { capture: true } as any);
    };
  }, [text, fontSize, rowHeight, underline]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isCoarseRef.current) return;
    e.preventDefault();
    setIsTouchActive(v => !v);
  };

  return (
    <a
      ref={rootRef}
      href={href}
      onClick={onClick}
      className={`stl ${isTouchActive ? "is-hovered" : ""} ${className}`}
      style={
        {
          ["--primary" as any]: primaryColor,
          ["--rowH" as any]: rowHeight,
          ["--fs" as any]: fontSize,
          ["--underline-h" as any]: "clamp(2px, calc(var(--rowH) * 0.02), 3px)",
          ["--underline-offset" as any]: "calc(var(--rowH) * 0.1)",
          ["--underline-w" as any]: underlineW ? `${underlineW}px` : "0px",
        } as React.CSSProperties
      }
    >
      {/* Top (bianco) — scorre su */}
      <span className="block block--top" aria-hidden="true">
        {chars.map((c, i) => (
          <span className="letter" style={{ ["--i" as any]: i }} key={`t-${i}`}>
            {c}
          </span>
        ))}
      </span>

      {/* Bottom (azzurro) — sale da sotto in sync */}
      <span className="block block--bottom" aria-hidden="true">
        {chars.map((c, i) => (
          <span className="letter" style={{ ["--i" as any]: i }} key={`b-${i}`}>
            {c}
          </span>
        ))}
      </span>

      {/* misuratore invisibile per underline dinamica */}
      <span ref={measureRef} aria-hidden="true" className="measure">
        {text}
      </span>

      <span className="sr-only">{text}</span>

      <style jsx>{`
        .stl{
          position: relative;
          display: inline-grid;
          grid-auto-rows: 1fr;
          align-items: end;
          text-decoration: none;
          font-size: var(--fs);
          line-height: var(--rowH);
          height: var(--rowH);
          color: #fff;
          overflow: hidden;
          outline: none;
          vertical-align: baseline;
        }

        /* Underline della larghezza della parola */
        .stl::after{
          content: "";
          position: absolute;
          left: 0;
          bottom: var(--underline-offset);
          width: 0;
          height: ${underline ? "var(--underline-h)" : "0"};
          background: var(--primary);
          transform-origin: left;
          transition: width 0.6s cubic-bezier(0.76,0,0.24,1);
          transition-delay: 0.3s;
          z-index: 0;
        }
        .stl:hover::after,
        .stl:focus-visible::after,
        .stl.is-hovered::after{
          width: var(--underline-w);
        }

        .block{ grid-area: 1/1; white-space: pre; pointer-events: none; }
        .block--top{ z-index: 2; color: currentColor; }
        .block--bottom{ z-index: 1; color: var(--primary); }

        .letter{
          display: inline-block;
          will-change: transform;
          transition: transform 0.6s cubic-bezier(0.76,0,0.24,1);
          transition-delay: calc(var(--i) * 30ms);
        }

        /* Stato iniziale */
        .block--top .letter{ transform: translateY(0%); }
        .block--bottom .letter{ transform: translateY(100%); } /* nascosto sotto */

        /* Hover/Focus/Tap: top sale, bottom entra su */
        .stl:hover .block--top .letter,
        .stl:focus-visible .block--top .letter,
        .stl.is-hovered .block--top .letter{
          transform: translateY(-100%);
        }
        .stl:hover .block--bottom .letter,
        .stl:focus-visible .block--bottom .letter,
        .stl.is-hovered .block--bottom .letter{
          transform: translateY(0%);
        }

        .measure{
          position: absolute;
          visibility: hidden;
          pointer-events: none;
          white-space: pre;
          inset: 0 auto auto 0;
          font: inherit;
          line-height: var(--rowH);
        }

        .stl:focus-visible{
          outline: 2px dashed var(--primary);
          outline-offset: 6px;
        }
        .sr-only{
          position:absolute;width:1px;height:1px;padding:0;margin:-1px;
          overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;
        }

        @media (prefers-reduced-motion: reduce){
          .letter, .stl::after{ transition: none !important; }
        }
      `}</style>
    </a>
  );
}