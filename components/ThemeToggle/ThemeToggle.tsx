'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // helper
  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    // Tailwind dark mode
    root.classList.toggle('dark', dark);
    // CSS custom properties (HorizontalShowcase & co.)
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    // salva preferenza
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    // Notifica eventuali listener
    window.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));
    // Se c'è GSAP ScrollTrigger, rinfresca i calcoli
    try {
      // @ts-ignore
      const ST = window?.ScrollTrigger;
      if (ST?.refresh) ST.refresh();
    } catch {}
  };

useEffect(() => {
  setMounted(true);
  try {
    // Leggi lo stato "già applicato" da layout.tsx
    const root = document.documentElement;
    const currentIsDark = root.classList.contains('dark');
    setIsDark(currentIsDark);

    // Reagisci ai cambi di sistema SOLO se l'utente non ha scelto nulla
    const hasUserChoice = !!localStorage.getItem('theme');
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (e: MediaQueryListEvent) => {
      if (!hasUserChoice) {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };
    // Safari compat
    if (mql.addEventListener) mql.addEventListener('change', onSystemChange);
    else mql.addListener(onSystemChange);

    // Sync tra TAB diverse (se cambi su un'altra scheda)
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'theme' && ev.newValue) {
        const nextDark = ev.newValue === 'dark';
        setIsDark(nextDark);
        applyTheme(nextDark);
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onSystemChange);
      else mql.removeListener(onSystemChange);
      window.removeEventListener('storage', onStorage);
    };
  } catch {}
}, []);

  const toggle = () => {
    try {
      const overlay = document.getElementById('theme-overlay');
      if (overlay) overlay.style.opacity = '0.3'; // breve flash morbido

      const next = !isDark;
      setIsDark(next);
      applyTheme(next);

      if (overlay) setTimeout(() => (overlay.style.opacity = '0'), 200);
    } catch {}
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        group relative flex h-10 w-10 items-center justify-center rounded-full
        border transition-all backdrop-blur
        focus-visible:outline-none focus-visible:ring-2
        ${isDark
          ? 'bg-white text-black border-black/10 hover:shadow-md'
          : 'bg-black text-white border-white/10 hover:shadow-md'}
        hover:scale-105 active:scale-95
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
            aria-hidden
          >
            <LightModeRoundedIcon fontSize="small" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
            aria-hidden
          >
            <DarkModeRoundedIcon fontSize="small" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}