import "./globals.css";
import type { Metadata } from "next";
import { Martian_Mono, Fraunces } from 'next/font/google'



import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import TopBar from "../../components/TopBar/TopBar";

const martian = Martian_Mono({
  subsets: ['latin'],
  variable: '--font-martian',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Simone Conti — Creative Front-End Developer",
  description: "Portfolio built with Next.js, GSAP, and motion-driven design.",
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${martian.variable} ${fraunces.variable}`}>
            <head>
      </head>
      <body className="bg-background text-dark">
                
        <TopBar/>
        {children}
        <Nav />
        <Footer />
      </body>
      <div id="theme-overlay" className="pointer-events-none fixed inset-0 opacity-0 transition-opacity duration-200" />
    </html>
  );
}