
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PHONE_NUMBER, SECOND_PHONE_NUMBER, EMAIL, ADDRESS } from '../constants';

const ContactSection: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (form.name.length < 2) return 'Name is required.';
    if (!/^\d{10}$/.test(form.phone)) return 'Enter valid 10-digit phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter valid email address.';
    if (form.message.length < 10) return 'Please describe your request in more detail (min 10 chars).';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    
    // Construct the direct mailto link to satisfy "direct is mail id pe mail aa jaye"
    const subject = encodeURIComponent(`ZENTRIX Demo Request: ${form.name}`);
    const body = encodeURIComponent(
      `Protocol Initialization Request\n` +
      `----------------------------\n` +
      `Client Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Email: ${form.email}\n` +
      `Message: ${form.message}\n` +
      `----------------------------\n` +
      `Source: ZENTRIX Web Terminal`
    );
    
    // Open mail client immediately
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    // Simulate system update
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          <div className="reveal reveal-left active">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tighter italic uppercase">Ready to Build <br /><span className="text-cyan-500">the Future?</span></h2>
            <p className="text-xl text-gray-400 mb-12 font-medium uppercase tracking-tight italic">
              Book your discovery call. Our engines are ready to <span className="text-white">transform your workflows.</span>
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.open(`tel:${PHONE_NUMBER}`)}>
                <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all border border-blue-500/20">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Primary Node</h4>
                  <p className="text-2xl font-black text-white italic tracking-tighter">{PHONE_NUMBER}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.open(`tel:${SECOND_PHONE_NUMBER}`)}>
                <div className="bg-cyan-600/10 p-4 rounded-2xl text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all border border-cyan-500/20">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Secondary Node</h4>
                  <p className="text-2xl font-black text-white italic tracking-tighter">{SECOND_PHONE_NUMBER}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.location.href = `mailto:${EMAIL}`}>
                <div className="bg-violet-600/10 p-4 rounded-2xl text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all border border-violet-500/20">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Data Recipient</h4>
                  <p className="text-2xl font-black text-white italic tracking-tighter truncate max-w-[280px] md:max-w-none">{EMAIL}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-500 border border-blue-500/20">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Operation Hub</h4>
                  <p className="text-2xl font-black text-white italic tracking-tighter">{ADDRESS}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-12 rounded-[3.5rem] border border-white/5 relative reveal reveal-right active">
            <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-blue-600/20 blur-2xl rounded-full"></div>
            <h3 className="text-2xl font-black text-white mb-8 uppercase italic tracking-tighter">Initialize Consultation</h3>
            
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">Protocol Dispatched</h4>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-xs mx-auto">Redirecting payload to secure terminal...</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-8 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
                >
                  Create New Request
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-[#050505] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-zinc-700 focus:border-cyan-500 outline-none transition-all uppercase font-black text-xs tracking-widest" 
                    placeholder="Operator Name" 
                  />
                  <input 
                    type="tel" 
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full bg-[#050505] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-zinc-700 focus:border-cyan-500 outline-none transition-all uppercase font-black text-xs tracking-widest" 
                    placeholder="Terminal ID (Phone)" 
                  />
                </div>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-zinc-700 focus:border-cyan-500 outline-none transition-all font-black text-xs tracking-widest" 
                  placeholder="Business Protocol (Email)" 
                />
                <textarea 
                  rows={4} 
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-zinc-700 focus:border-cyan-500 outline-none transition-all resize-none uppercase font-black text-xs tracking-widest" 
                  placeholder="Define scope for automation..."
                ></textarea>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/5 p-4 rounded-2xl border border-red-500/20 italic">
                    <AlertCircle className="w-3.5 h-3.5" /> Error: {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black text-xs tracking-[0.4em] uppercase shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>Initialize Link <Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
