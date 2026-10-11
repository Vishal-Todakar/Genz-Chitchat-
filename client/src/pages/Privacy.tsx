import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useUIStore } from '../store/uiStore';

export default function Privacy() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-slate-300">
          <p className="text-slate-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Information We Collect</h2>
            <p>Genz chitchat is designed with privacy in mind. We collect minimal data:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Device fingerprint:</strong> A hash of browser properties used solely for ban enforcement. This is not personally identifiable.</li>
              <li><strong>IP address:</strong> Used temporarily for rate limiting and ban enforcement. Not stored permanently.</li>
              <li><strong>Interest tags:</strong> Stored only in your browser's local storage for matchmaking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. What We Don't Collect</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>We <strong>do not</strong> store chat messages permanently.</li>
              <li>We <strong>do not</strong> require email, name, or any personal information.</li>
              <li>We <strong>do not</strong> use tracking cookies or third-party analytics.</li>
              <li>We <strong>do not</strong> sell any data to third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Report Data</h2>
            <p className="text-sm">
              When a user is reported, we store: the reporter's fingerprint, the reported user's fingerprint,
              the report reason, and timestamp. Flagged messages are temporarily logged for moderation review
              and deleted within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Cookies</h2>
            <p className="text-sm">
              We use only essential cookies: theme preference, age verification status, and cookie consent.
              No tracking or advertising cookies are used by us. Third-party ad providers may use cookies
              subject to their own policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Your Rights (GDPR)</h2>
            <p className="text-sm">
              Since we don't collect personal data, there is minimal data to request or delete. If you
              have concerns, contact us at privacy@genzchitchat.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">6. Changes</h2>
            <p className="text-sm">
              We may update this policy from time to time. Changes will be posted on this page with an
              updated date.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
