
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
          
          {/* CONTENT BLOCK */}
          <div className="lg:col-span-7 flex flex-col items-start reveal reveal-left active">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 px-3 py-1 rounded-sm border border-cyan-500/30 bg-cyan-500/5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                <span className="mono text-[8px] text-cyan-500 font-black uppercase tracking-[0.4em]">
                  OS_CORE: OPERATIONAL
                </span>
              </div>
              <div className="h-[1px] w-12 bg-zinc-800"></div>
              <div className="mono text-[8px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                {currentTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter uppercase italic">
              Enterprise <br />
              <span className="text-cyan-500">Data</span> <span className="text-zinc-600 opacity-80">Orchestration.</span>
            </h1>

            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl mb-12 border-l-2 border-cyan-500/30 pl-8">
              ZENTRIX engineers high-performance <span className="text-zinc-300">data nodes</span> designed to automate complex logic. 
              Deploying military-grade infrastructure for real-time business intelligence and workflow scaling.
            </p>

            <div className="flex flex-wrap gap-5 items-center">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-10 py-5 bg-white text-black rounded-sm font-black text-[9px] tracking-[0.4em] uppercase transition-all hover:bg-cyan-500 hover:text-white flex items-center gap-4 shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10">Initialize Sync</span> 
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => window.open(`tel:${PHONE_NUMBER}`)}
                className="px-10 py-5 border border-zinc-800 rounded-sm font-black text-[9px] tracking-[0.4em] uppercase text-zinc-500 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-3 bg-white/[0.02] backdrop-blur-md"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-500" /> System Audit
              </button>
            </div>
          </div>

          {/* NEURAL DATA SCAN CARD */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end reveal reveal-right active stagger-1">
             <div className="relative group max-w-sm w-full">
                {/* Visual Glow Layer */}
                <div className="absolute -inset-1.5 bg-cyan-500/10 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                
                <div className="relative p-10 bg-[#060606] border border-white/5 rounded-[3rem] shadow-3xl flex flex-col overflow-hidden">
                   
                   {/* SCANNING BEAM */}
                   <div className="absolute inset-0 pointer-events-none z-30">
                      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-[0_0_15px_#06b6d4] animate-scan-line"></div>
                   </div>

                   {/* TOP HUD INFO */}
                   <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="flex flex-col gap-1">
                        <span className="mono text-[7px] text-zinc-600 font-black tracking-widest uppercase">System_Identifier</span>
                        <span className="mono text-[10px] text-white font-black tracking-tighter italic">XN-2092 / ALPHA</span>
                      </div>
                      <div className="w-10 h-10 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-cyan-500 animate-pulse-soft" />
                      </div>
                   </div>

                   {/* LIVE DATA STREAM (The motion part) */}
                   <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.03] mb-10 relative overflow-hidden group/stream">
                      <div className="absolute top-2 right-4 flex gap-1">
                        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-data-flicker"></div>
                        <div className="w-1 h-1 bg-white/10 rounded-full animate-data-flicker [animation-delay:0.05s]"></div>
                      </div>
                      
                      <div className="mono text-[8px] space-y-2.5 min-h-[140px]">
                        {dataLogs.map((log, i) => (
                          <div key={i} className={`flex justify-between transition-all duration-300 ${i === 0 ? 'text-cyan-400 opacity-100 translate-x-1' : 'text-zinc-600 opacity-40'}`}>
                            <span>{log}</span>
                            <span className="text-[6px] tracking-widest">{Math.floor(Math.random()*100)}ms</span>
                          </div>
                        ))}
                      </div>

                      {/* Moving Matrix Overlay Effect */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none"></div>
                   </div>

                   {/* METRICS HUD */}
                   <div className="grid grid-cols-2 gap-4 mb-10">
                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                        <p className="text-[7px] mono text-zinc-500 uppercase tracking-widest mb-1">Latency_MS</p>
                        <div className="flex items-end gap-2">
                           <span className="text-lg font-black text-white italic tracking-tighter">0.02</span>
                           <Activity className="w-3 h-3 text-cyan-500 mb-1" />
                        </div>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                        <p className="text-[7px] mono text-zinc-500 uppercase tracking-widest mb-1">Neural_Load</p>
                        <div className="flex items-end gap-2">
                           <span className="text-lg font-black text-white italic tracking-tighter">{load.toFixed(0)}%</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 mb-1.5 animate-pulse"></div>
                        </div>
                      </div>
                   </div>

                   {/* SECURITY PROTOCOL FOOTER */}
                   <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-zinc-700 group-hover:text-cyan-500 transition-colors" />
                        <span className="text-[7px] mono text-zinc-600 uppercase font-black tracking-[0.3em]">Protocol_Encrypted</span>
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
