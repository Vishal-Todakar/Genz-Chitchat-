import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useChatStore } from '../../store/chatStore';
import { useUIStore } from '../../store/uiStore';
import MessageBubble from '../chat/MessageBubble';
import ChatInput from '../chat/ChatInput';

interface VideoChatProps {
  onSkip: () => void;
  onSendMessage: (msg: string) => void;
  onSendTyping: (typing: boolean) => void;
}

export default function VideoChat({ onSkip, onSendMessage, onSendTyping }: VideoChatProps) {
  const { status, sharedInterests, interests, messages, rateLimited, isPartnerTyping } = useChatStore();
  const { theme, setShowReportModal } = useUIStore();
  const {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    partnerVideoEnabled,
    camError,
    toggleVideo,
    toggleAudio,
    flipCamera,
  } = useWebRTC();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showChatDrawer, setShowChatDrawer] = useState(false);

  // Attach local stream to local video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to remote video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Scroll chat messages
  useEffect(() => {
    if (showChatDrawer) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChatDrawer]);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden w-full h-full">
      {/* ===== VIDEO DISPLAY STAGE ===== */}
      <div className="relative flex-1 bg-black/90 flex items-center justify-center overflow-hidden">
        {/* Remote Video (Stranger) */}
        {remoteStream && partnerVideoEnabled ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center max-w-md">
            {status === 'connected' ? (
              <div className="space-y-4">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <span className="text-4xl">👤</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Stranger Connected</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {partnerVideoEnabled ? 'Establishing high-definition video link...' : "Stranger's camera is turned off"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full gradient-primary shadow-xl shadow-primary-500/30">
                    <span className="text-3xl">🎥</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Finding a Video Match...
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5">
                    Matching you with another camera user worldwide
                  </p>
                </div>

                {interests.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                    {interests.map((t) => (
                      <span key={t} className="rounded-full bg-primary-600/30 border border-primary-500/30 px-2.5 py-0.5 text-[11px] text-primary-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cam Permission Alert if blocked */}
        {camError && (
          <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 max-w-sm rounded-xl bg-amber-500/90 backdrop-blur-md p-3 text-white text-xs shadow-lg z-20 flex items-center gap-2">
            <span>⚠️</span>
            <span>{camError}</span>
          </div>
        )}

        {/* Shared interests notification pill in video view */}
        {status === 'connected' && sharedInterests.length > 0 && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-white">
            <span className="text-primary-300 font-semibold">Shared:</span>
            {sharedInterests.map((t) => (
              <span key={t} className="rounded-full bg-primary-500/30 px-2 py-0.5 text-primary-200">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Local Video Picture-in-Picture (Selfie) */}
        <div className="absolute bottom-24 right-4 z-20 w-32 sm:w-44 md:w-52 aspect-[3/4] sm:aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 glass">
          {localStream && isVideoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs">
              <span className="text-2xl mb-1">📷</span>
              <span>Camera Off</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
            You {!isAudioEnabled && '• Muted'}
          </div>
        </div>

        {/* Chat Drawer Overlay on Right (Collapsible) */}
        <AnimatePresence>
          {showChatDrawer && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`absolute top-0 right-0 bottom-20 w-full sm:w-80 md:w-96 z-30 flex flex-col
                ${theme === 'dark' ? 'bg-slate-900/90 border-l border-white/10' : 'bg-[#FAF6EE]/95 border-l border-[#E5DCC5]'}
                backdrop-blur-xl shadow-2xl`}
            >
              <div className="flex h-12 items-center justify-between px-4 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider">Video Chat Messages</span>
                <button
                  onClick={() => setShowChatDrawer(false)}
                  className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-8">
                    No messages yet. Say hi!
                  </p>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))
                )}
                {isPartnerTyping && (
                  <div className="text-[11px] text-slate-400 italic">Stranger is typing...</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-2 border-t border-white/10">
                <ChatInput
                  onSend={onSendMessage}
                  onTyping={onSendTyping}
                  disabled={status !== 'connected'}
                  rateLimited={rateLimited}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== FLOATING ACTION TOOLBAR ===== */}
      <div className={`shrink-0 p-3 flex items-center justify-center gap-3 border-t
        ${theme === 'dark' ? 'bg-slate-900/85 border-white/10' : 'bg-[#FAF6EE] border-[#E5DDC7]'}
        backdrop-blur-xl z-30`}>
        {/* Toggle Audio */}
        <button
          onClick={toggleAudio}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all
            ${
              isAudioEnabled
                ? 'bg-slate-700/60 hover:bg-slate-600 text-white'
                : 'bg-red-500/80 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
            }`}
          title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isAudioEnabled ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        {/* Toggle Video */}
        <button
          onClick={toggleVideo}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all
            ${
              isVideoEnabled
                ? 'bg-slate-700/60 hover:bg-slate-600 text-white'
                : 'bg-red-500/80 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
            }`}
          title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isVideoEnabled ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          )}
        </button>

        {/* Flip Camera */}
        <button
          onClick={flipCamera}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700/60 hover:bg-slate-600 text-white transition-all"
          title="Flip Camera"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Toggle Chat Panel */}
        <button
          onClick={() => setShowChatDrawer(!showChatDrawer)}
          className={`relative flex h-11 items-center gap-1.5 px-4 rounded-full transition-all text-xs font-semibold
            ${
              showChatDrawer
                ? 'bg-primary-600 text-white'
                : 'bg-slate-700/60 hover:bg-slate-600 text-white'
            }`}
          title="Open Text Chat"
        >
          <span>💬 Chat</span>
          {messages.length > 0 && !showChatDrawer && (
            <span className="flex h-2 w-2 rounded-full bg-accent-500 animate-ping" />
          )}
        </button>

        {/* Skip / Next stranger button */}
        <button
          onClick={onSkip}
          className="flex h-11 items-center gap-2 rounded-full gradient-primary px-6 text-sm font-bold text-white
            shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 active:scale-95 transition-all"
          title="Skip to next stranger"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          <span>Next</span>
        </button>

        {/* Report button if connected */}
        {status === 'connected' && (
          <button
            onClick={() => setShowReportModal(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all"
            title="Report Stranger"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
