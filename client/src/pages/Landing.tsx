import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';
import ThemeToggle from '../components/ui/ThemeToggle';
import AgeGate from '../components/ui/AgeGate';
import { AdBanner } from '../components/ads/AdSlots';
import GenderModal from '../components/modals/GenderModal';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Matching',
    desc: 'Get paired with a random stranger in seconds. No signup, no hassle.',
  },
  {
    icon: '🏷️',
    title: 'Interest Tags',
    desc: 'Add interests to match with people who share your vibe.',
  },
  {
    icon: '🔒',
    title: 'Anonymous & Safe',
    desc: 'No personal data stored. Report tools and auto-moderation keep things clean.',
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    desc: 'Easy on the eyes with a beautiful dark theme. Light mode too!',
  },
  {
    icon: '💬',
    title: 'Real-time Chat',
    desc: 'Lightning-fast messaging with typing indicators and emoji support.',
  },
  {
    icon: '🎥',
    title: 'Video Chat',
    desc: 'Face-to-face conversations with one tap. Coming soon!',
    badge: 'Soon',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is Genz chitchat free?',
    a: 'Yes! Text chat is completely free. Premium features like ad-free experience and filters are available with a subscription.',
  },
  {
    q: 'Do I need an account?',
    a: 'No account needed to chat. Optional sign-in unlocks premium features.',
  },
  {
    q: 'Is my data safe?',
    a: 'We don\'t store chat messages. We use anonymous fingerprinting only for ban enforcement. See our Privacy Policy.',
  },
  {
    q: 'What if someone is inappropriate?',
    a: 'Use the Report button in any chat. We auto-filter profanity and ban repeat offenders.',
  },
  {
    q: 'Can I choose who I talk to?',
    a: 'Add interest tags to be matched with similar people. Premium users get gender and country filters.',
  },
];

const SUGGESTED_TAGS = [
  'gaming', 'music', 'tech', 'anime', 'movies', 'travel', 'coding', 'fitness', 'chill'
];

