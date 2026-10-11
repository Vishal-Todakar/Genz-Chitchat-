import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

// ================= AUTHENTIC LOGOS =================
function GPayLogo() {
  return (
    <svg className="h-6 w-auto" viewBox="0 0 90 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Google G */}
      <path d="M16.5 16.3c0-.6-.1-1.2-.2-1.8H8.5v3.4h4.5c-.2 1-.8 1.9-1.6 2.5v2h2.6c1.5-1.4 2.5-3.6 2.5-6.1z" fill="#4285F4"/>
      <path d="M8.5 24.5c2.3 0 4.2-.8 5.6-2.1l-2.6-2c-.8.5-1.8.8-3 .8-2.3 0-4.2-1.5-4.9-3.6H.9v2.1c1.5 2.9 4.4 4.8 7.6 4.8z" fill="#34A853"/>
      <path d="M3.6 17.6c-.2-.5-.3-1.1-.3-1.6s.1-1.1.3-1.6v-2.1H.9C.3 13.5 0 14.7 0 16s.3 2.5.9 3.7l2.7-2.1z" fill="#FBBC04"/>
      <path d="M8.5 10.9c1.3 0 2.4.4 3.2 1.3l2.5-2.5C12.7 8.3 10.8 7.5 8.5 7.5 5.3 7.5 2.4 9.4.9 12.3l2.7 2.1c.7-2.1 2.6-3.5 4.9-3.5z" fill="#EA4335"/>
      {/* Pay text */}
      <path d="M29.5 11h-4.6v13.5h2.7v-4.3h1.9c2.7 0 4.6-1.8 4.6-4.6 0-2.8-1.9-4.6-4.6-4.6zm-.2 6.6h-1.8v-4.2h1.8c1.3 0 2 .8 2 2.1 0 1.3-.7 2.1-2 2.1z" fill="#3C4043"/>
      <path d="M40.4 15.6c-1.7 0-3 1.3-3 3.1 0 1.7 1.3 3.1 3 3.1 1.2 0 2.1-.6 2.6-1.5v1.3h2.6V13h-2.6v1.1c-.5-.9-1.4-1.5-2.6-1.5zm.4 4.2c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" fill="#3C4043"/>
      <path d="M54.8 15.8l-3 7.7h-2.7l1.1-2.5-2.9-5.2h2.9l1.5 3.1 1.5-3.1h2.6z" fill="#3C4043"/>
    </svg>
  );
}

function PhonePeLogo() {
  return (
    <svg className="h-6 w-auto" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="2" width="28" height="28" rx="8" fill="#5F259F"/>
      <path d="M14.5 8c-4.4 0-8 3.6-8 8s3.6 8 8 8c.9 0 1.8-.1 2.6-.4L16.5 26c0 .3.3.5.5.5h2.5c.3 0 .5-.3.5-.5V15.5c0-4.1-3.3-7.5-7.5-7.5zm.6 11.6c-2.3 0-4.1-1.8-4.1-4.1s1.8-4.1 4.1-4.1 4.1 1.8 4.1 4.1-1.8 4.1-4.1 4.1z" fill="#FFFFFF"/>
      <circle cx="15.1" cy="15.5" r="1.7" fill="#5F259F"/>
      <text x="34" y="22" fill="#5F259F" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.3">PhonePe</text>
    </svg>
  );
}

function PaytmLogo() {
  return (
    <svg className="h-6 w-auto" viewBox="0 0 95 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="2" y="23" fill="#002970" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.8">Pay</text>
      <text x="42" y="23" fill="#00BAF2" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.8">tm</text>
    </svg>
  );
}

function BhimUpiLogo() {
  return (
    <svg className="h-6 w-auto" viewBox="0 0 85 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 8L20 16L8 24L12 16Z" fill="#00833D"/>
      <path d="M14 8L26 16L14 24L18 16Z" fill="#F15A24"/>
      <text x="32" y="22" fill="#1E293B" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="15" letterSpacing="0.5">UPI</text>
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="2" y="16" fill="#1A1F71" fontFamily="Impact, Arial Black, sans-serif" fontStyle="italic" fontWeight="900" fontSize="18">VISA</text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" fill="#EB001B"/>
      <circle cx="31" cy="14" r="12" fill="#F79E1B" fillOpacity="0.88"/>
    </svg>
  );
}

