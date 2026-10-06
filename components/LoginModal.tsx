import React, { useState } from 'react';
import { X, Shield, Lock, User, Loader2, Fingerprint, Building2, ChevronRight, Sparkles, KeyRound } from 'lucide-react';
import { validateLogin } from '../services/sheetService';
import { loginCompany, loginAdmin } from '../services/taskService';
import { getStoredTheme, setStoredTheme, PortalTheme } from '../services/themeService';
import ThemeSelector from './ThemeSelector';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (user: string, role: 'admin' | 'company') => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'company' | 'admin'>('company');
  const [theme, setTheme] = useState<PortalTheme>(getStoredTheme);

  const isLight = theme === 'light';

  // Company Form State (Only ID & Password)
  const [companyName, setCompanyName] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');

  // Admin Form State (Only ID & Password)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginCompany({
      companyNameOrCode: companyName.trim(),
      password: companyPassword.trim()
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

    try {
      const sheetResult = await validateLogin(adminUsername.trim(), adminUsername.trim(), adminPassword.trim());
      if (sheetResult.success) {
        await loginAdmin({ username: sheetResult.user || adminUsername.trim(), idCode: adminUsername.trim() });
        onSuccess(sheetResult.user || adminUsername.trim(), 'admin');
        setLoading(false);
        return;
      }
    } catch {
      // Continue to local/cloudflare admin
    }

    const res = await loginAdmin({
      username: adminUsername.trim(),
      idCode: adminUsername.trim(),
      password: adminPassword.trim()
    });

    if (res.success && res.session) {
      onSuccess(res.session.user, 'admin');
    } else {
      setError('Access Denied: Invalid Admin ID or Password.');
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

      {/* Main Glassmorphic Modal Card */}
      <div className={`relative w-full max-w-md rounded-[2.25rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border transition-all my-6 ${
        isLight 
          ? 'bg-gradient-to-b from-[#FFFFFF] via-[#FDFBF7] to-[#F7F2EA] border-[#E8DEC8] text-[#2A2118] shadow-[0_25px_60px_-15px_rgba(234,85,46,0.18)]' 
          : 'bg-gradient-to-b from-[#0F1422]/95 via-[#0B0E17]/95 to-[#06080E]/98 border-white/15 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.12)]'
      }`}>
        {/* Subtle Ambient Top Glow */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-orange-400/20' : 'bg-cyan-500/20'
        }`} />

        {/* Top Gradient Border Line */}
        <div className={`h-1.5 w-full ${
          isLight 
            ? 'bg-gradient-to-r from-[#F0653A] via-[#EA552E] to-[#D9481F]' 
            : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500'
        }`} />

        <div className="p-6 sm:p-8">
          {/* Header Bar: Theme Selector + Security Tag + Close Button */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-inherit/40">
            <ThemeSelector
              theme={theme}
              onChange={setTheme}
              size="sm"
            />

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border shadow-sm ${
              isLight 
                ? 'bg-[#FDF3E7] text-[#EA552E] border-[#F5D5C3]' 
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-cyan-500/10'
            }`}>
              <Sparkles className="w-3 h-3" />
              <span>Secure Gateway</span>
            </div>

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
          </div>

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
                      type="password"
                      required
                      value={companyPassword}
                      onChange={(e) => setCompanyPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold transition-all outline-none border ${
                        isLight 
                          ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/15' 
                          : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:bg-[#0E1526] focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                    />
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

          {/* SUPER ADMIN LOGIN TAB */}
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
                  Super Admin Access
                </h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                  Enter master admin credentials
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`block text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                    Admin Username / ID
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
                      placeholder="ADMIN ID"
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
                    Admin Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isLight ? 'text-[#B5A892] group-focus-within:text-[#EA552E]' : 'text-slate-500 group-focus-within:text-cyan-400'
                    }`} />
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold transition-all outline-none border ${
                        isLight 
                          ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/15' 
                          : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:bg-[#0E1526] focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                    />
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
          <div className="mt-6 pt-4 border-t border-inherit/40 text-center">
            <p className={`text-[10px] font-mono flex items-center justify-center gap-1.5 ${
              isLight ? 'text-[#9C8F7D]' : 'text-slate-500'
            }`}>
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>End-to-End Encrypted Tunnel</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
