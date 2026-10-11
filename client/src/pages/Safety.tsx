import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useUIStore } from '../store/uiStore';

const TIPS = [
  {
    icon: '🙈',
    title: 'Never share personal info',
    desc: 'Don\'t share your real name, phone number, address, school/workplace, or social media accounts with strangers.',
  },
  {
    icon: '📸',
    title: 'Don\'t share photos',
    desc: 'Avoid sending selfies, screenshots, or any images that could identify you or reveal your location.',
  },
  {
    icon: '🚫',
    title: 'Report bad behavior',
    desc: 'Use the report button if someone is inappropriate, threatening, or makes you uncomfortable. We take reports seriously.',
  },
  {
    icon: '🔒',
    title: 'Use the skip button',
    desc: 'If a conversation makes you uncomfortable, skip immediately. You don\'t owe anyone an explanation.',
  },
  {
    icon: '🌐',
    title: 'Stay anonymous',
    desc: 'The whole point is anonymity. Don\'t try to identify others or reveal your own identity.',
  },
  {
    icon: '⚠️',
    title: 'Trust your instincts',
    desc: 'If something feels off, it probably is. Disconnect and move on. Your safety comes first.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Minors must leave',
    desc: 'This platform is strictly for users 18 and older. If you are under 18, please leave immediately.',
  },
  {
    icon: '🛡️',
    title: 'We have your back',
    desc: 'We use profanity filters, spam detection, and ban systems to keep the platform safe. But stay vigilant.',
  },
];

export default function Safety() {
  const { theme } = useUIStore();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0a0f1d] text-slate-100' : 'bg-[#F6F1E7] text-[#1B1612]'
    }`}>
      <header className={`border-b transition-colors duration-300 ${
        theme === 'dark' ? 'glass border-white/5' : 'bg-[#FAF6EE]/90 border-[#E5DDC7] shadow-sm'
      }`}>
        <div className="mx-auto max-w-4xl flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <span className="text-sm">💬</span>
            </div>
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Genz chitchat
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Safety Tips
          </h1>
          <p className="text-slate-400">Your safety is our top priority. Please read these guidelines.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIPS.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl glass p-6 border border-white/5 hover:border-primary-500/20 transition-colors"
            >
              <div className="text-2xl mb-3">{tip.icon}</div>
              <h3 className="text-base font-semibold text-white mb-2">{tip.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 mb-4">
            If you encounter illegal activity, please contact local law enforcement.
          </p>
          <Link
            to="/"
            className="inline-flex rounded-full gradient-primary px-8 py-3 text-sm font-semibold text-white
              shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50
              transition-all duration-300 hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
