import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { ChatMessage } from '../../store/chatStore';

interface MessageBubbleProps {
  message: ChatMessage;
}

/** Animated chat message bubble with sender-based styling */
export default function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.sender === 'me';
  const time = format(new Date(message.timestamp), 'HH:mm');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`relative max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm
          ${isMe
            ? 'gradient-primary text-white rounded-br-md shadow-md'
            : 'bg-slate-800 dark:bg-slate-800 light:bg-[#FFFDF9] text-slate-100 dark:text-slate-100 light:text-[#1B1612] border border-slate-700 dark:border-slate-700 light:border-[#E2D8C3] rounded-bl-md light:shadow-sm'
          }
          ${message.flagged ? 'ring-1 ring-warning/50' : ''}
        `}
      >
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.text}
        </p>
        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
          {message.flagged && (
            <span className="text-[10px] text-warning" title="This message was filtered">⚠️</span>
          )}
          <span className={`text-[10px] ${isMe ? 'text-white/70' : 'text-slate-400 dark:text-slate-500 light:text-[#8C7E6C]'}`}>
            {time}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
