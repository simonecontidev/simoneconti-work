"use client";

type AnimatedButtonProps = {
  label: string;
  route: string;
  onClick?: () => void;
};

export default function AnimatedButton({ label, route, onClick }: AnimatedButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative inline-flex h-12 w-48 items-center justify-start rounded-full bg-[rgba(242,237,230,0.75)] px-2 backdrop-blur-md"
    >
      {/* circle */}
      <span className="absolute left-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full bg-black transition-[width] duration-500 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:w-[calc(100%-12px)]" />
      {/* icon (chevron) */}
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:translate-x-3">
        →
      </span>
      {/* label */}
      <span className="relative mx-auto font-sans text-sm font-semibold text-neutral-700 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:text-white">
        {label}
      </span>
      {/* route (visually hidden, utile per a11y/debug) */}
      <span className="sr-only">{route}</span>
    </button>
  );
}