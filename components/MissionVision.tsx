
import React from 'react';
import { Target, Eye, Globe, Zap, Shield, Cpu } from 'lucide-react';
import { COMPANY_NAME } from '../constants';

const MissionVision: React.FC = () => {
  return (
    <section id="directives" className="py-32 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-24 reveal reveal-up">
          <div className="flex items-center gap-3 px-4 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
            <Cpu className="w-3 h-3 text-blue-500" />
            <span className="mono text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Our Goals</span>
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

              <div className="bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border border-blue-500/20 shadow-xl shadow-blue-500/5">
                <Target className="w-8 h-8 text-blue-500" />
              </div>

              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight italic">Our Mission</h3>
              <p className="text-zinc-500 text-lg leading-relaxed font-medium uppercase tracking-tight mb-8">
                To build <span className="text-white">smart systems</span> that help businesses in Raipur grow faster. We fix manual problems with smart software.
              </p>
            </div>
          </div>

          {/* Vision Node: Slide from Right */}
          <div className="reveal reveal-right stagger-1 group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur transition-opacity"></div>
            <div className="relative h-full bg-[#080808] border border-white/10 rounded-[2.5rem] p-12 overflow-hidden">

              <div className="bg-purple-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border border-purple-500/20 shadow-xl shadow-purple-500/5">
                <Eye className="w-8 h-8 text-purple-500" />
              </div>

              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight italic">Our Vision</h3>
              <p className="text-zinc-500 text-lg leading-relaxed font-medium uppercase tracking-tight mb-8">
                To become the <span className="text-white">simplest way</span> for any business to upgrade their technology and work 10x faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