export default function Landing() {
  const navigate = useNavigate();
  const { onlineCount, setInterests, setChatMode } = useChatStore();
  const {
    ageVerified,
    theme,
    showGenderModal,
    setShowGenderModal,
    setShowPremiumModal,
  } = useUIStore();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [pendingMode, setPendingMode] = useState<'text' | 'video'>('text');

  // Add one or multiple comma-separated tags
  const addTagValue = (raw: string) => {
    const parts = raw.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);
    const newTags = [...tags];
    for (const part of parts) {
      if (newTags.length < 5 && !newTags.includes(part)) {
        newTags.push(part);
      }
    }
    setTags(newTags);
    setTagInput('');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        addTagValue(tagInput);
      }
    }
  };

  const toggleSuggestedTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const commitTagsAndStart = (mode: 'text' | 'video') => {
    let finalTags = [...tags];
    if (tagInput.trim()) {
      const parts = tagInput.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);
      for (const part of parts) {
        if (finalTags.length < 5 && !finalTags.includes(part)) {
          finalTags.push(part);
        }
      }
      setTags(finalTags);
      setTagInput('');
    }

    setChatMode(mode);
    setInterests(finalTags);
    setPendingMode(mode);

    if (!ageVerified) {
      setShowAgeGate(true);
      return;
    }

    // Always ask gender before entering chat if not chosen or prompt on start
    setShowGenderModal(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-400 ${
      theme === 'dark' ? 'bg-[#0a0f1d] text-slate-100' : 'bg-[#F6F1E7] text-[#1B1612]'
    }`}>
      {/* Age Gate Modal */}
      {showAgeGate && (
        <AgeGate
          onVerified={() => {
            setShowAgeGate(false);
            setChatMode(pendingMode);
            setInterests(tags);
            setShowGenderModal(true);
          }}
        />
      )}

      {/* Gender Selection Modal */}
      {showGenderModal && (
        <GenderModal
          onProceed={() => {
            setShowGenderModal(false);
            navigate('/chat');
          }}
          onCancel={() => setShowGenderModal(false)}
        />
      )}

      {/* ===== HEADER ===== */}
      <header className={`fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 ${
        theme === 'dark' ? 'glass border-white/10' : 'bg-[#FAF6EE]/90 border-[#E5DDC7] shadow-sm backdrop-blur-md'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary-500/20">
                <span className="text-lg">💬</span>
              </div>
              <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Genz chitchat
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Online counter */}
              <div className={`hidden sm:flex items-center gap-2 rounded-full px-4 py-1.5 ${
                theme === 'dark' ? 'glass' : 'bg-[#FFFDF9] border border-[#E5DDC7] shadow-sm'
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-[#6B5E4F]'}`}>
                  <strong className="text-success">{onlineCount.toLocaleString()}</strong> online
                </span>
              </div>

              {/* Female Only Premium Pill Button */}
              <button
                type="button"
                onClick={() => setShowPremiumModal(true)}
                className={`hidden md:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all hover:scale-105 active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 hover:bg-amber-400/20'
                    : 'bg-[#FAF4E6] border-[#C5A059]/60 text-[#8C6623] hover:bg-[#F3EAD4]'
                }`}
                title="Unlock female-only matches"
              >
                <span>♀</span>
                <span>Female only</span>
                <span className="font-extrabold text-amber-500">Premium</span>
                <span>🔒</span>
              </button>

              {/* Theme toggle glow button on upper right corner */}
              <ThemeToggle />

              <button
                onClick={() => commitTagsAndStart('text')}
                className="rounded-full gradient-primary px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white
                  shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50
                  transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient orbs */}
        <div className={`absolute top-20 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${
          theme === 'dark' ? 'bg-primary-600/20' : 'bg-[#C5A059]/25'
        }`} />
        <div className={`absolute top-40 right-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
          theme === 'dark' ? 'bg-accent-500/15' : 'bg-[#D4AF37]/20'
        }`} />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs mb-6 ${
              theme === 'dark' ? 'glass text-slate-300' : 'bg-[#FFFDF9] border border-[#E5DDC7] text-[#6B5E4F] shadow-sm'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
              </span>
              {onlineCount.toLocaleString()} people chatting right now
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className={`text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-balance ${
              theme === 'dark' ? 'text-white' : 'text-[#1B1612]'
            }`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Meet strangers.
            <br />
            <span className="gradient-text">Make connections.</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className={`mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-balance ${
              theme === 'dark' ? 'text-slate-400' : 'text-[#6B5E4F]'
            }`}
          >
            Anonymous, instant, and safe. Chat with random people from around the world.
            No sign-up required — just vibe.
          </motion.p>

          {/* ===== ENHANCED INTEREST TAGS SECTION ===== */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="mt-8 max-w-lg mx-auto">
            <div className={`rounded-2xl p-4 transition-all duration-300 ${
              theme === 'dark' ? 'glass' : 'bg-[#FFFDF9] border border-[#E2D8C3] shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-xs font-medium text-left ${
                  theme === 'dark' ? 'text-slate-400' : 'text-[#7A6E5E]'
                }`}>
                  Add interests (optional) — match with like-minded people
                </label>
                <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-[#9A8B78]'}`}>
                  {tags.length}/5 tags
                </span>
              </div>

              {/* Active tag chips */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-primary-600/30 border border-primary-500/40 text-primary-300'
                          : 'bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#8C6623]'
                      }`}
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 rounded-full hover:bg-black/10 px-1 transition-colors"
                        aria-label={`Remove tag ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input bar with + Add button */}
              <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-all ${
                theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-black/5 border-[#E2D8C3]'
              }`}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length >= 5 ? 'Max 5 tags reached' : 'Type an interest (e.g. gaming, music)...'}
                  disabled={tags.length >= 5}
                  className={`w-full bg-transparent text-sm outline-none disabled:opacity-50 ${
                    theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-[#1B1612] placeholder-stone-400'
                  }`}
                  aria-label="Add interest tags"
                />
                <button
                  type="button"
                  onClick={() => tagInput.trim() && addTagValue(tagInput)}
                  disabled={!tagInput.trim() || tags.length >= 5}
                  className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    tagInput.trim() && tags.length < 5
                      ? 'gradient-primary text-white shadow-sm hover:scale-105 active:scale-95'
                      : 'opacity-40 cursor-not-allowed bg-slate-700/40 text-slate-400'
                  }`}
                >
                  + Add
                </button>
              </div>

              {/* Quick-select suggested tags */}
              <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 text-left">
                <span className={`block text-[11px] mb-1.5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-[#7A6E5E]'
                }`}>
                  Popular interests:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TAGS.map((tag) => {
                    const isSelected = tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleSuggestedTag(tag)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-full transition-all border ${
                          isSelected
                            ? 'gradient-primary text-white border-transparent'
                            : theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                            : 'bg-white border-[#E5DDC7] text-[#7A6E5E] hover:border-[#C5A059]'
                        }`}
                      >
                        {isSelected ? `✓ #${tag}` : `+ #${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons: Text Chat and Video Chat */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => commitTagsAndStart('text')}
              className="w-full sm:w-auto rounded-full gradient-primary px-10 py-4 text-base font-bold text-white
                shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50
                transition-all duration-300 hover:scale-105 active:scale-95
                animate-pulse-glow"
              id="start-chatting-cta"
            >
              💬 Start Chatting — It's Free
            </button>
            <button
              onClick={() => commitTagsAndStart('video')}
              className={`w-full sm:w-auto rounded-full px-10 py-4 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 border flex items-center justify-center gap-2 ${
                theme === 'dark'
                  ? 'border-accent-500/50 bg-accent-500/10 text-accent-300 hover:bg-accent-500/20 shadow-lg shadow-accent-500/20'
                  : 'border-[#C5A059] bg-[#FAF4E6] text-[#8C6623] hover:bg-[#F3EAD4] shadow-md shadow-[#C5A059]/20'
              }`}
              id="start-video-chat-cta"
            >
              <span>🎥 Start Video Chat</span>
            </button>
          </motion.div>

          {/* Ad banner */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="mt-12 max-w-2xl mx-auto">
            <AdBanner />
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 px-4" id="features">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Why <span className="gradient-text">Genz chitchat</span>?
            </h2>
            <p className={`mt-3 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B5E4F]'}`}>Built for the next generation of conversations</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`group relative rounded-2xl p-6 transition-all duration-300 cursor-default gradient-border ${
                  theme === 'dark' ? 'glass hover:bg-white/10' : 'bg-[#FFFDF9] border border-[#E2D8C3] shadow-md hover:shadow-lg'
                }`}
              >
                {f.badge && (
                  <span className="absolute top-4 right-4 rounded-full bg-accent-500/20 border border-accent-500/30
                    px-2.5 py-0.5 text-[10px] font-semibold text-accent-400 uppercase tracking-wider">
                    {f.badge}
                  </span>
                )}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl
                  bg-gradient-to-br from-primary-600/20 to-accent-500/20 text-2xl
                  group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className={`mb-2 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B5E4F]'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 px-4" id="faq">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full rounded-2xl p-5 text-left transition-all duration-200 ${
                    theme === 'dark' ? 'glass hover:bg-white/10' : 'bg-[#FFFDF9] border border-[#E2D8C3] hover:border-[#C5A059] shadow-sm'
                  }`}
                  aria-expanded={openFaq === i}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium pr-4 ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`}>{faq.q}</span>
                    <svg
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-[#7A6E5E]'
                      } ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {openFaq === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-3 text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B5E4F]'}`}
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={`border-t py-12 px-4 transition-colors duration-300 ${
        theme === 'dark' ? 'border-slate-800' : 'border-[#E2D8C3] bg-[#FAF5EB]'
      }`}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <span className="text-sm">💬</span>
              </div>
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Genz chitchat
              </span>
            </div>

            <nav className={`flex flex-wrap items-center justify-center gap-6 text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-[#6B5E4F]'
            }`}>
              <a href="/terms" className="hover:text-primary-500 transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-primary-500 transition-colors">Privacy</a>
              <a href="/safety" className="hover:text-primary-500 transition-colors">Safety Tips</a>
              <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
              <a href="#faq" className="hover:text-primary-500 transition-colors">FAQ</a>
            </nav>

            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-[#8C7E6C]'}`}>
              © {new Date().getFullYear()} Genz chitchat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
