import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

const PLANS = [
  {
    id: '1h',
    name: '1 HOUR',
    price: 199,
    rate: '₹199/day',
    isBestValue: false,
  },
  {
    id: '3h',
    name: '3 HOURS',
    price: 299,
    rate: '₹299/day',
    isBestValue: true,
  },
  {
    id: '1d',
    name: '1 DAY',
    price: 399,
    rate: '₹399/day',
    isBestValue: false,
  },
];

export default function PremiumModal() {
  const {
    theme,
    showPremiumModal,
    setShowPremiumModal,
    setIsPremium,
    setFilterGender,
    setShowRazorpayModal,
  } = useUIStore();
  const [selectedPlanId, setSelectedPlanId] = useState('3h');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!showPremiumModal) return null;

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

  const handleRazorpayPayment = () => {
    // Open the authentic Razorpay checkout panel
    setShowRazorpayModal(true, selectedPlan);
  };

  const handleRestorePurchase = () => {
    setIsPremium(true, 'Restored Pass');
    setFilterGender('girl');
    setToastMessage('✅ Active purchase restored successfully!');
    setTimeout(() => {
      setToastMessage(null);
      setShowPremiumModal(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 360 }}
          className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl transition-all ${
            theme === 'dark'
              ? 'bg-[#111827] border border-white/10 text-white'
              : 'bg-white border border-stone-200 text-[#1B1612]'
          }`}
        >
          {/* Close button at top right */}
          <button
            onClick={() => setShowPremiumModal(false)}
            className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className="flex flex-col items-center text-center">
            {/* Crown Icon badge */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0F2FE] dark:bg-[#0369A1]/30 shadow-sm">
              <span className="text-2xl">👑</span>
            </div>

            {/* Headline */}
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Unlock female-only matches
            </h2>

            {/* Subtitle */}
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Premium lets you filter who you match with. One-time pass, no auto-renewal.
            </p>

            {/* 4 Feature Pills in a row */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5">
                <span>♀♂</span>
                <span>Gender</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5">
                <span>🌍</span>
                <span>Region</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5">
                <span className="text-amber-500">⚡</span>
                <span>Priority</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5">
                <span className="text-red-500">🚫</span>
                <span>No ads</span>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="mt-7 grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full items-end">
              {PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isTealBestValue = plan.isBestValue;

                return (
                  <div key={plan.id} className="relative flex flex-col">
                    {/* Best Value floating pill */}
                    {plan.isBestValue && (
                      <div className="absolute -top-3 left-0 right-0 z-10 flex justify-center">
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider text-[#064E3B] shadow-md uppercase border border-emerald-100">
                          BEST VALUE
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative flex flex-col items-center justify-center rounded-2xl p-3 sm:p-4 transition-all duration-200 text-center ${
                        isTealBestValue
                          ? 'bg-[#075956] text-white shadow-xl shadow-[#075956]/30 border-2 border-[#0D9488]'
                          : isSelected
                          ? 'border-2 border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 text-inherit shadow-md'
                          : theme === 'dark'
                          ? 'bg-[#1E293B] border border-white/10 text-slate-100 hover:border-white/20'
                          : 'bg-[#F8FAFC] border border-slate-200 text-[#1B1612] hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <span
                        className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-1 ${
                          isTealBestValue
                            ? 'text-emerald-100'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {plan.name}
                      </span>

                      <span
                        className={`text-xl sm:text-2xl font-black my-1 ${
                          isTealBestValue ? 'text-white' : 'text-inherit'
                        }`}
                      >
                        ₹{plan.price}
                      </span>

                      <span
                        className={`text-[10px] sm:text-[11px] font-medium ${
                          isTealBestValue
                            ? 'text-teal-200/80'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {plan.rate}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Razorpay Action CTA */}
            <div className="mt-7 w-full">
              <button
                type="button"
                onClick={handleRazorpayPayment}
                className="w-full rounded-full py-4 px-6 text-sm sm:text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #0284C7 0%, #075956 50%, #0D9488 100%)',
                  boxShadow: '0 8px 25px -4px rgba(7, 89, 86, 0.4)',
                }}
              >
                <span>Unlock for ₹{selectedPlan.price}</span>
              </button>
            </div>

            {/* Footer with Razorpay assurance and Restore purchase */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <span>🔒</span>
                <span>Secured by Razorpay</span>
              </span>
              <span>·</span>
              <button
                type="button"
                onClick={handleRestorePurchase}
                className="font-medium hover:underline text-slate-600 dark:text-slate-300 hover:text-primary-500"
              >
                Restore purchase
              </button>
            </div>

            {/* Toast feedback */}
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-xl bg-emerald-500 text-white text-xs font-semibold px-4 py-2 shadow-lg"
              >
                {toastMessage}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
