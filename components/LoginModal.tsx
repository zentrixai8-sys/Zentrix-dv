import React, { useState } from 'react';
import { X, Shield, Lock, User, Loader2, Fingerprint, Building2, ChevronRight, Sparkles, KeyRound, Eye, EyeOff, Zap } from 'lucide-react';
import { validateLogin } from '../services/sheetService';
import { loginCompany, loginAdmin, setAuthSession } from '../services/taskService';
import { getStoredTheme, setStoredTheme, PortalTheme } from '../services/themeService';
import ThemeSelector from './ThemeSelector';
import { Capacitor } from '@capacitor/core';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (user: string, role: 'admin' | 'company') => void;
  notice?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess, notice }) => {
  const [activeTab, setActiveTab] = useState<'company' | 'admin'>('company');
  const [theme, setTheme] = useState<PortalTheme>(getStoredTheme);

  const handleThemeChange = (newTheme: PortalTheme) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const isLight = theme === 'light';

  // Company Form State (Only ID & Password)
  const [companyName, setCompanyName] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');
  const [showCompanyPassword, setShowCompanyPassword] = useState(false);

  // Admin Form State (Only ID & Password)
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dynamic Animated Backdrop */}
      <div 
        className={`fixed inset-0 transition-all duration-300 ${
          isLight 
            ? 'bg-slate-900/50 backdrop-blur-md' 
            : 'bg-black/80 backdrop-blur-xl'
        }`} 
        onClick={onClose}
      />

      {/* Main Glassmorphic Modal Card - Enhanced 2-Column on Desktop */}
      <div className={`relative w-full max-w-md md:max-w-4xl rounded-[2.25rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border transition-all my-auto ${
        isLight 
          ? 'bg-gradient-to-b from-[#FFFFFF] via-[#FDFBF7] to-[#F7F2EA] border-[#E8DEC8] text-[#2A2118] shadow-[0_30px_90px_-15px_rgba(234,85,46,0.22)]' 
          : 'bg-gradient-to-b from-[#0F1422]/98 via-[#0B0E17]/98 to-[#06080E]/98 border-white/15 text-white shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(6,182,212,0.15)]'
      }`}>
        {/* Subtle Ambient Top Glow */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-orange-400/20' : 'bg-cyan-500/20'
        }`} />

        {/* Top Gradient Border Line */}
        <div className={`h-1.5 w-full ${
          isLight 
            ? 'bg-gradient-to-r from-[#F0653A] via-[#EA552E] to-[#D9481F]' 
            : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500'
        }`} />

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-full">
          {/* LEFT DESKTOP BRANDING & HIGHLIGHT SHOWCASE PANEL (Visible on md+) */}
          <div className={`hidden md:flex md:col-span-5 flex-col justify-between p-8 border-r relative overflow-hidden ${
            isLight 
              ? 'bg-gradient-to-br from-[#FFF8EE] via-[#FDF4E7] to-[#F7ECE0] border-[#E8DEC8]' 
              : 'bg-gradient-to-br from-[#0B101E] via-[#090D18] to-[#04060B] border-white/10'
          }`}>
            {/* Ambient Graphic Circle */}
            <div className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-2xl pointer-events-none ${
              isLight ? 'bg-orange-300/30' : 'bg-blue-600/20'
            }`} />

            {/* Brand Logo & Title */}
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-md ${
                  isLight ? 'bg-[#EA552E] text-white border-[#EA552E]/30' : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-black border-cyan-400/40'
                }`}>
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className={`text-lg font-black tracking-wider uppercase font-sans ${isLight ? 'text-[#1C1610]' : 'text-white'}`}>
                    ZENTRIXS
                  </h3>
                  <span className={`text-[10px] font-bold tracking-widest uppercase block ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>
                    SYSTEM CLOUD
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className={`text-xl font-black leading-tight tracking-tight ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                  {activeTab === 'company' ? 'Enterprise Client Gateway' : 'Engineering Command & Workload'}
                </h4>
                <p className={`text-xs mt-2 leading-relaxed font-medium ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                  {activeTab === 'company'
                    ? 'Raise instant priority support tickets, monitor connected enterprise systems, verify milestones and collaborate seamlessly with our engineering architects.'
                    : 'Manage task delegation, track company ticket queues, resolve bug updates and monitor live team workload in real time.'}
                </p>
              </div>

              {/* Feature Points */}
              <div className="space-y-2.5 pt-4">
                {[
                  { title: 'Cloudflare D1 & Sync', desc: 'Encrypted low-latency live persistence' },
                  { title: 'Strict Role Privacy', desc: 'Secure authorized access for clients & team' },
                  { title: 'Instant Push Alerts', desc: 'Strict notifications on ticket dispatch & close' },
                ].map((feat, i) => (
                  <div key={i} className={`p-2.5 rounded-2xl border text-xs flex items-center gap-2.5 transition-all ${
                    isLight ? 'bg-white/70 border-[#EDE2D3] shadow-xs' : 'bg-white/5 border-white/5 shadow-inner'
                  }`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isLight ? 'bg-[#EA552E]' : 'bg-cyan-400'}`} />
                    <div className="min-w-0">
                      <span className={`font-bold block text-[11px] ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{feat.title}</span>
                      <span className={`text-[10px] block truncate ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>{feat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Left Badge */}
            <div className="pt-6 relative z-10">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border shadow-xs ${
                isLight ? 'bg-white border-[#EDE2D3] text-[#7A6B58]' : 'bg-black/40 border-white/10 text-slate-400'
              }`}>
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>256-bit Encrypted Portal</span>
              </div>
            </div>
          </div>

          {/* RIGHT LOGIN FORM PANEL (7 cols on md+) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          {/* Header Bar: Theme Selector + Powered By Zentrixs + Close Button */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-inherit/40">
            <ThemeSelector
              theme={theme}
              onChange={handleThemeChange}
              size="sm"
            />

            <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border shadow-xs ${
              isLight 
                ? 'bg-[#FDF3E7] text-[#EA552E] border-[#F5D5C3]' 
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-cyan-500/10'
            }`}>
              <span>Powered by Zentrixs</span>
            </div>

            {!Capacitor.isNativePlatform() && (
              <button
                onClick={onClose}
                title="Close modal"
                className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  isLight 
                    ? 'text-[#9C8F7D] hover:text-[#2A2118] hover:bg-[#F0E6D6]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Session Expiry / Info Notice */}
          {notice && (
            <div className={`mb-5 p-3 rounded-xl border text-xs font-bold text-center ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              {notice}
            </div>
          )}

          {/* Segmented Dual Switcher Tabs */}
          <div className={`p-1.5 rounded-2xl border mb-7 grid grid-cols-2 gap-1.5 shadow-inner ${
            isLight 
              ? 'bg-[#F4ECE0] border-[#E5DAC8]' 
              : 'bg-black/50 border-white/10'
          }`}>
            <button
              type="button"
              onClick={() => {
                setActiveTab('company');
                setError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'company'
                  ? isLight
                    ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] text-white shadow-md shadow-[#EA552E]/30'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : isLight
                    ? 'text-[#7A6B58] hover:text-[#2A2118] hover:bg-[#EBE0CF]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Company</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'admin'
                  ? isLight
                    ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] text-white shadow-md shadow-[#EA552E]/30'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : isLight
                    ? 'text-[#7A6B58] hover:text-[#2A2118] hover:bg-[#EBE0CF]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Admin</span>
            </button>
          </div>

          {/* COMPANY LOGIN TAB */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-3 shadow-md ${
                  isLight 
                    ? 'bg-[#FDEEE7] border-[#F5D5C3] text-[#EA552E] shadow-[#EA552E]/10' 
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-cyan-500/20'
                }`}>
                  <Building2 className="w-7 h-7" />
                </div>
                <h2 className={`text-xl font-black tracking-tight ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                  Company Portal Login
                </h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                  Enter your assigned ID & password
                </p>
              </div>

              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`block text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                    Company ID / Code
                  </label>
                  <div className="relative group">
                    <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isLight ? 'text-[#B5A892] group-focus-within:text-[#EA552E]' : 'text-slate-500 group-focus-within:text-cyan-400'
                    }`} />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. CIRTICARE01"
                      className={`w-full rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold transition-all uppercase outline-none border ${
                        isLight 
                          ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/15' 
                          : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:bg-[#0E1526] focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                    Password
                  </label>
                  <div className="relative group">
                    <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isLight ? 'text-[#B5A892] group-focus-within:text-[#EA552E]' : 'text-slate-500 group-focus-within:text-cyan-400'
                    }`} />
                    <input
                      type={showCompanyPassword ? 'text' : 'password'}
                      required
                      value={companyPassword}
                      onChange={(e) => setCompanyPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-2xl pl-11 pr-11 py-3.5 text-xs font-bold transition-all outline-none border ${
                        isLight 
                          ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/15' 
                          : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:bg-[#0E1526] focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCompanyPassword(prev => !prev)}
                      aria-label={showCompanyPassword ? 'Hide password' : 'Show password'}
                      title={showCompanyPassword ? 'Hide password' : 'Show password'}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors cursor-pointer ${
                        isLight
                          ? 'text-[#9C8F7D] hover:text-[#EA552E] hover:bg-[#F0E6D6]/70'
                          : 'text-slate-400 hover:text-cyan-400 hover:bg-white/10'
                      }`}
                    >
                      {showCompanyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={`p-3 rounded-xl border text-xs font-bold text-center ${
                    isLight ? 'bg-red-50 border-red-200 text-red-600' : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                    isLight 
                      ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-[#EA552E]/30' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-cyan-500/25'
                  }`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
                  {!loading && <ChevronRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          )}

          {/* SUPER ADMIN & ENGINEER LOGIN TAB */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-3 shadow-md relative ${
                  isLight 
                    ? 'bg-[#FDEEE7] border-[#F5D5C3] text-[#EA552E] shadow-[#EA552E]/10' 
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-cyan-500/20'
                }`}>
                  <Fingerprint className="w-7 h-7" />
                  <div className="absolute inset-0 border border-current rounded-2xl animate-ping opacity-20 pointer-events-none" />
                </div>
                <h2 className={`text-xl font-black tracking-tight ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                  Admin & Engineer Console
                </h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                  Login via Master ID or Engineer Mobile Number
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`block text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                    Mobile Number or Admin ID
                  </label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isLight ? 'text-[#B5A892] group-focus-within:text-[#EA552E]' : 'text-slate-500 group-focus-within:text-cyan-400'
                    }`} />
                    <input
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="e.g. 9876543210 or ADMIN"
                      className={`w-full rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold transition-all outline-none border ${
                        isLight 
                          ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/15' 
                          : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:bg-[#0E1526] focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isLight ? 'text-[#B5A892] group-focus-within:text-[#EA552E]' : 'text-slate-500 group-focus-within:text-cyan-400'
                    }`} />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-2xl pl-11 pr-11 py-3.5 text-xs font-bold transition-all outline-none border ${
                        isLight 
                          ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/15' 
                          : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:bg-[#0E1526] focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(prev => !prev)}
                      aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                      title={showAdminPassword ? 'Hide password' : 'Show password'}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors cursor-pointer ${
                        isLight
                          ? 'text-[#9C8F7D] hover:text-[#EA552E] hover:bg-[#F0E6D6]/70'
                          : 'text-slate-400 hover:text-cyan-400 hover:bg-white/10'
                      }`}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={`p-3 rounded-xl border text-xs font-bold text-center ${
                    isLight ? 'bg-red-50 border-red-200 text-red-600' : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                    isLight 
                      ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-[#EA552E]/30' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-cyan-500/25'
                  }`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
                  {!loading && <ChevronRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          )}

            {/* Footer Security Badge */}
            <div className="mt-6 pt-4 border-t border-inherit/40 text-center space-y-1">
              <p className={`text-[10px] font-mono flex items-center justify-center gap-1.5 ${
                isLight ? 'text-[#9C8F7D]' : 'text-slate-500'
              }`}>
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>End-to-End Encrypted Tunnel</span>
              </p>
              <p className={`text-[9px] font-bold uppercase tracking-wider ${
                isLight ? 'text-[#8A7B68]' : 'text-slate-400'
              }`}>
                Powered by <span className={isLight ? 'text-[#EA552E]' : 'text-cyan-400'}>Zentrixs</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
