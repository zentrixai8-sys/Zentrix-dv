
import React, { useState, useEffect } from 'react';
import { ArrowRight, Terminal, Zap, Activity, Cpu, ShieldCheck } from 'lucide-react';
import { PHONE_NUMBER } from '../constants';

const Hero: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [dataLogs, setDataLogs] = useState<string[]>([]);
  const [load, setLoad] = useState(64);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

    // Generate simulated hex logs for the scanning effect
    const logTimer = setInterval(() => {
      const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
      const process = ['SYNC', 'PACKET', 'ENCRYPT', 'DEVOPS', 'NODE'][Math.floor(Math.random() * 5)];
      const newLog = `> ${process}_${hex}: OK`;
      setDataLogs(prev => [newLog, ...prev].slice(0, 6));
      setLoad(prev => Math.min(98, Math.max(40, prev + (Math.random() * 10 - 5))));
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
    };
  }, []);

  return (
    <div className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden bg-[#020202]">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }}>
        </div>
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-10 reveal reveal-left">
              <div className="flex items-center gap-2 px-3 py-1 rounded-sm border border-blue-500/30 bg-blue-500/5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="mono text-[8px] text-blue-500 font-black uppercase tracking-[0.4em]">
                  ZENTRIX: AUTOMATION OS
                </span>
              </div>
              <div className="h-[1px] w-12 bg-zinc-800"></div>
              <div className="mono text-[8px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                {currentTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter italic uppercase reveal reveal-left stagger-1">
              Grow Your <span className="text-blue-500">Business</span> <br />
              <span className="text-zinc-600 opacity-80">With Smart Automation.</span>
            </h1>

            <div className="mb-12 border-l-2 border-blue-500/30 pl-8 reveal reveal-left stagger-2">
              <p className="text-zinc-300 text-sm font-bold uppercase tracking-widest mb-4">
                Websites • CRM • Billing • WhatsApp Automation • AI Agents
              </p>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl">
                Helping Raipur Businesses Save Time, Increase Sales & Automate Operations.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 items-center reveal reveal-up stagger-3">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-10 py-5 bg-white text-black rounded-sm font-black text-[9px] tracking-[0.4em] uppercase transition-all hover:bg-blue-600 hover:text-white flex items-center gap-4 shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10">Get Free Demo</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => window.open(`https://wa.me/91${PHONE_NUMBER}`, '_blank')}
                className="px-10 py-5 border border-zinc-800 rounded-sm font-black text-[9px] tracking-[0.4em] uppercase text-zinc-500 hover:text-white hover:border-green-500/50 transition-all flex items-center gap-3 bg-white/[0.02] backdrop-blur-md"
              >
                <Terminal className="w-3.5 h-3.5 text-green-500" /> WhatsApp Now
              </button>
            </div>
          </div>

          {/* NEURAL DATA SCAN CARD */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end reveal reveal-right stagger-1">
            <div className="relative group w-full">
              {/* Visual Glow Layer */}
              <div className="absolute -inset-1.5 bg-cyan-500/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-80 transition duration-1000"></div>

              <div className="relative p-10 bg-[#060606] border border-white/10 rounded-[3rem] shadow-3xl flex flex-col overflow-hidden">

                {/* DYNAMIC VIDEO/ANIMATION BACKGROUND LAYER */}
                <div className="absolute inset-0 z-0">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-40 mix-blend-screen"
                  >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-hightech-circuit-board-digital-grid-loop-31413-large.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#060606] via-transparent to-[#060606]"></div>
                </div>

                {/* SCANNING BEAM */}
                <div className="absolute inset-0 pointer-events-none z-30">
                  <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4] animate-scan-line opacity-80"></div>
                  {/* Scanline pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-40 bg-[length:100%_4px,3px_100%]"></div>
                </div>

                {/* TOP HUD INFO */}
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="mono text-[7px] text-zinc-500 font-black tracking-widest uppercase">System_Identifier</span>
                    <span className="mono text-[10px] text-white font-black tracking-tighter italic">XN-2092 / ALPHA</span>
                  </div>
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Cpu className="w-5 h-5 text-cyan-500 animate-pulse-soft" />
                  </div>
                </div>

                {/* LIVE DATA STREAM */}
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-10 relative overflow-hidden group/stream z-10">
                  <div className="absolute top-2 right-4 flex gap-1">
                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-data-flicker"></div>
                    <div className="w-1 h-1 bg-white/10 rounded-full animate-data-flicker [animation-delay:0.05s]"></div>
                  </div>

                  <div className="mono text-[8px] space-y-2.5 min-h-[140px]">
                    {dataLogs.map((log, i) => (
                      <div key={i} className={`flex justify-between transition-all duration-300 ${i === 0 ? 'text-cyan-400 opacity-100 translate-x-1' : 'text-zinc-400 opacity-60'}`}>
                        <span className="drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">{log}</span>
                        <span className="text-[6px] tracking-widest opacity-40">{Math.floor(Math.random() * 100)}ms</span>
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none"></div>
                </div>

                {/* METRICS HUD */}
                <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                    <p className="text-[7px] mono text-zinc-500 uppercase tracking-widest mb-1">Latency_MS</p>
                    <div className="flex items-end gap-2">
                      <span className="text-lg font-black text-white italic tracking-tighter">0.02</span>
                      <Activity className="w-3 h-3 text-cyan-500 mb-1" />
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                    <p className="text-[7px] mono text-zinc-500 uppercase tracking-widest mb-1">Neural_Load</p>
                    <div className="flex items-end gap-2">
                      <span className="text-lg font-black text-white italic tracking-tighter">{load.toFixed(0)}%</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mb-1.5 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    </div>
                  </div>
                </div>

                {/* SECURITY PROTOCOL FOOTER */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-[7px] mono text-zinc-500 uppercase font-black tracking-[0.3em]">Protocol_Encrypted</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1 h-3 bg-zinc-800 group-hover:bg-cyan-500 transition-colors duration-300"></div>
                    <div className="w-1 h-3 bg-zinc-800 group-hover:bg-cyan-500 transition-colors duration-500"></div>
                    <div className="w-1 h-3 bg-zinc-800 group-hover:bg-cyan-500 transition-colors duration-700"></div>
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

export default Hero;
