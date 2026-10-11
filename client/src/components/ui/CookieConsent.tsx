import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

/** Cookie consent banner — GDPR-friendly, persisted to localStorage */
export default function CookieConsent() {
  const { cookieConsent, setCookieConsent } = useUIStore();

  if (cookieConsent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
        role="dialog"
        aria-label="Cookie consent"
      >
        <div className="mx-auto max-w-4xl rounded-2xl glass dark:glass border border-white/10 p-4 md:p-6 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600">
                🍪 We use essential cookies to make this app work. We don't track you or store
                personal data. By continuing, you agree to our{' '}
                <a href="/privacy" className="text-primary-400 hover:text-primary-300 underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setCookieConsent(true)}
                className="rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white
                  hover:bg-primary-500 transition-colors focus:outline-none focus:ring-2
                  focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Accept cookies"
              >
                Accept
              </button>
              <button
                onClick={() => setCookieConsent(true)}
                className="rounded-full border border-slate-600 px-6 py-2 text-sm text-slate-300
                  hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2
                  focus:ring-slate-400"
                aria-label="Decline optional cookies"
              >
                Essential Only
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
