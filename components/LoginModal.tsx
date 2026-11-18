import React, { useState } from 'react';
import { X, Shield, Lock, User, Loader2, Fingerprint, Building2, ArrowRight, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import { validateLogin } from '../services/sheetService';
import { loginCompany, loginAdmin, setAuthSession } from '../services/taskService';
import { getStoredTheme, setStoredTheme, PortalTheme } from '../services/themeService';
import ThemeSelector from './ThemeSelector';
import { Capacitor } from '@capacitor/core';
import { LOGO_FULL_URL, LOGO_URL } from '../constants';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (user: string, role: 'admin' | 'company') => void;
  notice?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess, notice }) => {
  const [activeTab, setActiveTab] = useState<'company' | 'admin'>('company');
  const [theme, setTheme] = useState<PortalTheme>(getStoredTheme);
  const [rememberMe, setRememberMe] = useState(true);

  const handleThemeChange = (newTheme: PortalTheme) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const isLight = theme === 'light';

  // Company Form State (ID & Password)
  const [companyName, setCompanyName] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');
  const [showCompanyPassword, setShowCompanyPassword] = useState(false);

  // Admin Form State (ID & Password)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanCompany = companyName.trim();
    const cleanPass = companyPassword.trim();
    if (!cleanCompany || !cleanPass) {
      setError('Please enter both Company ID and Password.');
      setLoading(false);
      return;
    }

    const res = await loginCompany({
      companyNameOrCode: cleanCompany,
      password: cleanPass
    });

    if (res.success && res.session) {
      onSuccess(res.session.user, 'company');
    } else {
      setError(res.error || 'Authentication failed. Please check Company ID & Password.');
    }
    setLoading(false);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanUser = adminUsername.trim();
    const cleanPass = adminPassword.trim();
    if (!cleanUser || !cleanPass) {
      setError('Please enter both Admin ID and Password.');
      setLoading(false);
      return;
    }

    try {
      const sheetResult = await validateLogin(cleanUser, cleanUser, cleanPass);
      if (sheetResult.success) {
        const verifiedUser = sheetResult.user || cleanUser;
        setAuthSession({
          user: verifiedUser,
          role: 'admin',
          isSuperAdmin: true,
          idCode: (sheetResult as any).idCode || cleanUser,
          email: 'admin@zentrixs.com'
        });
        onSuccess(verifiedUser, 'admin');
        setLoading(false);
        return;
      }
    } catch {
      // Continue to Cloudflare D1 admin verification
    }

    const res = await loginAdmin({
      username: cleanUser,
      idCode: cleanUser,
      password: cleanPass
    });

    if (res.success && res.session) {
      onSuccess(res.session.user, 'admin');
    } else {
      setError(res.error || 'Access Denied: Invalid Admin ID or Password.');
    }
    setLoading(false);
  };

  const isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden select-none">
      {/* Background with warm ambient gradients matching the reference mockup */}
      <div 
        className={`fixed inset-0 transition-colors duration-500 pointer-events-none ${
          isLight
            ? 'bg-[#FAF3EA]'
            : 'bg-[#0A0D14]'
        }`}
      >
        {/* Soft radial background glow circles */}
        <div className={`absolute top-0 left-0 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full blur-[120px] pointer-events-none transition-all duration-700 ${
          isLight 
            ? 'bg-gradient-to-br from-[#FFE5D4]/70 via-[#FFD6C0]/50 to-transparent' 
            : 'bg-gradient-to-br from-orange-500/10 via-cyan-500/10 to-transparent'
        }`} />
        <div className={`absolute bottom-0 right-10 w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full blur-[130px] pointer-events-none transition-all duration-700 ${
          isLight 
            ? 'bg-gradient-to-tl from-[#FFE9DB]/80 via-[#FCE4D6]/50 to-transparent' 
            : 'bg-gradient-to-tl from-cyan-500/10 via-blue-600/10 to-transparent'
        }`} />
        {/* Decorative subtle circular graphic as in reference */}
        <div className={`hidden md:block absolute -bottom-10 left-[35%] w-96 h-96 rounded-full pointer-events-none ${
          isLight 
            ? 'bg-gradient-to-br from-white/60 to-white/10 shadow-[inset_0_0_40px_rgba(255,255,255,0.8)]' 
            : 'bg-white/[0.02] border border-white/5'
        }`} />
      </div>

      {/* Full-view Container strictly fitting 100vh on desktop */}
      <div className="relative z-10 w-full h-full min-h-screen flex flex-col justify-between px-5 sm:px-10 lg:px-16 py-3 sm:py-5 max-w-7xl mx-auto">
        {/* TOP BAR */}
        <header className="flex items-center justify-between w-full shrink-0">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <img
              src={isLight ? '/zentrixs-logo-full.png' : '/zentrixs-logo-white.png'}
              alt="Zentrixs"
              className="h-7 sm:h-8 w-auto object-contain"
            />
            <div className={`border-l pl-2.5 py-0.5 ${isLight ? 'border-zinc-300' : 'border-white/20'}`}>
              <span className={`text-xs font-black tracking-tight block leading-tight ${isLight ? 'text-[#1D1B18]' : 'text-white'}`}>
                Portal
              </span>
              <span className={`text-[9px] font-semibold block leading-tight ${isLight ? 'text-[#8E7E70]' : 'text-slate-400'}`}>
                Digital Services
              </span>
            </div>
          </div>

          {/* Right Status Pill & Theme Selector & Close */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* System Operational pill from reference */}
            <div className={`hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-xs ${
              isLight 
                ? 'bg-white/80 text-[#2C2620] border-[#E8DEC8]' 
                : 'bg-white/5 text-slate-300 border-white/10'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Operational</span>
            </div>

            {/* Theme Selector Pill */}
            <ThemeSelector
              theme={theme}
              onChange={handleThemeChange}
              size="sm"
            />

            {!isNative && (
              <button
                onClick={onClose}
                title="Close"
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  isLight 
                    ? 'text-[#8E7E70] hover:text-[#1D1B18] hover:bg-black/5' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* MAIN BODY: 2 COLUMNS ON DESKTOP */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center my-auto py-2 sm:py-4">
          {/* LEFT HERO COLUMN (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-5 xl:space-y-6 pr-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center self-start gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border backdrop-blur-md shadow-xs bg-white/70 border-[#EADECE] text-[#5A4F44]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EA552E]" />
              <span>Authorized Personnel Access</span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-4xl xl:text-5xl font-black tracking-tight leading-[1.12] ${
              isLight ? 'text-[#191512]' : 'text-white'
            }`}>
              A secure gateway to <br />
              <span className="text-[#EA552E]">enterprise services.</span>
            </h1>

            {/* Subtitle / Paragraph */}
            <p className={`text-sm leading-relaxed max-w-lg font-normal ${
              isLight ? 'text-[#6A5E53]' : 'text-slate-400'
            }`}>
              Sign in to manage records, monitor operations, and access classified digital services through a unified enterprise portal built for 2026.
            </p>

            {/* 3 Feature Cards */}
            <div className="grid grid-cols-3 gap-3 max-w-lg pt-1">
              <div className={`p-3.5 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.02] ${
                isLight 
                  ? 'bg-white/80 border-[#EADECE] shadow-sm text-[#191512]' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}>
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-[#EA552E] flex items-center justify-center mb-2">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold">Zero Trust</div>
                <div className={`text-[10px] mt-0.5 ${isLight ? 'text-[#8E7E70]' : 'text-slate-400'}`}>Protocol</div>
              </div>

              <div className={`p-3.5 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.02] ${
                isLight 
                  ? 'bg-white/80 border-[#EADECE] shadow-sm text-[#191512]' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}>
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-[#EA552E] flex items-center justify-center mb-2">
                  <Fingerprint className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold">Biometric Ready</div>
                <div className={`text-[10px] mt-0.5 ${isLight ? 'text-[#8E7E70]' : 'text-slate-400'}`}>Passkey 2FA</div>
              </div>

              <div className={`p-3.5 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.02] ${
                isLight 
                  ? 'bg-white/80 border-[#EADECE] shadow-sm text-[#191512]' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}>
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-[#EA552E] flex items-center justify-center mb-2">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold">256-bit TLS</div>
                <div className={`text-[10px] mt-0.5 ${isLight ? 'text-[#8E7E70]' : 'text-slate-400'}`}>Cloudflare D1</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FLOATING CLEAN LOGIN CARD */}
          <div className="w-full lg:col-span-5 max-w-md mx-auto">
            <div className={`relative rounded-3xl p-6 sm:p-7 shadow-2xl transition-all duration-300 border ${
              isLight 
                ? 'bg-white/95 backdrop-blur-xl border-white/80 shadow-[0_20px_60px_rgba(234,85,46,0.12)] text-[#191512]' 
                : 'bg-[#111622]/95 backdrop-blur-xl border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white'
            }`}>
              {/* Floating Top Emblem */}
              <div className="flex justify-center -mt-1 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1C2638] via-[#0E1526] to-[#0A0D14] border border-cyan-500/30 flex items-center justify-center shadow-md shadow-cyan-500/20 p-2">
                  <img
                    src={LOGO_URL}
                    alt="Zentrixs Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="text-center mb-4">
                <h2 className={`text-xl font-black tracking-tight ${isLight ? 'text-[#191512]' : 'text-white'}`}>
                  {activeTab === 'company' ? 'Enterprise Portal' : 'Admin & Engineer Portal'}
                </h2>
                <p className={`text-[11px] mt-0.5 font-medium ${isLight ? 'text-[#8E7E70]' : 'text-slate-400'}`}>
                  Secure Digital Access - Management System
                </p>
              </div>

              {/* Dual Tab Segmented Switcher */}
              <div className={`p-1 rounded-xl border mb-4 grid grid-cols-2 gap-1 ${
                isLight ? 'bg-[#F5EDE3] border-[#E8DEC8]' : 'bg-black/40 border-white/10'
              }`}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('company'); setError(''); }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'company'
                      ? 'bg-[#EA552E] text-white shadow-md shadow-[#EA552E]/25'
                      : isLight ? 'text-[#6A5E53] hover:text-[#191512]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Company</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('admin'); setError(''); }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-[#EA552E] text-white shadow-md shadow-[#EA552E]/25'
                      : isLight ? 'text-[#6A5E53] hover:text-[#191512]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Notice */}
              {notice && (
                <div className={`mb-3 p-2 rounded-xl border text-xs font-medium text-center ${
                  isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                }`}>
                  {notice}
                </div>
              )}

              {/* FORM: COMPANY OR ADMIN */}
              <form onSubmit={activeTab === 'company' ? handleCompanySubmit : handleAdminSubmit} className="space-y-3">
                {/* Username / ID Field */}
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold ${isLight ? 'text-[#3E352C]' : 'text-slate-300'}`}>
                    {activeTab === 'company' ? 'Company ID / Code' : 'Mobile Number or Admin ID'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={activeTab === 'company' ? companyName : adminUsername}
                      onChange={(e) => activeTab === 'company' ? setCompanyName(e.target.value) : setAdminUsername(e.target.value)}
                      placeholder={activeTab === 'company' ? 'Enter company code' : 'Enter mobile or admin ID'}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all outline-none border ${
                        isLight 
                          ? 'bg-[#FBF7F2] border-[#E8DEC8] text-[#191512] placeholder:text-[#AFA193] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/15' 
                          : 'bg-[#181F30] border-white/10 text-white placeholder:text-slate-500 focus:border-[#EA552E] focus:ring-2 focus:ring-[#EA552E]/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold ${isLight ? 'text-[#3E352C]' : 'text-slate-300'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={(activeTab === 'company' ? showCompanyPassword : showAdminPassword) ? 'text' : 'password'}
                      required
                      value={activeTab === 'company' ? companyPassword : adminPassword}
                      onChange={(e) => activeTab === 'company' ? setCompanyPassword(e.target.value) : setAdminPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-medium transition-all outline-none border ${
                        isLight 
                          ? 'bg-[#FBF7F2] border-[#E8DEC8] text-[#191512] placeholder:text-[#AFA193] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/15' 
                          : 'bg-[#181F30] border-white/10 text-white placeholder:text-slate-500 focus:border-[#EA552E] focus:ring-2 focus:ring-[#EA552E]/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => activeTab === 'company' ? setShowCompanyPassword(p => !p) : setShowAdminPassword(p => !p)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors cursor-pointer ${
                        isLight ? 'text-[#8E7E70] hover:text-[#EA552E]' : 'text-slate-400 hover:text-white'
                      }`}
                      aria-label="Toggle password visibility"
                    >
                      {(activeTab === 'company' ? showCompanyPassword : showAdminPassword) ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className={`flex items-center gap-1.5 cursor-pointer select-none ${
                    isLight ? 'text-[#5A4F44]' : 'text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#EA552E] focus:ring-[#EA552E] border-gray-300 accent-[#EA552E]"
                    />
                    <span className="text-[11px] font-medium">Remember me</span>
                  </label>

                  <a
                    href="https://wa.me/919754253070?text=Hello%20Zentrixs,%20I%20need%20help%20recovering%20my%20login%20password."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EA552E] hover:underline text-[11px] font-semibold"
                  >
                    Forgot password?
                  </a>
                </div>

                {error && (
                  <div className={`p-2.5 rounded-xl border text-xs font-semibold text-center ${
                    isLight ? 'bg-red-50 border-red-200 text-red-600' : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {error}
                  </div>
                )}

                {/* Sign In Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-60 bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-[#EA552E]/30"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign in securely</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Badges Row below button matching reference */}
              <div className="flex items-center justify-center gap-3 text-[10px] font-medium pt-3 text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#EA552E]" />
                  <span>Secure Login</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>SSL Protected</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-blue-500" />
                  <span>256-bit</span>
                </span>
              </div>

              {/* Agreement Subtext */}
              <p className={`text-[9px] text-center mt-3 leading-normal ${
                isLight ? 'text-[#8E7E70]' : 'text-slate-500'
              }`}>
                By signing in you agree to the Portal's <a href="/privacy-policy" className="underline hover:text-[#EA552E]">Terms & Security Policy</a>
              </p>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="w-full shrink-0 pt-2 pb-2 flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium gap-1">
          <p className={isLight ? 'text-[#8E7E70]' : 'text-slate-500'}>
            © 2026 Zentrixs Portal. All rights reserved.
          </p>

          <p className={isLight ? 'text-[#8E7E70]' : 'text-slate-500'}>
            Powered by <span className="font-bold text-[#EA552E]">Zentrixs</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginModal;
