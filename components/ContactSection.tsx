
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2, Bot, MessageCircle, Sparkles } from 'lucide-react';
import { PHONE_NUMBER, PHONE_NUMBER_2, AI_BOT_NUMBER, EMAIL, ADDRESS } from '../constants';
import { addDemoBookingToSheet } from '../services/sheetService';

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

    try {
      const result = await addDemoBookingToSheet(form);
      if (result.success) {
        setSuccess(true);
        setForm({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError('Failed to synchronize booking with core database. Please try again.');
      }
    } catch (err) {
      setError('System connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="reveal reveal-left">
            <h2 className="text-4xl font-extrabold text-white mb-8">Ready to Build the Future?</h2>
            <p className="text-xl text-gray-400 mb-12">
              Book your free 15-minute discovery call to see how AI can transform your specific business workflows.
            </p>

            <div className="space-y-8">
              {/* Zentrix AI Assistant WhatsApp Chatbot Card */}
              <div
                className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-zinc-900/60 border border-cyan-500/30 group hover:border-cyan-400 transition-all cursor-pointer shadow-[0_0_35px_rgba(6,182,212,0.15)]"
                onClick={() => window.open(`https://wa.me/91${AI_BOT_NUMBER}?text=Hi%20Zentrix%20AI%20Assistant,%20I%20want%20to%20know%20more%20about%20your%20services`, '_blank')}
              >
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-l from-cyan-500 to-blue-600 text-[10px] font-black tracking-widest text-white uppercase rounded-bl-2xl flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  24/7 AI Online
                </div>
                <div className="flex items-start gap-5">
                  <div className="bg-cyan-500/20 p-4 rounded-2xl text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
                    <Bot className="w-8 h-8" />
                  </div>
                  <div className="min-w-0 pr-12">
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Zentrix AI Assistant (Chatbot)
                    </h4>
                    <p className="text-2xl sm:text-3xl font-black text-white tracking-wider font-mono hover:text-cyan-300 transition-colors">
                      +91 {AI_BOT_NUMBER}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                      Live WhatsApp chatbot for instant automation inquiries, support & live demos.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                      <MessageCircle className="w-4 h-4 text-green-400" /> Click to Chat on WhatsApp →
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Call Us (Direct)</h4>
                  <div className="space-y-2">
                    <p
                      className="text-2xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
                      onClick={() => window.open(`tel:${PHONE_NUMBER}`)}
                    >
                      {PHONE_NUMBER}
                    </p>
                    {PHONE_NUMBER_2 && (
                      <p
                        className="text-2xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
                        onClick={() => window.open(`tel:${PHONE_NUMBER_2}`)}
                      >
                        {PHONE_NUMBER_2}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.open(`mailto:${EMAIL}`)}>
                <div className="bg-violet-600/10 p-4 rounded-2xl text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Email</h4>
                  <p className="text-lg sm:text-2xl font-bold text-white break-words">{EMAIL}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-500">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Office Location</h4>
                  <p className="text-lg sm:text-2xl font-bold text-white mb-2 break-words">{ADDRESS}</p>
                  <span className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-[10px] font-black uppercase tracking-widest text-green-500">
                    Raipur Based Company
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal reveal-right glass p-12 rounded-[2.5rem] border border-white/5 relative">
            <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-blue-600/20 blur-2xl rounded-full"></div>
            <h3 className="text-2xl font-bold text-white mb-8">Secure Your AI Consultation</h3>

            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/30">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Protocol Initialized</h4>
                <p className="text-gray-400 text-sm uppercase tracking-widest">Our engineers will contact you shortly.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-8 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Your Name"
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Phone Number"
                  />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Business Email"
                />
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="What part of your business would you like to automate?"
                ></textarea>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/5 p-3 rounded-xl border border-red-500/20">
                    <AlertCircle className="w-3 h-3" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>Send Request <Send className="w-5 h-5" /></>
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
