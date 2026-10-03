import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, Check, Sliders, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: string;
}

const COOKIE_STORAGE_KEY = 'zentrix_cookie_consent_v1';

export const getStoredCookiePreferences = (): CookiePreferences | null => {
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading cookie preferences', e);
  }
  return null;
};

export const saveCookiePreferences = (prefs: CookiePreferences) => {
  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent('zentrix_cookie_preferences_updated', { detail: prefs }));
  } catch (e) {
    console.error('Error saving cookie preferences', e);
  }
};

export const openCookieModal = () => {
  window.dispatchEvent(new CustomEvent('open_cookie_preferences'));
};

const CookieConsentModal: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Granular settings
  const [analytics, setAnalytics] = useState(true);
  const [functional, setFunctional] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getStoredCookiePreferences();
    if (!stored) {
      // Delay showing banner slightly for smooth UX
      const timer = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(timer);
    } else {
      setAnalytics(stored.analytics);
      setFunctional(stored.functional);
      setMarketing(stored.marketing);
    }

    const handleOpen = () => {
      const current = getStoredCookiePreferences();
      if (current) {
        setAnalytics(current.analytics);
        setFunctional(current.functional);
        setMarketing(current.marketing);
      }
      setShowModal(true);
    };

    window.addEventListener('open_cookie_preferences', handleOpen);
    return () => window.removeEventListener('open_cookie_preferences', handleOpen);
  }, []);

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    saveCookiePreferences(prefs);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleRejectOptional = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    saveCookiePreferences(prefs);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSaveCustom = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      functional,
      marketing,
      timestamp: new Date().toISOString()
    };
    saveCookiePreferences(prefs);
    setShowBanner(false);
    setShowModal(false);
  };

  return (
    <>
      {/* Floating Bottom Banner */}
      {showBanner && !showModal && (
        <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[99999] animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="bg-[#0c0e14]/95 backdrop-blur-2xl border border-cyan-500/30 p-5 md:p-6 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400">
                <Cookie className="w-5 h-5 animate-pulse" />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Cookie Consent</h4>
                  <button 
                    onClick={() => setShowBanner(false)}
                    className="text-gray-400 hover:text-white p-1 transition-colors"
                    aria-label="Close Banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We use cookies and local storage to optimize system performance, personalize client experience, and analyze portal traffic.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  setShowBanner(false);
                  setShowModal(true);
                }}
                className="text-[11px] font-bold text-gray-400 hover:text-cyan-400 underline transition-colors"
              >
                Customize Settings
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRejectOptional}
                  className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-[11px] font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-[#0c0e14] border border-cyan-500/30 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-white relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-wider text-white">Cookie Preferences</h3>
                  <p className="text-xs text-gray-400">Manage data collection and privacy choices</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="py-5 space-y-4 max-h-[60vh] overflow-y-auto precision-scrollbar pr-1">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Strictly Necessary</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      ALWAYS ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Essential for secure login, core session integrity, API routing, and theme preferences. Cannot be disabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-5 h-5 accent-cyan-500 rounded cursor-not-allowed opacity-80"
                />
              </div>

              {/* Category 2: Performance & Analytics */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Performance &amp; Analytics</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Helps us measure site traffic, response latency, and feature usage to continuously improve automation performance.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {/* Category 3: Functional Preferences */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Functional Preferences</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Remembers your dashboard layout choices, filtered views, and WhatsApp consultation pre-fill details.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {/* Category 4: Marketing & Communication */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Marketing &amp; AI Updates</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Allows us to notify you about critical feature releases, seasonal AI agent discounts, and webinar announcements.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                to="/privacy-policy"
                onClick={() => setShowModal(false)}
                className="text-xs text-gray-400 hover:text-cyan-400 underline font-medium"
              >
                Read Privacy &amp; Cookie Policy
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleRejectOptional}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  Reject All
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  Save Choices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsentModal;
