/** Animated typing indicator dots */
export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 mb-2">
      <div className="flex items-center gap-1 rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 rounded-bl-md">
        <span className="text-xs text-slate-400 mr-2">Stranger is typing</span>
        <div className="flex gap-1">
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary-400"></span>
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary-400"></span>
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary-400"></span>
        </div>
      </div>
    </div>
  );
}
