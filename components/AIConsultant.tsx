
import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Send, Loader2, User, Terminal } from 'lucide-react';
import { getCareerAdvice } from '../services/geminiService';
import { COMPANY_NAME } from '../constants';

const AIConsultant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt;
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    setLoading(true);
    const advice = await getCareerAdvice(`Architecture query: ${userMsg}`);
    setMessages(prev => [...prev, { role: 'ai', text: advice }]);
    setLoading(false);
  };

  return (
    <section id="ai" className="py-32 relative bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3 reveal reveal-left">
            <span className="text-blue-500 font-black tracking-[0.4em] text-[10px] uppercase mb-6 block">AI Assistant</span>
            <h3 className="text-5xl font-black text-white leading-tight tracking-tighter mb-8 italic">
              Ask <span className="text-blue-500">ZENTRIX</span> <span className="font-thin text-gray-500">Expert.</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-10 uppercase tracking-widest font-medium">
              Have questions? Tell our AI about your business problems, and it will suggest the best solutions for you.
            </p>
            <div className="space-y-4">
              {['How to save money?', 'Automate my shop', 'I need a website'].map(tag => (
                <div key={tag} className="px-4 py-2 border border-white/5 bg-white/5 rounded-lg text-[10px] text-gray-400 font-black tracking-widest uppercase inline-block mr-2">
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-2/3 glass rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl reveal reveal-right stagger-1">
            <div className="bg-black/50 p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                  <Cpu className="text-blue-500 w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-white text-xs font-black tracking-[0.2em] uppercase">AI Consultant</p>
                  <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Online...</p>
                </div>
              </div>
              <div className="hidden sm:flex gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
              </div>
            </div>

            <div ref={scrollRef} className="h-[500px] overflow-y-auto p-10 space-y-8 precision-scrollbar bg-[#050505]/60">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Terminal className="w-16 h-16 mb-6 text-blue-500" />
                  <p className="text-white font-black text-xs uppercase tracking-[0.4em]">Start Conversation</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-blue-600/20 border border-blue-500/30'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-gray-500" /> : <Cpu className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className={`max-w-[85%] p-6 rounded-3xl text-sm leading-relaxed font-medium ${msg.role === 'user' ? 'bg-zinc-900 text-gray-300 rounded-tr-none' : 'glass text-white rounded-tl-none border-blue-500/10'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  </div>
                  <div className="glass p-6 rounded-3xl rounded-tl-none w-24 flex items-center justify-center border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-8 bg-black/40 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Query system architect..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-6 text-white text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-all pr-20 uppercase tracking-widest placeholder:opacity-30"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-xl hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIConsultant;
