
import React from 'react';
import { Target, Eye, Globe, Zap, Shield, Cpu } from 'lucide-react';
import { COMPANY_NAME } from '../constants';

const MissionVision: React.FC = () => {
  return (
    <section id="directives" className="py-32 bg-[#020202] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-24 reveal reveal-up">
          <div className="flex items-center gap-3 px-4 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
            <Cpu className="w-3 h-3 text-blue-500" />
            <span className="mono text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Core Directives</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic text-center">
            Mission <span className="text-zinc-800">&</span> Vision.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission Node: Slide from Left */}
          <div className="reveal reveal-left group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur transition-opacity"></div>
            <div className="relative h-full bg-[#080808] border border-white/10 rounded-[2.5rem] p-12 overflow-hidden">
              <div className="absolute top-8 right-8 mono text-[8px] text-zinc-600 font-black tracking-widest uppercase">
                NODE_TYPE: TACTICAL_EXECUTION
              </div>
              
              <div className="bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border border-blue-500/20 shadow-xl shadow-blue-500/5">
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              
              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight italic">Our Mission</h3>
              <p className="text-zinc-500 text-lg leading-relaxed font-medium uppercase tracking-tight mb-8">
                To <span className="text-white">engineer autonomous ecosystems</span> that empower Raipur's business landscape, eliminating manual friction through high-precision AI integration and world-class digital infrastructure.
              </p>
            </div>
          </div>

          {/* Vision Node: Slide from Right */}
          <div className="reveal reveal-right stagger-1 group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur transition-opacity"></div>
            <div className="relative h-full bg-[#080808] border border-white/10 rounded-[2.5rem] p-12 overflow-hidden">
               <div className="absolute top-8 right-8 mono text-[8px] text-zinc-600 font-black tracking-widest uppercase">
                NODE_TYPE: GLOBAL_STRATEGY
              </div>

              <div className="bg-purple-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border border-purple-500/20 shadow-xl shadow-purple-500/5">
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
              
              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight italic">Our Vision</h3>
              <p className="text-zinc-500 text-lg leading-relaxed font-medium uppercase tracking-tight mb-8">
                To define the <span className="text-white">global standard</span> for enterprise intelligence, where {COMPANY_NAME} acts as the central digital core for businesses aiming to operate at quantum-level efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
