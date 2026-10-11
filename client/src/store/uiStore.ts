import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface UIState {
  theme: Theme;
  ageVerified: boolean;
  cookieConsent: boolean;
  showReportModal: boolean;
  showEmojiPicker: boolean;
  showInterstitialAd: boolean;
  showGenderModal: boolean;
  showPremiumModal: boolean;
  showRazorpayModal: boolean;
  razorpayPlan: { id: string; name: string; price: number; rate: string } | null;
  userGender: 'girl' | 'guy' | null;
  filterGender: 'anyone' | 'girl' | 'guy';
  isPremium: boolean;
  premiumPlan: string | null;
  skipCount: number;

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAgeVerified: (verified: boolean) => void;
  setCookieConsent: (consent: boolean) => void;
  setShowReportModal: (show: boolean) => void;
  setShowEmojiPicker: (show: boolean) => void;
  setShowInterstitialAd: (show: boolean) => void;
  setShowGenderModal: (show: boolean) => void;
  setShowPremiumModal: (show: boolean) => void;
  setShowRazorpayModal: (show: boolean, plan?: { id: string; name: string; price: number; rate: string }) => void;
  setUserGender: (gender: 'girl' | 'guy') => void;
  setFilterGender: (filter: 'anyone' | 'girl' | 'guy') => void;
  setIsPremium: (isPremium: boolean, plan?: string) => void;
  incrementSkipCount: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: (localStorage.getItem('genz-theme') as Theme) || 'dark',
  ageVerified: localStorage.getItem('genz-age-verified') === 'true',
  cookieConsent: localStorage.getItem('genz-cookie-consent') === 'true',
  showReportModal: false,
  showEmojiPicker: false,
  showInterstitialAd: false,
  showGenderModal: false,
  showPremiumModal: false,
  showRazorpayModal: false,
  razorpayPlan: null,
  userGender: (localStorage.getItem('genz-user-gender') as 'girl' | 'guy' | null) || null,
  filterGender: (localStorage.getItem('genz-filter-gender') as 'anyone' | 'girl' | 'guy') || 'anyone',
  isPremium: localStorage.getItem('genz-is-premium') === 'true',
  premiumPlan: localStorage.getItem('genz-premium-plan') || null,
  skipCount: 0,

  setTheme: (theme) => {
    localStorage.setItem('genz-theme', theme);
    document.body.className = theme;
    set({ theme });
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('genz-theme', newTheme);
    document.body.className = newTheme;
    set({ theme: newTheme });
  },

  setAgeVerified: (verified) => {
    localStorage.setItem('genz-age-verified', String(verified));
    set({ ageVerified: verified });
  },

  setCookieConsent: (consent) => {
    localStorage.setItem('genz-cookie-consent', String(consent));
    set({ cookieConsent: consent });
  },

  setShowReportModal: (show) => set({ showReportModal: show }),
  setShowEmojiPicker: (show) => set({ showEmojiPicker: show }),
  setShowInterstitialAd: (show) => set({ showInterstitialAd: show }),
  setShowGenderModal: (show) => set({ showGenderModal: show }),
  setShowPremiumModal: (show) => set({ showPremiumModal: show }),
  setShowRazorpayModal: (show, plan) => set({ showRazorpayModal: show, razorpayPlan: plan || get().razorpayPlan }),

  setUserGender: (gender) => {
    localStorage.setItem('genz-user-gender', gender);
    set({ userGender: gender });
  },

  setFilterGender: (filter) => {
    localStorage.setItem('genz-filter-gender', filter);
    set({ filterGender: filter });
  },

  setIsPremium: (isPremium, plan) => {
    localStorage.setItem('genz-is-premium', String(isPremium));
    if (plan) localStorage.setItem('genz-premium-plan', plan);
    set({ isPremium, premiumPlan: plan || get().premiumPlan });
  },

  incrementSkipCount: () => set({ skipCount: get().skipCount + 1 }),
}));
