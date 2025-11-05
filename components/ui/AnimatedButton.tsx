'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

type AnimatedButtonProps = {
  label: string;
  hoverLabel?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
};

export default function AnimatedButton({
  label,
  hoverLabel,
  onClick,
  size = 'md',
}: AnimatedButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const sizes = {
    sm: 'h-10 w-40 text-xs',
    md: 'h-12 w-48 text-sm',
    lg: 'h-14 w-56 text-base',
  }[size];

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      aria-label={hovered && hoverLabel ? hoverLabel : label}
      className={`
        group relative inline-flex items-center justify-center overflow-hidden
        rounded-full border border-[var(--accent)] backdrop-blur-md ${sizes}
        transition-all duration-700 ease-[cubic-bezier(0.65,0,0.076,1)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
        ${isDark ? 'bg-white text-black' : 'bg-black text-white'}
      `}
    >
      {/* Espansione del cerchio colorato */}
      <motion.span
        animate={{
          width: hovered ? 'calc(100% - 8px)' : '40px',
        }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.076, 1] }}
        className={`
          absolute left-1 top-1 h-[calc(100%-8px)] rounded-full
          ${isDark ? 'bg-black' : 'bg-white'}
        `}
      />

      {/* Icona (freccia invertita) */}
      <motion.span
        animate={{
          x: hovered ? 8 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.076, 1] }}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <ChevronRightRoundedIcon
          fontSize="small"
          sx={{
            color: isDark ? '#fff' : '#000',
            transition: 'color 0.3s ease',
          }}
        />
      </motion.span>

      {/* Testo */}
      <div className="relative mx-auto font-[var(--font-martian)] font-semibold">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={hovered && hoverLabel ? 'hover' : 'base'}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.076, 1] }}
            className={`
              block transition-colors duration-500
              ${isDark ? 'text-black group-hover:text-white' : 'text-white group-hover:text-black'}
            `}
          >
            {hovered && hoverLabel ? hoverLabel : label}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  );
}