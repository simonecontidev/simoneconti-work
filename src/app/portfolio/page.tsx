// src/app/portfolio/page.tsx
import { PROJECTS as RAW_PROJECTS } from "./_data";
import PortfolioReveal, {
  type PortfolioCardProject,
} from "../../../components/PortfolioReveal/PortfolioReveal";

export const metadata = { title: "Portfolio — Simone Conti" };

export default function PortfolioPage() {
  // 1) Filtra per categoria (tollerante)
  const filtered = RAW_PROJECTS.filter((p: any) => {
    const cat: string | undefined = p?.category ?? p?.type;
    if (!cat) return true;
    return ["featured", "webapp", "commercial"].includes(cat);
  });

  // 2) Mappa al formato minimale richiesto da PortfolioReveal
  const projects: PortfolioCardProject[] = filtered
    .map((p: any): PortfolioCardProject | null => {
      const slug: string | undefined = p?.slug;
      const title: string | undefined = p?.title;

      // Trova un'immagine “thumb”
      const pickImg = (): string | undefined => {
        if (typeof p?.img === "string") return p.img;
        if (typeof p?.image === "string") return p.image;
        if (Array.isArray(p?.images) && p.images.length > 0) {
          const first = p.images[0];
          if (typeof first === "string") return first;
          if (typeof first?.src === "string") return first.src;
        }
        return undefined;
      };

      const img = pickImg();
      if (!slug || !title || !img) return null; // scarta entry non valide

      return {
        slug,
        title,
        // Se `img` è già un percorso completo in /public/portfolio, lascialo così;
        // altrimenti, se è solo il nome file, PortfolioReveal fa `/portfolio/${img}`
        // quindi qui passiamo solo il nome file (senza prefisso) se è già relativo.
        img: img.startsWith("/portfolio/") ? img.replace("/portfolio/", "") : img,
        role: p?.role ?? p?.subtitle ?? p?.category ?? p?.type,
        bgColor: p?.bgColor,
      };
    })
    .filter(Boolean) as PortfolioCardProject[];

  return <PortfolioReveal projects={projects} />;
}