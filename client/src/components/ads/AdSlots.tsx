/**
 * Ad placeholder components — ready for Google AdSense integration.
 * These render styled placeholder divs that will be replaced with
 * real ad units when AdSense is configured.
 */

/** Banner ad for landing page hero area */
export function AdBanner() {
  return (
    <div
      className="w-full rounded-2xl border border-dashed border-slate-700 bg-slate-800/30
        flex items-center justify-center py-4 px-6 text-xs text-slate-500"
      role="complementary"
      aria-label="Advertisement"
      data-ad-slot="banner"
    >
      {/* Replace this div's content with:
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXX"
            data-ad-slot="XXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"
          /> */}
      <span className="opacity-50">📢 Ad Space — Banner</span>
    </div>
  );
}

/** Sidebar ad for chat page */
export function AdSidebar() {
  return (
    <div
      className="hidden lg:flex w-[300px] min-h-[250px] rounded-2xl border border-dashed border-slate-700
        bg-slate-800/30 items-center justify-center text-xs text-slate-500 shrink-0"
      role="complementary"
      aria-label="Advertisement"
      data-ad-slot="sidebar"
    >
      <span className="opacity-50">📢 Ad Space — Sidebar</span>
    </div>
  );
}

/** Interstitial ad shown every N skips */
interface AdInterstitialProps {
  onClose: () => void;
}

export function AdInterstitial({ onClose }: AdInterstitialProps) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl glass p-8 text-center">
        <p className="mb-4 text-xs text-slate-500 uppercase tracking-wider">Advertisement</p>
        <div
          className="w-full h-[250px] rounded-xl border border-dashed border-slate-600
            bg-slate-800/50 flex items-center justify-center mb-6"
          data-ad-slot="interstitial"
        >
          <span className="text-slate-500 text-sm">📢 Interstitial Ad Space</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-primary-600 px-8 py-2.5 text-sm font-semibold text-white
            hover:bg-primary-500 transition-colors"
        >
          Continue Chatting
        </button>
        <p className="mt-3 text-xs text-slate-500">
          ✨ <a href="/pricing" className="text-primary-400 hover:underline">Go Premium</a> to remove ads
        </p>
      </div>
    </div>
  );
}
