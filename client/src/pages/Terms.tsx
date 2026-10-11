import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useUIStore } from '../store/uiStore';

export default function Terms() {
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

      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-[#1B1612]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Terms of Service
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-slate-300">
          <p className="text-slate-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Age Requirement</h2>
            <p className="text-sm">You must be at least 18 years old to use Genz chitchat. By using our service, you confirm that you meet this age requirement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Acceptable Use</h2>
            <p className="text-sm">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Harass, bully, threaten, or intimidate others</li>
              <li>Share sexually explicit, violent, or illegal content</li>
              <li>Attempt to collect personal information from other users</li>
              <li>Spam, advertise, or solicit other users</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Use automated tools, bots, or scripts</li>
              <li>Attempt to circumvent bans or moderation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Moderation & Bans</h2>
            <p className="text-sm">
              We employ automated and manual moderation. Users reported multiple times will be temporarily
              banned. We reserve the right to permanently ban users who violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. No Warranty</h2>
            <p className="text-sm">
              Genz chitchat is provided "as is" without warranty. We are not responsible for the
              content shared by other users or any interactions that occur on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Limitation of Liability</h2>
            <p className="text-sm">
              We shall not be liable for any indirect, incidental, or consequential damages arising
              from your use of the service.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
