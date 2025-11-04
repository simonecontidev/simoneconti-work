import type { Metadata } from "next";
import "./globals.css";

import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import TopBar from "../../components/TopBar/TopBar";



export const metadata: Metadata = {
  title: "Simone Conti — Next.js Playground",
  description: "Clean baseline · Tailwind · GSAP · Lenis · Framer Motion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TopBar/>
        {children}
        <Nav />
        <Footer />
      </body>
    </html>
  );
}