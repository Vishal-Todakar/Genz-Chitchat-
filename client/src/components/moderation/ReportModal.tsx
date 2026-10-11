import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

interface ReportModalProps {
  onReport: (reason: string) => void;
}

const REPORT_REASONS = [
  { id: 'harassment', label: '🚫 Harassment or bullying', icon: '🚫' },
  { id: 'nudity', label: '🔞 Nudity or sexual content', icon: '🔞' },
  { id: 'spam', label: '📧 Spam or advertising', icon: '📧' },
  { id: 'underage', label: '👶 Underage user', icon: '👶' },
  { id: 'threats', label: '⚠️ Threats or violence', icon: '⚠️' },
  { id: 'other', label: '📝 Other', icon: '📝' },
];

export default function ReportModal({ onReport }: ReportModalProps) {
  const { showReportModal, setShowReportModal } = useUIStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!showReportModal) return null;

  const handleSubmit = () => {
    if (!selected) return;
    onReport(selected);
    setSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setSubmitted(false);
      setSelected(null);
    }, 2000);
  };

  const handleClose = () => {
    setShowReportModal(false);
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-label="Report user"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-3xl glass p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Report Submitted</h3>
              <p className="mt-2 text-sm text-slate-400">Thank you for helping keep our community safe.</p>
            </motion.div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Report User
                </h3>
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close report modal"
                >
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="mb-4 text-sm text-slate-400">What's the reason for this report?</p>

              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelected(reason.id)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-200
                      ${selected === reason.id
                        ? 'bg-primary-600/30 border border-primary-500 text-white'
                        : 'border border-slate-700 text-slate-300 hover:bg-white/5 hover:border-slate-600'
                      }`}
                    aria-pressed={selected === reason.id}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 rounded-full border border-slate-600 py-2.5 text-sm text-slate-400
                    hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selected}
                  className="flex-1 rounded-full bg-danger py-2.5 text-sm font-semibold text-white
                    hover:bg-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Submit Report
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
