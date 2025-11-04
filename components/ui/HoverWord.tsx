"use client";

type HoverWordProps = {
  children: string;
  className?: string;
};

export default function HoverWord({ children, className = "" }: HoverWordProps) {
  return (
    <span className={`word-hover ${className}`}>
      <span aria-hidden="true">{children}</span>
      <span aria-hidden="true">{children}</span>
      <span className="sr-only">{children}</span>
    </span>
  );
}