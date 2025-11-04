"use client";
import Link from "next/link";
import useViewTransition from "../../hooks/useViewTransition";

export default function VTLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { navigateWithTransition } = useViewTransition();
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigateWithTransition(href);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}