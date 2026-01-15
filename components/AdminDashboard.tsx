
import React, { useState, useEffect } from 'react';
import { Database, Plus, Image as ImageIcon, MessageSquare, Send, Loader2, Share2, Save, ArrowLeft, RefreshCw, Globe, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { addTestimonialToSheet, fetchTestimonialsFromSheet, fetchSettingsFromSheet, updateSettingsInSheet } from '../services/sheetService';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'social'>('clients');
  const [formData, setFormData] = useState({ name: '', logo: '', feedback: '' });
  const [socialData, setSocialData] = useState({
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    whatsapp: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [clientCount, setClientCount] = useState(0);

  const loadData = async () => {
    setFetching(true);
    const clients = await fetchTestimonialsFromSheet();
    const settings = await fetchSettingsFromSheet();
    
    if (clients) setClientCount(clients.length);
    if (settings) {
      setSocialData({
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        linkedin: settings.linkedin || '',
        twitter: settings.twitter || '',
        whatsapp: settings.whatsapp || ''
      });
    }
    setFetching(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await addTestimonialToSheet(formData);
    if (result.success) {
      setSuccess(true);
      setFormData({ name: '', logo: '', feedback: '' });
      await loadData();
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleSaveSocial = async () => {
    setLoading(true);
    const result = await updateSettingsInSheet(socialData as any);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <button onClick={onClose} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
          <ArrowLeft className="w-4 h-4" /> Exit Terminal
        </button>
        
        <div className="flex bg-[#0A0A0A] p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'clients' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Client Management
          </button>
          <button 
            onClick={() => setActiveTab('social')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'social' ? 'bg-cyan-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Social Protocol
          </button>
        </div>
      </div>

      {activeTab === 'clients' ? (
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-12 shadow-3xl">
            <h2 className="text-2xl font-black text-white uppercase italic mb-10 tracking-tighter">Append Client Node</h2>
            <form onSubmit={handleSubmitClient} className="space-y-8">
              <input 
                type="text" placeholder="CLIENT NAME" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#121212] border border-white/5 rounded-2xl px-8 py-5 text-sm font-medium text-white focus:border-blue-500/30 outline-none uppercase"
              />
              <input 
                type="text" placeholder="LOGO URL (IMGBB/HOSTED)" required
                value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})}
                className="w-full bg-[#121212] border border-white/5 rounded-2xl px-8 py-5 text-sm font-medium text-white focus:border-blue-500/30 outline-none"
              />
              <textarea 
                placeholder="CLIENT FEEDBACK..." required rows={4}
                value={formData.feedback} onChange={e => setFormData({...formData, feedback: e.target.value})}
                className="w-full bg-[#121212] border border-white/5 rounded-2xl px-8 py-5 text-sm font-medium text-white focus:border-blue-500/30 outline-none uppercase resize-none"
              />
              <button 
                type="submit" disabled={loading}
                className={`w-full py-6 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase transition-all ${success ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Synchronize Data'}
              </button>
            </form>
          </div>
          <div className="lg:col-span-4 bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-12">
            <h3 className="text-xl font-black text-white uppercase italic mb-6">Database Health</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <span>Active Nodes:</span>
                <span className="text-white">{clientCount}</span>
              </div>
              <div className="pt-6 border-t border-white/5">
                <RefreshCw onClick={loadData} className={`w-5 h-5 text-blue-500 cursor-pointer ${fetching ? 'animate-spin' : ''}`} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-12 shadow-3xl">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-inner">
              <Share2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">Social <span className="text-cyan-500">Protocol.</span></h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] mt-2">Update Global Access Links</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-12">
            {[
              { id: 'facebook', icon: Facebook, label: 'Facebook URL' },
              { id: 'instagram', icon: Instagram, label: 'Instagram URL' },
              { id: 'linkedin', icon: Linkedin, label: 'LinkedIn URL' },
              { id: 'twitter', icon: Twitter, label: 'Twitter URL' },
              { id: 'whatsapp', icon: Globe, label: 'WhatsApp Link' }
            ].map(social => (
              <div key={social.id} className="space-y-3">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                  <social.icon className="w-3 h-3" /> {social.label}
                </label>
                <input 
                  type="text" 
                  value={(socialData as any)[social.id]}
                  onChange={e => setSocialData({...socialData, [social.id]: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-[#121212] border border-white/5 rounded-2xl px-6 py-4 text-xs font-medium text-white focus:border-cyan-500/30 outline-none"
                />
              </div>
            ))}
          </div>

          <button 
            onClick={handleSaveSocial} disabled={loading}
            className={`w-full py-7 rounded-3xl font-black text-xs tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 ${success ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-500 shadow-2xl active:scale-95'}`}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-5 h-5" /> Overwrite Protocol</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
