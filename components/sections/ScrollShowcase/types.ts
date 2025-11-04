// components/ScrollShowcase/types.ts
export type Media = { src: string; alt?: string };

export interface ScrollShowcaseProps {
  hero: Media;                 // immagine iniziale
  outro: Media;                // immagine finale
  services: [Media, Media, Media] | Media[]; // 3 righe (svg/png), consigliato 3
  aboutText: string;           // testo sezione "about"
  copyText: string;            // testo dopo il pin
  options?: {
    minScale?: number;         // scale minima durante il pin (desktop default 0.1)
    minScaleMobile?: number;   // scale minima su mobile (default 0.3)
    breakpoint?: number;       // px per considerare "mobile" (default 1000)
    pinMultiplier?: number;    // durata pin in altezza viewport (default 2)
    enableSmooth?: boolean;    // abilita Lenis interno (default true)
  };
}