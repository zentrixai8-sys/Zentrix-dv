import React, { useState } from 'react';
import { X, Shield, Lock, User, Loader2, Fingerprint, Building2, ChevronRight, Check, Sun, Moon } from 'lucide-react';
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

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setStoredTheme(next);
  };

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
      <div 
        className={`fixed inset-0 transition-colors ${
          isLight ? 'bg-slate-900/40 backdrop-blur-md' : 'bg-black/85 backdrop-blur-xl'
        }`} 
        onClick={onClose}
      />

      <div className={`relative w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in my-8 border transition-all ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/10' 
          : 'bg-zinc-950 border-white/10 text-white shadow-black/80'
      }`}>
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600"></div>

        {/* Theme Selector (Light / Dark) */}
        <ThemeSelector
          theme={theme}
          onChange={setTheme}
          size="sm"
          className="absolute top-4 left-5 z-10"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-6 transition-colors z-10 p-2 rounded-xl cursor-pointer ${
            isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10 pt-16">
          {/* Dual Login Role Switcher Tabs */}
          <div className={`flex p-1 rounded-2xl border mb-8 ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <button
              type="button"
              onClick={() => {
                setActiveTab('company');
                setError('');
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'company'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Company Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setError('');
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </button>
          </div>

          {/* COMPANY LOGIN TAB (Only ID & Password) */}
          {activeTab === 'company' && (
            <div>
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${
                  isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-blue-600/10 border-blue-500/20 text-blue-400'
                }`}>
                  <Building2 className="w-8 h-8" />
                </div>
                <h2 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Company Portal Login
                </h2>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Enter Your Company ID & Password
                </p>
              </div>

              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div className="relative group">
                  <Building2 className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    isLight ? 'text-slate-400 group-focus-within:text-blue-600' : 'text-gray-400 group-focus-within:text-blue-500'
                  }`} />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="COMPANY ID / CODE (e.g. CIRTICARE01)"
                    className={`w-full rounded-2xl pl-14 pr-5 py-4 text-xs font-bold transition-all uppercase outline-none border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white' 
                        : 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="relative group">
                  <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    isLight ? 'text-slate-400 group-focus-within:text-blue-600' : 'text-gray-400 group-focus-within:text-blue-500'
                  }`} />
                  <input
                    type="password"
                    required
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    placeholder="PASSWORD"
                    className={`w-full rounded-2xl pl-14 pr-5 py-4 text-xs font-bold transition-all outline-none border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white' 
                        : 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500'
                    }`}
                  />
                </div>

                {error && <p className="text-red-500 text-xs font-bold tracking-wide text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs tracking-wider uppercase transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter Company Dashboard'}
                  {!loading && <ChevronRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          )}

          {/* SUPER ADMIN LOGIN TAB (Only ID & Password) */}
          {activeTab === 'admin' && (
            <div>
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-4 relative ${
                  isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-blue-600/10 border-blue-500/20 text-blue-500'
                }`}>
                  <Fingerprint className="w-8 h-8" />
                  <div className="absolute inset-0 border border-blue-500/40 rounded-2xl animate-ping opacity-20 pointer-events-none"></div>
                </div>
                <h2 className={`text-2xl font-black tracking-tight uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Super Admin Access
                </h2>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Enter Admin Username / ID & Password
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="relative group">
                  <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    isLight ? 'text-slate-400 group-focus-within:text-blue-600' : 'text-gray-400 group-focus-within:text-blue-500'
                  }`} />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="ADMIN USERNAME / ID"
                    className={`w-full rounded-2xl pl-14 pr-5 py-4 text-xs font-black tracking-widest transition-all uppercase outline-none border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white' 
                        : 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="relative group">
                  <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    isLight ? 'text-slate-400 group-focus-within:text-blue-600' : 'text-gray-400 group-focus-within:text-blue-500'
                  }`} />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="PASSWORD"
                    className={`w-full rounded-2xl pl-14 pr-5 py-4 text-xs font-black tracking-widest transition-all uppercase outline-none border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white' 
                        : 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500'
                    }`}
                  />
                </div>

                {error && <p className="text-red-500 text-xs font-bold tracking-wide text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Decrypt & Connect'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
