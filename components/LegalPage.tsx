
import React, { useEffect } from 'react';
/* Added Mail to lucide-react imports */
import { ArrowLeft, Shield, FileText, Lock, Globe, Terminal, Activity, ShieldCheck, Mail } from 'lucide-react';
import { COMPANY_NAME, EMAIL, TAGLINE } from '../constants';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const isPrivacy = type === 'privacy';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <div className="min-h-screen bg-[#020202] pt-40 pb-32 px-6 relative overflow-hidden selection:bg-cyan-500/30">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }}>
      </div>
      
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-600/5 blur-[160px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none"></div>

      {/* THE SCANNING BEAM */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-20">
        <div className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_#06b6d4] animate-scan-line"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-zinc-500 hover:text-cyan-400 transition-all text-[10px] font-black uppercase tracking-[0.5em] mb-16 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Return to Terminal
        </button>

        <div className="relative p-1 md:p-1.5 bg-gradient-to-br from-white/10 to-transparent rounded-[4rem] shadow-3xl">
          <div className="relative bg-[#050505]/90 backdrop-blur-3xl rounded-[3.8rem] p-10 md:p-20 overflow-hidden border border-white/5">
            
            {/* HUD HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-cyan-600/10 rounded-3xl flex items-center justify-center border border-cyan-500/20 text-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                  {isPrivacy ? <Shield className="w-10 h-10" /> : <FileText className="w-10 h-10" />}
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
                    {isPrivacy ? 'Privacy' : 'Terms'} <span className="text-zinc-800">Protocol.</span>
                  </h1>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.4em]">Node ID: ZEN-LGL-001</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end opacity-50">
                 <div className="mono text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-1">Last Update</div>
                 <div className="mono text-xs text-white font-black uppercase tracking-widest italic">OCT_2025_REV</div>
              </div>
            </div>

            {/* CONTENT STREAM */}
            <div className="space-y-16 text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
              
              <section className="relative group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-6 bg-cyan-500"></div>
                  <h3 className="text-white font-black text-xs uppercase tracking-[0.4em] flex items-center gap-3">
                    <Globe className="w-4 h-4 text-cyan-500" /> Operational Overview
                  </h3>
                </div>
                <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl italic text-zinc-500 border-l-cyan-500/50 border-l-4">
                  "This legal interface defines the mandatory engagement parameters of the {COMPANY_NAME} Hyper-Automation Ecosystem. Engagement with any node signifies complete compliance with documented protocols."
                </div>
              </section>

              <section className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6 p-8 bg-white/[0.02] rounded-3xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-4 h-4 text-cyan-500" />
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Data Encryption</h4>
                  </div>
                  <p className="text-xs leading-relaxed uppercase tracking-tight">
                    {isPrivacy 
                      ? "ZENTRIX employs AES-256 end-to-end encryption for all business logic and customer metadata. Your terminal logs are never exposed to external neural networks without explicit authentication." 
                      : "User access is strictly bound to authorized terminal IDs. Any unauthorized attempt to breach the core architecture will result in immediate node disconnection."}
                  </p>
                </div>
                
                <div className="space-y-6 p-8 bg-white/[0.02] rounded-3xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Terminal className="w-4 h-4 text-cyan-500" />
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest">System Integrity</h4>
                  </div>
                  <p className="text-xs leading-relaxed uppercase tracking-tight">
                    All automation scripts (WhatsApp, Custom Software, Cloud Infrastructure) are audited for performance leaks. ZENTRIX maintains zero-knowledge logs of proprietary client algorithms.
                  </p>
                </div>
              </section>

              <section className="space-y-8">
                <h3 className="text-white font-black text-xs uppercase tracking-[0.4em] flex items-center gap-3">
                  <Activity className="w-4 h-4 text-cyan-500" /> Protocol Directives
                </h3>
                <div className="grid gap-4">
                   {['Identity Verification Protocols', 'Hyper-Automation Usage Rights', 'Global API Rate Limits', 'Intellectual Asset Protection'].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-6 bg-[#080808] border border-white/5 rounded-2xl group hover:border-cyan-500/30 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">{item}</span>
                        <ShieldCheck className="w-4 h-4 text-zinc-800 group-hover:text-cyan-500 transition-colors" />
                     </div>
                   ))}
                </div>
              </section>

              {/* FOOTER INFO */}
              <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em] mb-3">Direct Inquiries:</p>
                  <a href={`mailto:${EMAIL}`} className="text-cyan-500 font-black tracking-[0.2em] text-sm uppercase hover:text-white transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {EMAIL}
                  </a>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em]">
                    © {new Date().getFullYear()} ZENTRIX CORE INFRASTRUCTURE.<br />
                    SECURED IN RAIPUR, INDIA.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
