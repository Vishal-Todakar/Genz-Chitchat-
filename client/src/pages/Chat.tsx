import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';
import { useSocket } from '../hooks/useSocket';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import SafetyBanner from '../components/moderation/SafetyBanner';
import ReportModal from '../components/moderation/ReportModal';
import { AdSidebar, AdInterstitial } from '../components/ads/AdSlots';
import ThemeToggle from '../components/ui/ThemeToggle';
import AgeGate from '../components/ui/AgeGate';
import VideoChat from '../components/video/VideoChat';

export default function Chat() {
  const navigate = useNavigate();
  const {
    ageVerified,
    theme,
    isPremium,
    setShowPremiumModal,
    filterGender,
    showInterstitialAd,
    setShowInterstitialAd,
    setShowReportModal,
  } = useUIStore();
  const {
    status,
    messages,
    isPartnerTyping,
    sharedInterests,
    interests,
    rateLimited,
    chatMode,
    setChatMode,
    partnerGender,
  } = useChatStore();
  const { findMatch, sendMessage, sendTyping, skip, report } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  // Auto-find match when entering the page
  useEffect(() => {
    if (ageVerified && status === 'idle') {
      findMatch(interests, chatMode);
    }
  }, [ageVerified]);

  const handleSkip = useCallback(() => {
    skip();
    setTimeout(() => findMatch(interests, chatMode), 500);
  }, [skip, findMatch, interests, chatMode]);

  const handleNewChat = useCallback(() => {
    findMatch(interests, chatMode);
  }, [findMatch, interests, chatMode]);

  const handleSwitchMode = (mode: 'text' | 'video') => {
    if (mode !== chatMode) {
      setChatMode(mode);
      skip();
      setTimeout(() => findMatch(interests, mode), 400);
    }
  };

  // Status bar content
  const statusConfig = {
    idle: { text: 'Ready', color: 'bg-slate-500', pulse: false },
    searching: { text: chatMode === 'video' ? 'Finding video match...' : 'Finding someone...', color: 'bg-warning', pulse: true },
    connected: { text: chatMode === 'video' ? 'Live with stranger' : 'Connected to stranger', color: 'bg-success', pulse: false },
    disconnected: { text: 'Stranger disconnected', color: 'bg-danger', pulse: false },
    banned: { text: 'You are banned', color: 'bg-danger', pulse: false },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className={`flex h-[100dvh] flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0a0f1d] text-slate-100' : 'bg-[#F6F1E7] text-[#1B1612]'
    }`}>
      {/* Age Gate */}
      {!ageVerified && <AgeGate onVerified={() => findMatch(interests, chatMode)} />}

      {/* Report Modal */}
      <ReportModal onReport={(reason) => report(reason)} />

      {/* Interstitial Ad */}
      {showInterstitialAd && (
        <AdInterstitial onClose={() => {
          setShowInterstitialAd(false);
          findMatch(interests, chatMode);
        }} />
      )}

      {/* ===== TOP BAR ===== */}
      <header className={`shrink-0 border-b safe-top transition-colors duration-300 ${
        theme === 'dark' ? 'glass border-white/10' : 'bg-[#FAF6EE]/90 border-[#E5DDC7] shadow-sm'
      }`}>
        <div className="flex h-14 items-center justify-between px-3 sm:px-4">
          {/* Left: Back + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/')}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-black/5 text-slate-700'
              }`}
              aria-label="Back to home"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Genz chitchat
              </span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  {currentStatus.pulse && (
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${currentStatus.color} opacity-75`}></span>
                  )}
                  <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${currentStatus.color}`}></span>
                </span>
                <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#7A6E5E]'}`}>{currentStatus.text}</span>
              </div>
            </div>
          </div>

          {/* Center: Mode switcher + Female Only Premium */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center rounded-full p-1 border ${
              theme === 'dark' ? 'bg-black/30 border-white/10' : 'bg-black/5 border-[#E2D8C3]'
            }`}>
              <button
                onClick={() => handleSwitchMode('text')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  chatMode === 'text'
                    ? 'gradient-primary text-white shadow-md'
                    : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-[#7A6E5E] hover:text-[#1B1612]'
                }`}
              >
                <span>💬</span>
                <span className="hidden xs:inline">Text</span>
              </button>
              <button
                onClick={() => handleSwitchMode('video')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  chatMode === 'video'
                    ? 'gradient-primary text-white shadow-md'
                    : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-[#7A6E5E] hover:text-[#1B1612]'
                }`}
              >
                <span>🎥</span>
                <span className="hidden xs:inline">Video</span>
              </button>
            </div>

            {/* Female Only Premium Pill Button */}
            <button
              type="button"
              onClick={() => setShowPremiumModal(true)}
              className={`hidden md:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all hover:scale-105 active:scale-95 ${
                isPremium
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : theme === 'dark'
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 hover:bg-amber-400/20'
                  : 'bg-[#FAF4E6] border-[#C5A059]/60 text-[#8C6623] hover:bg-[#F3EAD4]'
              }`}
            >
              <span>♀</span>
              <span>Female only</span>
              <span className="font-extrabold text-amber-500">
                {isPremium ? 'Active' : 'Premium 🔒'}
              </span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {status === 'connected' && chatMode === 'text' && (
              <>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full
                    hover:bg-danger/20 transition-colors text-slate-400 hover:text-danger"
                  aria-label="Report user"
                  title="Report user"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </button>

                <button
                  onClick={handleSkip}
                  className="rounded-full bg-slate-700 hover:bg-slate-600 px-4 py-2 text-xs font-semibold
                    text-white transition-colors flex items-center gap-1.5"
                  aria-label="Skip to next stranger"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Skip
                </button>
              </>
            )}
          </div>
        </div>

        {/* Shared interests pill */}
        {status === 'connected' && sharedInterests.length > 0 && chatMode === 'text' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-4 pb-2"
          >
            <div className={`flex items-center gap-2 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-[#7A6E5E]'}`}>
              <span>Shared interests:</span>
              {sharedInterests.map((interest) => (
                <span key={interest} className="rounded-full bg-primary-600/20 border border-primary-500/20 px-2 py-0.5 text-primary-300">
                  #{interest}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* ===== MAIN CONTENT: VIDEO OR TEXT ===== */}
      {chatMode === 'video' ? (
        <VideoChat
          onSkip={handleSkip}
          onSendMessage={sendMessage}
          onSendTyping={sendTyping}
        />
      ) : (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Chat column */}
          <div className="flex flex-1 flex-col min-w-0">
          {/* Safety banner */}
          <div className="px-3 pt-3">
            <SafetyBanner />
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-1"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            {/* Searching state */}
            <AnimatePresence mode="wait">
              {status === 'searching' && (
                <motion.div
                  key="searching"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  {/* Animated searching orb */}
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full gradient-primary animate-pulse-glow" />
                    <div className="absolute inset-0 h-20 w-20 rounded-full gradient-primary animate-ping opacity-20" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Finding your match...
                    </h3>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B5E4F]'}`}>
                      {filterGender === 'girl' ? 'Searching for female matches only ♀ ✨' : 'Hang tight, pairing you with someone'}
                    </p>
                    {filterGender === 'girl' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1 text-xs font-semibold text-amber-500">
                        <span>♀ Female only match active</span>
                      </div>
                    )}
                    {interests.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        {interests.map((i) => (
                          <span key={i} className="rounded-full bg-primary-600/20 border border-primary-500/20 px-2.5 py-0.5 text-xs text-primary-300">
                            #{i}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Connected — show system message */}
              {status === 'connected' && messages.length === 0 && (
                <motion.div
                  key="connected-msg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-success/10 border border-success/20 px-4 py-2 text-xs text-success">
                    <span className="h-2 w-2 rounded-full bg-success"></span>
                    {partnerGender === 'girl' ? (
                      <span>You're connected with a girl 👩. Say hi! 👋</span>
                    ) : partnerGender === 'guy' ? (
                      <span>You're connected with a guy 👨. Say hi! 👋</span>
                    ) : (
                      <span>You're now connected with a stranger. Say hi! 👋</span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Disconnected state */}
              {status === 'disconnected' && (
                <motion.div
                  key="disconnected"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-danger/10 border border-danger/20 px-4 py-2 text-xs text-danger mb-4">
                    Stranger has disconnected
                  </div>
                  <div>
                    <button
                      onClick={handleNewChat}
                      className="rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-white
                        shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50
                        transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      🔄 Find New Chat
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Banned state */}
              {status === 'banned' && (
                <motion.div
                  key="banned"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-danger/20 flex items-center justify-center">
                    <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`}>Temporarily Banned</h3>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B5E4F]'}`}>
                      You've been reported multiple times. Please review our community guidelines.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Idle state */}
              {status === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-primary-600/20 flex items-center justify-center animate-float">
                    <span className="text-3xl">💬</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Ready to chat?
                    </h3>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B5E4F]'}`}>Click below to find someone to talk to</p>
                  </div>
                  <button
                    onClick={handleNewChat}
                    className="rounded-full gradient-primary px-8 py-3 text-sm font-bold text-white
                      shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50
                      transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Start Chatting
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message list */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isPartnerTyping && status === 'connected' && <TypingIndicator />}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* ===== INPUT BAR ===== */}
          <div className="shrink-0 px-3 pb-3">
            <ChatInput
              onSend={sendMessage}
              onTyping={sendTyping}
              disabled={status !== 'connected'}
              rateLimited={rateLimited}
            />
          </div>
        </div>

        {/* Sidebar ad (desktop only) */}
        <div className="hidden lg:block p-3">
          <AdSidebar />
        </div>
      </div>
      )}
    </div>
  );
}
