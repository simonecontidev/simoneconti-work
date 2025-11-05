'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const root = document.documentElement;
      const stored = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const activeDark = stored ? stored === 'dark' : systemPrefersDark;
      setIsDark(activeDark);
      root.classList.toggle('dark', activeDark);
    } catch {}
  }, []);

const toggle = () => {
  try {
    const root = document.documentElement;
    const overlay = document.getElementById('theme-overlay');
    if (overlay) overlay.style.opacity = '0.3'; // breve flash morbido

    const next = !isDark;
    setIsDark(next);
    root.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');

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
          // Dark mode attiva → mostra SOLE per passare a light
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
          // Light mode attiva → mostra LUNA per passare a dark
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