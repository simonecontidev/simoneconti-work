import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/TopBar";

import SmoothScroll from "@/components/SmoothScroll";
import GsapSetup from "@/components/GsapSetup";
import Footer from "@/components/Footer/Footer";

import SiteChrome from "@/components/SiteChrome";
import Nav from "@/components/Nav";




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
           <TopBar />
                  <SiteChrome>{children}
                    
                  </SiteChrome>
                  <Nav />
        </SmoothScroll>
          <Footer />
      </body>
    </html>
  );
}