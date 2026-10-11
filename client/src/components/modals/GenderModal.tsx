import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

interface GenderModalProps {
  onProceed: () => void;
  onCancel?: () => void;
}

export default function GenderModal({ onProceed, onCancel }: GenderModalProps) {
  const {
    theme,
    userGender,
    setUserGender,
    setFilterGender,
    isPremium,
    setShowPremiumModal,
  } = useUIStore();

  const handleSelectGender = (gender: 'girl' | 'guy') => {
    setUserGender(gender);
  };

  const handleStartAnyone = () => {
    setFilterGender('anyone');
    onProceed();
  };

  const handleStartFemaleOnly = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setFilterGender('girl');
    onProceed();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl transition-all ${
            theme === 'dark'
              ? 'bg-[#131b2e] border border-white/10 text-white'
              : 'bg-[#FFFDF9] border border-[#E2D8C3] text-[#1B1612]'
          }`}
        >
          {/* Close button if onCancel provided */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          )}

          <div className="flex flex-col items-center text-center">
            {/* Top pill: Female only Premium 🔒 */}
            <button
              onClick={() => setShowPremiumModal(true)}
              className={`mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
                theme === 'dark'
                  ? 'bg-primary-950/50 border border-primary-500/40 text-primary-200 hover:border-primary-400'
                  : 'bg-[#FAF4E6] border border-[#C5A059]/50 text-[#8C6623] hover:border-[#B38D38] shadow-sm'
              }`}
            >
              <span>♀</span>
              <span>Female only</span>
              <span className="font-bold text-amber-500 dark:text-amber-400">Premium</span>
              <span>🔒</span>
            </button>

            {/* Speech bubble card */}
            <div
              className={`w-full rounded-2xl p-4 text-left font-medium text-base mb-5 shadow-sm transition-all ${
                theme === 'dark'
                  ? 'bg-[#1c2742] border border-white/10 text-slate-100'
                  : 'bg-white border border-[#E8DFC8] text-[#1B1612]'
              }`}
            >
              <span>Hey 👋 — are you a girl or a guy?</span>
            </div>

            {/* Gender choices */}
            <div className="flex w-full items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSelectGender('girl')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-sm font-semibold transition-all duration-200 border ${
                  userGender === 'girl'
                    ? 'border-pink-500 bg-pink-500/15 text-pink-400 ring-2 ring-pink-500/30 shadow-md'
                    : theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                    : 'border-[#E2D8C3] bg-white text-[#1B1612] hover:bg-[#F9F5EC] shadow-sm'
                }`}
              >
                <span className="text-xl">👩</span>
                <span>I'm a girl</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGender('guy')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-sm font-semibold transition-all duration-200 border ${
                  userGender === 'guy'
                    ? 'border-blue-500 bg-blue-500/15 text-blue-400 ring-2 ring-blue-500/30 shadow-md'
                    : theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                    : 'border-[#E2D8C3] bg-white text-[#1B1612] hover:bg-[#F9F5EC] shadow-sm'
                }`}
              >
                <span className="text-xl">👨</span>
                <span>I'm a guy</span>
              </button>
            </div>

            {/* Continue Actions */}
            {userGender ? (
              <div className="w-full space-y-2.5">
                <button
                  type="button"
                  onClick={handleStartAnyone}
                  className="w-full rounded-full gradient-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Start Matching (Free)
                </button>

                <button
                  type="button"
                  onClick={handleStartFemaleOnly}
                  className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    isPremium
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : theme === 'dark'
                      ? 'border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/15'
                      : 'border-[#C5A059] bg-[#FAF4E6] text-[#8C6623] hover:bg-[#F3EAD4]'
                  }`}
                >
                  <span>♀ Female-only Matches</span>
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] uppercase font-extrabold text-amber-400">
                    {isPremium ? 'Active' : 'Premium 🔒'}
                  </span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Please select your gender above to continue
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
