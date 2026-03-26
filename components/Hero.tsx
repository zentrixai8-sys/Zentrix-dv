import React from 'react';
import { ArrowRight, PlayCircle, Zap, ShieldCheck, Activity, Users, Clock, ArrowDownToLine, Box } from 'lucide-react';
import { PHONE_NUMBER } from '../constants';
import AutoImageSequence from './AutoImageSequence';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[#020202]">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Auto-Playing Robot Video */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl reveal reveal-right">
            {/* Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10"></div>
            
            <AutoImageSequence
              src="/video-frames/"
              frameCount={192}
              fps={30}
              className="w-full h-full scale-[1.05]" /* scale slightly to hide edges if needed */
            />

            {/* Cyan glowing overlay around borders */}
            <div className="absolute inset-0 border border-cyan-500/20 rounded-3xl pointer-events-none z-20 shadow-[inset_0_0_50px_rgba(6,182,212,0.1)]"></div>
          </div>

          {/* Right Side: Hero Content */}
          <div className="flex flex-col items-start reveal reveal-left">
            {/* Top Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-8">
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-zinc-300 font-medium">AI-Powered Automation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold text-white leading-[1.1] mb-6 tracking-tight">
              ZENTRIXS <br />
              <span className="text-blue-500">Automation OS</span>
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-400 text-lg md:text-xl font-normal leading-relaxed max-w-xl mb-10">
              Streamline operations, reduce costs, and scale intelligently with ZENTRIXS.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-wrap gap-4 items-center mb-16">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm tracking-wide transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                BOOK A DEMO <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => window.open(`https://wa.me/91${PHONE_NUMBER}`, '_blank')}
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl font-bold text-sm tracking-wide text-zinc-300 transition-all flex items-center gap-3 bg-white/[0.02]"
              >
                <PlayCircle className="w-4 h-4 text-zinc-400" /> WATCH VIDEO
              </button>
            </div>

            {/* 3 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {/* Card 1 */}
              <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">Intelligent<br/>Automation</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">AI agents that<br/>learn & optimize.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">Secure &<br/>Reliable</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">Enterprise-grade<br/>security.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">Scalable<br/>& Flexible</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">Built to grow<br/>with your business.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Stats Strip */}
        <div className="mt-12 w-full lg:w-4/5 mx-auto bg-black border border-white/5 rounded-3xl p-6 md:p-8 flex flex-wrap justify-between items-center gap-6 reveal reveal-up shadow-2xl relative z-20">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <Box className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">500+</p>
              <p className="text-zinc-500 text-xs">Automations Delivered</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/5"></div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">98%</p>
              <p className="text-zinc-500 text-xs">Accuracy & Uptime</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/5"></div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <ArrowDownToLine className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">40%</p>
              <p className="text-zinc-500 text-xs">Avg. Cost Reduction</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/5"></div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">24/7</p>
              <p className="text-zinc-500 text-xs">AI Monitoring</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
