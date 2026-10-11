import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useUIStore } from './store/uiStore';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Safety from './pages/Safety';
import CookieConsent from './components/ui/CookieConsent';
import PremiumModal from './components/modals/PremiumModal';
import RazorpayModal from './components/modals/RazorpayModal';

export default function App() {
  const { theme } = useUIStore();

  // Apply theme class to body on mount and change
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/safety" element={<Safety />} />
      </Routes>
      <PremiumModal />
      <RazorpayModal />
      <CookieConsent />
    </BrowserRouter>
  );
}
