// components/ScrollShowcase/ScrollShowcase.tsx
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './ScrollShowcase.module.css';
import type { ScrollShowcaseProps } from './types';

declare global {
  interface Window { __scrollShowcaseLenis?: any }
}

export default function ScrollShowcase({
  hero,
  outro,
  services,
  aboutText,
  copyText,
  options,
}: ScrollShowcaseProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanupCtx: (() => void) | undefined;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const Lenis = (await import('lenis')).default;

      gsap.registerPlugin(ScrollTrigger);

      // Smooth (singleton, così non duplichi Lenis se monti più showcase)
      const enableSmooth = options?.enableSmooth ?? true;
      if (enableSmooth && !window.__scrollShowcaseLenis) {
        const lenis = new Lenis();
        const raf = (time: number) => {
          lenis.raf(time * 1000);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        lenis.on('scroll', ScrollTrigger.update);
        window.__scrollShowcaseLenis = lenis;
      }

      const ctx = gsap.context(() => {
        // TEXT REVEAL
        const texts = gsap.utils.toArray<HTMLElement>(`.${styles.ssAnimateText}`);
        texts.forEach((el) => {
          el.setAttribute('data-text', (el.textContent || '').trim());
          ScrollTrigger.create({
            trigger: el,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: 1,
            onUpdate: (self) => {
              const clipValue = Math.max(0, 100 - self.progress * 100);
              el.style.setProperty('--clip-value', `${clipValue}%`);
            },
          });
        });

        // SERVICES HEADERS MOVIMENTO ORIZZONTALE
        const headers = gsap.utils.toArray<HTMLElement>(`.${styles.ssServicesHeader}`);

        ScrollTrigger.create({
          trigger: `.${styles.ssServices}`,
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
          onUpdate: (self) => {
            if (headers.length < 3) return;
            gsap.set(headers[0], { x: `${100 - self.progress * 100}%` });
            gsap.set(headers[1], { x: `${-100 + self.progress * 100}%` });
            gsap.set(headers[2], { x: `${100 - self.progress * 100}%` });
          },
        });

        // PIN + SCALE
        ScrollTrigger.create({
          trigger: `.${styles.ssServices}`,
          start: 'top top',
          end: `+=${window.innerHeight * (options?.pinMultiplier ?? 2)}`,
          pin: true,
          scrub: 1,
          pinSpacing: false,
          onUpdate: (self) => {
            if (headers.length < 3) return;

            const bp = options?.breakpoint ?? 1000;
            const minScale = window.innerWidth <= bp
              ? (options?.minScaleMobile ?? 0.3)
              : (options?.minScale ?? 0.1);

            if (self.progress <= 0.5) {
              const yProgress = self.progress / 0.5;
              gsap.set(headers[0], { y: `${yProgress * 100}%`, scale: 1 });
              gsap.set(headers[2], { y: `${yProgress * -100}%`, scale: 1 });
            } else {
              gsap.set(headers[0], { y: '100%' });
              gsap.set(headers[2], { y: '-100%' });
              const scaleProgress = (self.progress - 0.5) / 0.5;
              const scale = 1 - scaleProgress * (1 - minScale);
              gsap.set(headers, { scale });
            }
          },
        });
      }, rootRef);

      cleanupCtx = () => ctx.revert();
    })();

    return () => {
      cleanupCtx?.();
      // non distruggiamo il singleton lenis: potrebbe servirti in altre sezioni
    };
  }, [options?.breakpoint, options?.minScale, options?.minScaleMobile, options?.pinMultiplier, options?.enableSmooth]);

  const trio = services.slice(0, 3); // garantisce 3 righe

  return (
    <div ref={rootRef} className={styles.ssRoot}>
      {/* HERO */}
      <section className={styles.ssHero}>
        <div className={styles.ssHeroMedia}>
          <Image src={hero.src} alt={hero.alt ?? 'Hero'} fill sizes="300px" priority />
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.ssAbout}>
        <h1 className={styles.ssAnimateText}>{aboutText}</h1>
      </section>

      {/* SERVICES (PINNED) */}
      <section className={styles.ssServices}>
        {trio.map((m, i) => (
          <div className={styles.ssServicesHeader} key={`${m.src}-${i}`}>
            <Image src={m.src} alt={m.alt ?? `Services ${i + 1}`} fill sizes="100vw" />
          </div>
        ))}
      </section>

      {/* COPY */}
      <section className={styles.ssServicesCopy}>
        <h1 className={styles.ssAnimateText}>{copyText}</h1>
      </section>

      {/* OUTRO */}
      <section className={styles.ssOutro}>
        <div className={styles.ssOutroMedia}>
          <Image src={outro.src} alt={outro.alt ?? 'Outro'} fill sizes="300px" />
        </div>
      </section>
    </div>
  );
}