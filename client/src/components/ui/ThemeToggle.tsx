import { useUIStore } from '../../store/uiStore';
import { motion } from 'framer-motion';

/** Dark/Light mode toggle with animated icon transition */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex h-10 items-center gap-2 rounded-full px-3 transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-amber-400/50 corner-glow-btn
        ${
          theme === 'dark'
            ? 'bg-amber-400/10 border border-amber-400/40 text-amber-300 hover:bg-amber-400/20 hover:border-amber-300'
            : 'bg-[#FAF4E6] border border-[#C5A059]/50 text-[#8C6623] hover:bg-[#F3EAD4] hover:border-[#B38D38]'
        }`}
      aria-label={`Switch to ${theme === 'dark' ? 'Old Money Cream' : 'Dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'Old Money Cream' : 'Dark'} mode`}
      id="theme-toggle-btn"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.6 }}
        animate={{ rotate: 0, scale: 1 }}
        exit={{ rotate: 90, scale: 0.6 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="flex items-center gap-1.5"
      >
        {theme === 'dark' ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
            </span>
            <svg className="h-4 w-4 text-amber-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-semibold tracking-wide text-amber-200 hidden sm:inline">
              Cream Mode
            </span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4 text-[#8C6623]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span className="text-xs font-semibold tracking-wide text-[#75551C] hidden sm:inline">
              Dark Mode
            </span>
          </>
        )}
      </motion.div>
    </button>
  );
}
