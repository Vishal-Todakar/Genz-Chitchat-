import { useState, useRef, useEffect, useCallback } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  rateLimited?: boolean;
}

/** Chat input bar with send button, emoji toggle, and typing detection */
export default function ChatInput({ onSend, onTyping, disabled, rateLimited }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Auto-focus on mount
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  // Handle typing indicator with debounce
  const handleChange = useCallback((value: string) => {
    setMessage(value);

    if (value.length > 0) {
      onTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => onTyping(false), 2000);
    } else {
      onTyping(false);
    }
  }, [onTyping]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled || rateLimited) return;
    onSend(trimmed);
    setMessage('');
    onTyping(false);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Common emoji list (simple inline picker)
  const QUICK_EMOJIS = ['😊', '😂', '❤️', '🔥', '👍', '😭', '🥰', '😎', '🤣', '💀', '✨', '🙏', '😮', '🤔', '👋', '💯'];

  return (
    <div className="relative safe-bottom">
      {/* Quick emoji picker */}
      {showEmoji && (
        <div className="absolute bottom-full left-0 right-0 mb-2 p-3 rounded-2xl glass border border-slate-700">
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setMessage((prev) => prev + emoji);
                  inputRef.current?.focus();
                }}
                className="text-xl hover:scale-125 transition-transform p-1 rounded-lg hover:bg-white/10"
                aria-label={`Insert ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2 p-3 rounded-2xl glass border border-slate-700/50 light:border-[#E2D8C3] light:bg-[#FFFDF9]/95 light:shadow-md">
        {/* Emoji toggle */}
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full
            transition-colors ${showEmoji ? 'bg-primary-600 text-white' : 'text-slate-400 light:text-[#7A6E5E] hover:bg-black/10 dark:hover:bg-white/10'}`}
          aria-label="Toggle emoji picker"
          aria-expanded={showEmoji}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </button>

        {/* Text input */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={rateLimited ? 'Slow down...' : disabled ? 'Not connected' : 'Type a message...'}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-slate-100 dark:text-slate-100 light:text-[#1B1612] placeholder-slate-500 light:placeholder-stone-400
            outline-none max-h-[120px] py-2.5 disabled:opacity-50"
          style={{ lineHeight: '1.5' }}
          aria-label="Chat message input"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled || rateLimited}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
            gradient-primary text-white shadow-lg shadow-primary-500/30
            hover:shadow-primary-500/50 transition-all duration-300
            disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed
            active:scale-90"
          aria-label="Send message"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>

      {rateLimited && (
        <p className="mt-1 text-center text-xs text-warning animate-pulse">
          ⚡ You're sending messages too fast
        </p>
      )}
    </div>
  );
}
