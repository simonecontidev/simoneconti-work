import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Simone Conti — Next.js Playground",
  description: "Clean baseline · Tailwind · GSAP · Lenis · Framer Motion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}