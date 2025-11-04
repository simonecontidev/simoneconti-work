'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './WonJYou.module.css';

export default function WonJYou() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lenis: any;

    const setup = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const Lenis = (await import('lenis')).default;

      gsap.registerPlugin(ScrollTrigger);

      // Smooth scroll
      lenis = new Lenis();
      const raf = (time: number) => {
        lenis.raf(time * 1000);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
      lenis.on('scroll', ScrollTrigger.update);

      const ctx = gsap.context(() => {
        // Text reveal
        const texts = gsap.utils.toArray<HTMLElement>(`.${styles.wjAnimateText}`);
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

        // Headers slide in/out horizontally while approaching pin
        const headers = gsap.utils.toArray<HTMLElement>(`.${styles.wjServicesHeader}`);

        ScrollTrigger.create({
          trigger: `.${styles.wjServices}`,
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

        // Pin section and scale/y translate
        ScrollTrigger.create({
          trigger: `.${styles.wjServices}`,
          start: 'top top',
          end: `+=${window.innerHeight * 2}`,
          pin: true,
          scrub: 1,
          pinSpacing: false,
          onUpdate: (self) => {
            if (headers.length < 3) return;

            if (self.progress <= 0.5) {
              const yProgress = self.progress / 0.5;
              gsap.set(headers[0], { y: `${yProgress * 100}%`, scale: 1 });
              gsap.set(headers[2], { y: `${yProgress * -100}%`, scale: 1 });
            } else {
              gsap.set(headers[0], { y: '100%' });
              gsap.set(headers[2], { y: '-100%' });

              const scaleProgress = (self.progress - 0.5) / 0.5;
              const minScale = window.innerWidth <= 1000 ? 0.3 : 0.1;
              const scale = 1 - scaleProgress * (1 - minScale);
              gsap.set(headers, { scale });
            }
          },
        });
      }, rootRef);

      return () => {
        ctx.revert();
        ScrollTrigger.killAll();
      };
    };

    let cleanup: (() => void) | undefined;
    setup().then((fn) => {
      cleanup = fn;
    });

    return () => {
      if (cleanup) cleanup();
      try {
        lenis?.destroy?.();
      } catch {
        // no-op
      }
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.wjRoot}>
      {/* HERO */}
      <section className={styles.wjHero}>
        <div className={styles.wjHeroImg}>
          <Image src="/hero.jpg" alt="Hero" fill priority sizes="300px" />
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.wjAbout}>
        <h1 className={styles.wjAnimateText}>
          A space for work shaped with clarity and intention. Each project
          follows a simple path from thought to form, from form to function.
        </h1>
      </section>

      {/* SERVICES (pinned) */}
      <section className={styles.wjServices}>
        <div className={styles.wjServicesHeader}>
          <Image src="/whatido.svg" alt="What I do" fill sizes="100vw" />
        </div>
        <div className={styles.wjServicesHeader}>
          <Image src="/whatido.svg" alt="What I do" fill sizes="100vw" />
        </div>
        <div className={styles.wjServicesHeader}>
          <Image src="/whatido.svg" alt="What I do" fill sizes="100vw" />
        </div>
      </section>

      {/* COPY AFTER PIN */}
      <section className={styles.wjServicesCopy}>
        <h1 className={styles.wjAnimateText}>
          I create websites and digital experiences that value clarity above excess.
          Through minimal form and precise detail, I aim to build work that lasts and
          offers a quiet sense of order.
        </h1>
      </section>

      {/* OUTRO */}
      <section className={styles.wjOutro}>
        <div className={styles.wjOutroImg}>
          <Image src="/outro.jpg" alt="Outro" fill sizes="300px" />
        </div>
      </section>
    </div>
  );
}