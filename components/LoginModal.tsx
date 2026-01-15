
import React, { useState } from 'react';
import { X, Shield, Lock, User, Loader2, Fingerprint } from 'lucide-react';
import { validateLogin } from '../services/sheetService';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (user: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await validateLogin(username, id, password);
    
    if (result.success) {
      onSuccess(result.user || username);
    } else {
      setError(result.error || 'Access Denied: Neural mismatch.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-violet-600"></div>
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] border border-blue-500/20 flex items-center justify-center mx-auto mb-8 relative group">
            <Fingerprint className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 border border-blue-500/40 rounded-[2rem] animate-ping opacity-20 pointer-events-none"></div>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Initialize Link</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-12">Authorized Core Personnel Only</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="USER NAME"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-black tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-600"
              />
            </div>

            <div className="relative group">
              <Shield className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="ID CODE"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-black tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-600"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ACCESS KEY"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-black tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-600"
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Decrypt & Connect'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
