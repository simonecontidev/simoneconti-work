import Copy from "@/components/Copy/Copy";


export const metadata = { title: "About — Simone Conti" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Copy>
        <h1 className="text-3xl font-semibold">About</h1>
      </Copy>
      <Copy delay={0.15}>
        <p className="mt-4 text-zinc-400">
          I craft fast, animated web experiences using Next.js, GSAP, and Tailwind.
        </p>
      </Copy>
    </main>
  );
}