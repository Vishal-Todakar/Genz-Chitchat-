import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

interface AgeGateProps {
  onVerified: () => void;
}

/**
 * Age gate modal — blocks access until user confirms 18+ and accepts terms.
 * Required by law for stranger chat platforms.
 */
export default function AgeGate({ onVerified }: AgeGateProps) {
  const { ageVerified, setAgeVerified } = useUIStore();

  if (ageVerified) return null;

  const handleConfirm = () => {
    setAgeVerified(true);
    onVerified();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Age verification"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-3xl glass p-8 text-center"
        >
          {/* Shield icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full
            bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/30">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Age Verification
          </h2>
          <p className="mb-6 text-sm text-slate-400 leading-relaxed">
            You must be <span className="font-semibold text-primary-400">18 years or older</span> to use Genz chitchat.
            By continuing, you confirm your age and agree to our{' '}
            <a href="/terms" className="text-primary-400 hover:text-primary-300 underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary-400 hover:text-primary-300 underline">Privacy Policy</a>.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              className="w-full rounded-full gradient-primary px-6 py-3.5 text-sm font-bold text-white
                shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50
                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
                focus:ring-offset-slate-900"
              aria-label="Confirm age 18 or older"
            >
              I am 18+ — Enter
            </button>
            <button
              onClick={() => window.location.href = 'https://www.google.com'}
              className="w-full rounded-full border border-slate-600 px-6 py-3 text-sm text-slate-400
                hover:bg-slate-800/50 transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="Leave site if under 18"
            >
              I am under 18 — Leave
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            🔒 We don't store your personal information
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
