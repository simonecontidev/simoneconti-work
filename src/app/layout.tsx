// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Martian_Mono, Inter } from "next/font/google";
import Script from "next/script";

import Footer from "../../components/Footer/Footer";
import TopBar from "../../components/TopBar/TopBar";

import Nav from "../../components/Nav/Nav";


const martian = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Simone Conti — Creative Front-End Developer",
  description: "Portfolio built with Next.js, GSAP, and motion-driven design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Inizializza il tema prima del paint
  const initTheme = `
  (function () {
    try {
      var root = document.documentElement;
      var saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
      var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var next = saved || system;
      root.classList.toggle('dark', next === 'dark');
      root.setAttribute('data-theme', next);
    } catch (e) {}
  })();`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${martian.variable} ${inter.variable}`}
    >
      {/* Non è necessario definire <head>; Next lo gestisce con `metadata` o app/head.tsx */}

      <body suppressHydrationWarning >
        {/* Inietta lo script tema PRIMA dell'interattività per evitare flash */}
        <Script id="init-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: initTheme }} />

        <TopBar className="vt-static" />
        {children}
        <Footer className="vt-static" />

        {/* ✅ Overlay ora è DENTRO <body>, niente più hydration error */}
        <div
          id="theme-overlay"
          className="pointer-events-none fixed inset-0 opacity-0 transition-opacity duration-200"
          aria-hidden="true"
        />

        <Nav/>

      </body>
    </html>
  );
}