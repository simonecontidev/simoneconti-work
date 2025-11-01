import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import GsapSetup from "@/components/GsapSetup";

import "@fontsource-variable/martian-mono";
import "@fontsource-variable/bricolage-grotesque";

export const metadata: Metadata = {
  title: "Simone Conti — Frontend Developer",
  description: "Portfolio built with Next.js, Tailwind, GSAP, and Lenis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GsapSetup />
        <SmoothScroll>
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}