function RupayLogo() {
  return (
    <svg className="h-5 w-auto" viewBox="0 0 65 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 3L11 10L4 17L8 10Z" fill="#0072BC"/>
      <path d="M9 3L16 10L9 17L13 10Z" fill="#F37023"/>
      <text x="20" y="16" fill="#231F20" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13">RuPay</text>
    </svg>
  );
}

export default function RazorpayModal() {
  const {
    showRazorpayModal,
    setShowRazorpayModal,
    razorpayPlan,
    setIsPremium,
    setFilterGender,
    setShowPremiumModal,
  } = useUIStore();

  const [step, setStep] = useState<'contact' | 'verify_email' | 'payment' | 'processing' | 'success'>('contact');
  const [mobileNumber, setMobileNumber] = useState('9175469928');
  const [emailAddress, setEmailAddress] = useState('babyboss@gmail.com');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [expiryTimer, setExpiryTimer] = useState(300);

  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [timerSeconds, setTimerSeconds] = useState(540); // 9:00 timer for QR
  const [paymentId, setPaymentId] = useState('');

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Default to 199 or plan selected
  const planPrice = razorpayPlan?.price || 199;
  const planName = razorpayPlan?.name || '1 HOUR';

  useEffect(() => {
    if (showRazorpayModal) {
      setStep('contact');
      setTimerSeconds(540);
      setResendTimer(60);
      setExpiryTimer(300);
      setOtpDigits(['', '', '', '', '', '']);
      setContactError(null);
      setOtpError(null);
      setDevOtp(null);
      setPaymentId(`pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`);
    }
  }, [showRazorpayModal]);

  // Resend OTP countdown (60s)
  useEffect(() => {
    if (step !== 'verify_email' || resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  // Code expiration countdown (5 mins)
  useEffect(() => {
    if (step !== 'verify_email' || expiryTimer <= 0) return;
    const t = setInterval(() => setExpiryTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [step, expiryTimer]);

  // QR Code countdown
  useEffect(() => {
    if (!showRazorpayModal || step !== 'payment') return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showRazorpayModal, step]);

  if (!showRazorpayModal) return null;

  // Step 1 -> Send Email OTP
  const handleSendEmailOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mobileNumber.trim() || !emailAddress.trim()) {
      setContactError('Please enter both mobile number and email address.');
      return;
    }

    setIsSendingOtp(true);
    setContactError(null);
    setOtpError(null);

    try {
      const res = await fetch('http://localhost:3001/api/payment/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress.trim(), mobile: mobileNumber.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.devOtp) {
          setDevOtp(data.devOtp);
        }
        setResendTimer(data.cooldownSeconds || 60);
        setExpiryTimer(data.expiresInSeconds || 300);
        setOtpDigits(['', '', '', '', '', '']);
        setStep('verify_email');
        setTimeout(() => otpInputRefs[0].current?.focus(), 150);
      } else {
        // If SMTP is not yet configured, but devOtp is available in development mode
        if (data.devOtp) {
          setDevOtp(data.devOtp);
          setResendTimer(60);
          setExpiryTimer(300);
          setOtpDigits(['', '', '', '', '', '']);
          setStep('verify_email');
          setTimeout(() => otpInputRefs[0].current?.focus(), 150);
        } else {
          setContactError(data.error || 'Failed to dispatch verification email. Please check your address.');
        }
      }
    } catch {
      setContactError('Unable to connect to verification server. Please check your connection.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto-advance
    if (value && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    } else if (value && index === 5) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 6) {
        setTimeout(() => verifyCode(fullCode), 150);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);
    setOtpError(null);

    if (pasted.length === 6) {
      setTimeout(() => verifyCode(newDigits.join('')), 100);
    } else if (pasted.length > 0) {
      otpInputRefs[Math.min(pasted.length, 5)].current?.focus();
    }
  };

  const handleAutoFillOtp = (codeToFill: string) => {
    const chars = codeToFill.slice(0, 6).split('');
    const full = Array.from({ length: 6 }, (_, i) => chars[i] || '');
    setOtpDigits(full);
    setOtpError(null);
    if (codeToFill.length === 6) {
      setTimeout(() => verifyCode(codeToFill), 200);
    }
  };

  // Verify OTP Helper
  const verifyCode = async (enteredOtp: string) => {
    if (enteredOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    if (expiryTimer <= 0) {
      setOtpError('This verification code has expired. Please request a new one.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await fetch('http://localhost:3001/api/payment/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress.trim(), otp: enteredOtp }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep('payment');
      } else {
        setOtpError(data.error || 'Invalid verification code. Please check and try again.');
      }
    } catch {
      setOtpError('Server connection error. Please verify your connection.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 2 -> Verify OTP Form submit
  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    verifyCode(otpDigits.join(''));
  };

  // Step 3 -> Execute Payment
  const handleExecutePayment = async () => {
    setStep('processing');

    // Notify backend receipt
    try {
      await fetch('http://localhost:3001/api/payment/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailAddress,
          plan: planName,
          price: planPrice,
          paymentId,
        }),
      });
    } catch (err) {
      console.warn('Receipt notification note:', err);
    }

    setTimeout(() => {
      setStep('success');
      // Activate premium pass & female-only filter
      setIsPremium(true, planName);
      setFilterGender('girl');

      setTimeout(() => {
        setShowRazorpayModal(false);
        setShowPremiumModal(false);
      }, 1900);
    }, 1500);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-[850px] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row bg-[#08353B] border border-slate-700/50"
          style={{ minHeight: '520px' }}
        >
          {/* ================= LEFT SIDEBAR (RAZORPAY BRAND & SUMMARY) ================= */}
          <div className="w-full md:w-[310px] bg-gradient-to-b from-[#0A3D43] via-[#08353B] to-[#042428] text-white p-5 flex flex-col justify-between relative overflow-hidden shrink-0">
            {/* Ambient teal glow */}
            <div className="absolute -top-16 -left-16 w-44 h-44 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Amex badge */}
              <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10 flex items-center gap-2.5">
                <div className="h-6 w-6 rounded bg-[#006FCF] flex items-center justify-center text-[10px] font-bold text-white tracking-tighter shrink-0 shadow-sm">
                  AMEX
                </div>
                <span className="text-[11px] leading-tight text-slate-200">
                  Your Amex card is welcomed at 1M+ locations
                </span>
              </div>

              {/* Price Summary Box */}
              <div className="bg-[#0F474D]/90 border border-[#1B5A61] p-4 rounded-xl mt-3.5 shadow-sm">
                <div className="text-xs text-slate-300 font-medium">Price Summary</div>
                <div className="text-3xl font-extrabold text-white mt-1 tracking-tight flex items-baseline gap-1">
                  <span>₹{planPrice}</span>
                  <span className="text-xs font-normal text-teal-200/80 uppercase">({planName})</span>
                </div>
              </div>

              {/* Offers banner */}
              <div className="bg-[#0F474D]/70 border border-[#1B5A61]/70 p-2.5 rounded-xl mt-3 flex items-center justify-between text-xs text-slate-200 cursor-pointer hover:bg-[#0F474D] transition-colors">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <span className="inline-block h-4 w-4 rounded-full bg-emerald-500 text-[9px] flex items-center justify-center font-bold">₹</span>
                    <span className="inline-block h-4 w-4 rounded-full bg-amber-500 text-[9px] flex items-center justify-center font-bold">%</span>
                  </div>
                  <span className="font-medium text-[11px] text-slate-200 truncate">
                    Offers on UPI, Card and...
                  </span>
                </div>
                <span className="text-slate-400 text-sm">›</span>
              </div>
            </div>

            {/* Shopping bags graphic & Discount percent icon */}
            <div className="relative my-4 flex items-center justify-center">
              <svg width="220" height="110" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                <circle cx="160" cy="30" r="16" fill="#0D9488" fillOpacity="0.4" />
                <circle cx="160" cy="30" r="13" stroke="#2DD4BF" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="154" y="35" fill="#5EEAD4" fontSize="13" fontWeight="bold">%</text>

                <path d="M70 40 L110 25 L110 90 L70 100 Z" fill="#0B4E54" />
                <path d="M110 25 L140 38 L140 98 L110 90 Z" fill="#0E646C" />
                <path d="M70 40 L100 52 L140 38 L110 25 Z" fill="#147B84" />
                <path d="M95 33 C95 20, 115 20, 115 33" stroke="#5EEAD4" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                <path d="M30 55 L65 42 L65 95 L30 102 Z" fill="#052F33" />
                <path d="M65 42 L90 52 L90 100 L65 95 Z" fill="#094348" />
                <path d="M30 55 L55 64 L90 52 L65 42 Z" fill="#0D555B" />
                <path d="M52 48 C52 38, 68 38, 68 48" stroke="#2DD4BF" strokeWidth="2" fill="none" strokeLinecap="round" />

                <path d="M130 65 L160 52 L185 62 L155 75 Z" fill="#1A7C85" />
                <path d="M130 65 L155 75 L155 105 L130 95 Z" fill="#10575E" />
                <path d="M155 75 L185 62 L185 92 L155 105 Z" fill="#0B4247" />
                <path d="M142 70 L170 58" stroke="#FDE047" strokeWidth="2" />
                <path d="M142 70 L142 100" stroke="#FDE047" strokeWidth="2" />
              </svg>
            </div>

            {/* Bottom branding: Secured by Razorpay */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-slate-400 text-[11px]">Secured by</span>
                <span className="flex items-center gap-1 font-extrabold italic text-sm text-white tracking-tight">
                  <svg className="h-4 w-4 text-[#3395FF]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 2L4 14h7v8l9.5-12h-7z" />
                  </svg>
                  <span>Razorpay</span>
                </span>
              </div>
              <span className="text-[10px] text-teal-300/80 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
                PCI-DSS 256-bit
              </span>
            </div>
          </div>

          {/* ================= RIGHT PANEL (INTERACTIVE CHECKOUT) ================= */}
          <div className="flex-1 bg-[#F5F7FA] p-4 sm:p-7 flex flex-col justify-center items-center relative min-h-[460px]">
            {/* Top Close Button */}
            <button
              onClick={() => setShowRazorpayModal(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors z-20"
              aria-label="Close Razorpay checkout"
            >
              ✕
            </button>

            {/* Top offers bar */}
            <div className="w-full max-w-[430px] mb-3 flex items-center justify-between px-1 text-xs">
              <span className="font-semibold text-slate-600">Pay using</span>
              <div className="flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-medium truncate max-w-[150px]">Earn 1% cashback on UPI</span>
                <span className="text-[10px] text-primary-600 font-bold ml-1">+7 View all</span>
              </div>
            </div>

            {/* ================= VIEW 1: CONTACT DETAILS (SCREENSHOT 1) ================= */}
            {step === 'contact' && (
              <motion.div
                key="step-contact"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full max-w-[430px] bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100 flex flex-col"
              >
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Contact details
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">
                  Enter mobile & email to continue
                </p>

                <form onSubmit={handleSendEmailOtp} className="space-y-4">
                  {/* Mobile number field */}
                  <div className="flex items-center border border-slate-300 rounded-xl px-3.5 py-3 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-all bg-white shadow-xs">
                    <div className="flex items-center gap-1 text-sm font-semibold text-slate-800 pr-2 border-r border-slate-200 shrink-0">
                      <span>IN</span>
                      <span>+91</span>
                      <span className="text-[10px] text-slate-400 ml-0.5">⌵</span>
                    </div>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Mobile number"
                      maxLength={10}
                      className="w-full pl-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 bg-transparent"
                      required
                    />
                  </div>

                  {/* Email address field */}
                  <div className="border border-slate-300 rounded-xl px-4 py-3 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-all bg-white shadow-xs">
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="Email address"
                      className="w-full text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 bg-transparent"
                      required
                    />
                  </div>

                  {contactError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                      {contactError}
                    </div>
                  )}

                  {/* Continue Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full bg-[#0A111F] hover:bg-[#1E293B] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isSendingOtp ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Sending Verification Code...</span>
                        </>
                      ) : (
                        <span>Continue</span>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-5 text-center">
                  <span className="text-[11px] text-slate-400">
                    By continuing, you agree to Razorpay's Terms & Privacy Policy
                  </span>
                </div>
              </motion.div>
            )}

            {/* ================= VIEW 2: VERIFY EMAIL OTP (SECURE 6-DIGIT PANEL) ================= */}
            {step === 'verify_email' && (
              <motion.div
                key="step-verify-email"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full max-w-[430px] bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100 flex flex-col"
              >
                <div className="flex items-center justify-between pb-2">
                  <button
                    type="button"
                    onClick={() => setStep('contact')}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                  >
                    <span>‹</span> Change Email
                  </button>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Step 2 of 3
                  </span>
                </div>

                <div className="mt-3 text-center flex flex-col items-center">
                  <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl mb-3 shadow-xs">
                    ✉️
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Verify your email
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-[300px]">
                    We sent a 6-digit verification code to{' '}
                    <strong className="text-slate-800 break-all">{emailAddress}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('contact')}
                    className="text-[11px] text-teal-600 hover:text-teal-700 font-medium mt-1 underline"
                  >
                    Wrong email? Change it
                  </button>
                </div>

                {/* Segmented 6-box OTP input with paste & auto-advance */}
                <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
                  <div className="flex justify-center gap-2 sm:gap-2.5">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        aria-label={`Digit ${idx + 1}`}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handlePasteOtp}
                        className={`w-10 sm:w-12 h-12 sm:h-14 text-center text-xl font-extrabold rounded-xl border transition-all outline-none ${
                          digit
                            ? 'border-slate-900 bg-slate-50/50 text-slate-900 shadow-xs'
                            : 'border-slate-300 bg-white text-slate-800 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Expiration timer */}
                  <div className="text-center text-xs">
                    {expiryTimer > 0 ? (
                      <span className="text-slate-500 inline-flex items-center gap-1 font-medium">
                        ⏱️ Code expires in{' '}
                        <strong className="text-slate-800">
                          {Math.floor(expiryTimer / 60)}:
                          {expiryTimer % 60 < 10 ? `0${expiryTimer % 60}` : expiryTimer % 60}
                        </strong>
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold inline-flex items-center gap-1">
                        ⚠️ Code has expired. Please request a new one below.
                      </span>
                    )}
                  </div>

                  {otpError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 text-center font-medium">
                      {otpError}
                    </div>
                  )}

                  {/* Dev / Test Code Auto-fill badge */}
                  {devOtp && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleAutoFillOtp(devOtp)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                        title="Click to automatically fill code"
                      >
                        <span>🔑 Dev OTP: <strong>{devOtp}</strong></span>
                        <span className="text-[10px] text-teal-600 font-normal">(Tap to auto-fill)</span>
                      </button>
                    </div>
                  )}

                  {/* Verify CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isVerifyingOtp || expiryTimer <= 0 || otpDigits.join('').length < 6}
                      className="w-full bg-[#0A111F] hover:bg-[#1E293B] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        <span>Verify & Proceed</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Resend OTP & Spam Hint */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center gap-2 text-center">
                  <div className="text-xs text-slate-500">
                    {resendTimer > 0 ? (
                      <span className="text-slate-400">
                        Resend code in <strong className="text-slate-600 font-semibold">{resendTimer}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isSendingOtp}
                        onClick={(e) => handleSendEmailOtp(e)}
                        className="font-bold text-teal-600 hover:text-teal-700 hover:underline disabled:opacity-50"
                      >
                        {isSendingOtp ? 'Sending...' : 'Resend OTP Code'}
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 max-w-[280px]">
                    📬 Didn't receive the email? Check your <strong>spam or junk folder</strong>.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ================= VIEW 3: PAYMENT METHODS WITH PROPER LOGOS (GPAY, PAYTM, PHONEPE) ================= */}
            {step === 'payment' && (
              <motion.div
                key="step-payment"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full max-w-[430px] bg-white rounded-2xl shadow-xl p-5 sm:p-7 border border-slate-100 flex flex-col"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <button
                    onClick={() => setStep('verify_email')}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                  >
                    <span>‹</span> Back
                  </button>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Paying</span>
                    <span className="ml-1.5 text-base font-extrabold text-slate-900">₹{planPrice}</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 mt-3">
                  <button
                    type="button"
                    onClick={() => setPaymentTab('upi')}
                    className={`flex-1 py-2 text-xs font-bold transition-colors border-b-2 ${
                      paymentTab === 'upi'
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab('card')}
                    className={`flex-1 py-2 text-xs font-bold transition-colors border-b-2 ${
                      paymentTab === 'card'
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab('netbanking')}
                    className={`flex-1 py-2 text-xs font-bold transition-colors border-b-2 ${
                      paymentTab === 'netbanking'
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Netbanking
                  </button>
                </div>

                {/* Tab content: UPI */}
                {paymentTab === 'upi' && (
                  <div className="mt-4 flex flex-col items-center">
                    {/* QR Code Container */}
                    <div className="relative p-3 bg-white border-2 border-dashed border-teal-500/50 rounded-2xl flex flex-col items-center shadow-xs w-full max-w-[280px]">
                      {/* Dynamic SVG QR code */}
                      <svg width="125" height="125" viewBox="0 0 130 130" className="rounded-lg">
                        <rect width="130" height="130" fill="white" />
                        <rect x="10" y="10" width="30" height="30" fill="#0F172A" rx="4" />
                        <rect x="15" y="15" width="20" height="20" fill="white" rx="2" />
                        <rect x="19" y="19" width="12" height="12" fill="#0F172A" rx="2" />

                        <rect x="90" y="10" width="30" height="30" fill="#0F172A" rx="4" />
                        <rect x="95" y="15" width="20" height="20" fill="white" rx="2" />
                        <rect x="99" y="19" width="12" height="12" fill="#0F172A" rx="2" />

                        <rect x="10" y="90" width="30" height="30" fill="#0F172A" rx="4" />
                        <rect x="15" y="95" width="20" height="20" fill="white" rx="2" />
                        <rect x="19" y="99" width="12" height="12" fill="#0F172A" rx="2" />

                        <rect x="48" y="15" width="6" height="18" fill="#0F172A" />
                        <rect x="62" y="12" width="14" height="6" fill="#0F172A" />
                        <rect x="52" y="42" width="26" height="6" fill="#0F172A" />
                        <rect x="12" y="48" width="18" height="6" fill="#0F172A" />
                        <rect x="25" y="60" width="8" height="18" fill="#0F172A" />
                        <rect x="44" y="60" width="14" height="14" fill="#0F172A" />
                        <rect x="68" y="58" width="20" height="8" fill="#0F172A" />
                        <rect x="98" y="48" width="12" height="12" fill="#0F172A" />
                        <rect x="110" y="68" width="10" height="22" fill="#0F172A" />
                        <rect x="48" y="88" width="24" height="6" fill="#0F172A" />
                        <rect x="80" y="82" width="14" height="18" fill="#0F172A" />
                        <rect x="52" y="102" width="16" height="16" fill="#0F172A" />
                        <rect x="78" y="108" width="22" height="8" fill="#0F172A" />

                        <circle cx="65" cy="65" r="14" fill="#0D9488" />
                        <text x="56" y="69" fill="white" fontSize="9" fontWeight="bold">UPI</text>
                      </svg>

                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Scan with any UPI app</span>
                      </div>
                      <span className="text-[10px] text-slate-400">QR expires in {formatTimer(timerSeconds)}</span>
                    </div>

                    {/* Quick UPI App buttons with PROPER OFFICIAL LOGOS */}
                    <div className="grid grid-cols-4 gap-2 w-full mt-3.5">
                      {/* Google Pay */}
                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('gpay')}
                        className={`h-16 rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all ${
                          selectedUpiApp === 'gpay'
                            ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/30 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <GPayLogo />
                        <span className="text-[9px] font-bold text-slate-700 mt-1">GPay</span>
                      </button>

                      {/* PhonePe */}
                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('phonepe')}
                        className={`h-16 rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all ${
                          selectedUpiApp === 'phonepe'
                            ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/30 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <PhonePeLogo />
                        <span className="text-[9px] font-bold text-slate-700 mt-0.5">PhonePe</span>
                      </button>

                      {/* Paytm */}
                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('paytm')}
                        className={`h-16 rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all ${
                          selectedUpiApp === 'paytm'
                            ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/30 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <PaytmLogo />
                        <span className="text-[9px] font-bold text-slate-700 mt-0.5">Paytm</span>
                      </button>

                      {/* BHIM / UPI QR */}
                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('qr')}
                        className={`h-16 rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all ${
                          selectedUpiApp === 'qr'
                            ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/30 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <BhimUpiLogo />
                        <span className="text-[9px] font-bold text-slate-700 mt-0.5">BHIM / QR</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab content: Cards */}
                {paymentTab === 'card' && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-semibold text-slate-500">Supported Cards</span>
                      <div className="flex items-center gap-2">
                        <VisaLogo />
                        <MastercardLogo />
                        <RupayLogo />
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Card number (4532 •••• •••• ••••)"
                      defaultValue="4532 8920 1827 9901"
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-slate-900"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        defaultValue="12/28"
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-slate-900"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        defaultValue="891"
                        maxLength={4}
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-slate-900"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      defaultValue="Alex Sharma"
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-slate-900"
                    />
                  </div>
                )}

                {/* Tab content: Netbanking */}
                {paymentTab === 'netbanking' && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      { name: 'HDFC Bank', color: 'bg-blue-900', icon: '🏦' },
                      { name: 'ICICI Bank', color: 'bg-orange-600', icon: '🏛️' },
                      { name: 'State Bank of India', color: 'bg-sky-600', icon: '🔵' },
                      { name: 'Axis Bank', color: 'bg-purple-900', icon: '🟣' },
                    ].map((bank) => (
                      <button
                        key={bank.name}
                        type="button"
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-900 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                      >
                        <span className="text-sm">{bank.icon}</span>
                        <span className="truncate">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Pay Action CTA */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    className="w-full bg-[#0A111F] hover:bg-[#1E293B] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Pay ₹{planPrice}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= VIEW 4: PROCESSING ================= */}
            {step === 'processing' && (
              <motion.div
                key="step-processing"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[390px] bg-white rounded-2xl shadow-xl p-8 border border-slate-100 flex flex-col items-center text-center"
              >
                <div className="relative mb-5">
                  <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-[#0D9488] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">🔒</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Verifying with Bank</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[260px]">
                  Please do not refresh or close this window while Razorpay confirms your transaction.
                </p>
                <div className="mt-4 text-[11px] font-mono text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  {paymentId}
                </div>
              </motion.div>
            )}

            {/* ================= VIEW 5: SUCCESS ================= */}
            {step === 'success' && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[390px] bg-white rounded-2xl shadow-xl p-8 border border-slate-100 flex flex-col items-center text-center"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                  <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900">Payment Successful!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  ₹{planPrice} paid via Razorpay. Email confirmation sent to <strong className="text-slate-700">{emailAddress}</strong>.
                </p>
                <div className="mt-4 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  ✓ Premium Pass: {planName} Active (Female-only unlocked)
                </div>
                <span className="text-[11px] text-slate-400 mt-3">Redirecting to chat...</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
