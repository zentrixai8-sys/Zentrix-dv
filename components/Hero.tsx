
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Terminal, Zap, Activity, Cpu, ShieldCheck } from 'lucide-react';
import { PHONE_NUMBER } from '../constants';

const Hero: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [dataLogs, setDataLogs] = useState<{ cmd: string, status: string, time: string }[]>([]);
  const [load, setLoad] = useState(64);
  const [latency, setLatency] = useState(0.02);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    
    // System log generation for "Live Coding" effect
    const logTimer = setInterval(() => {
      const processes = ['DEVOPS', 'ENCRYPT', 'PACKET', 'SYNC', 'NODE_AUTH', 'CORE_SYS', 'DB_FETCH'];
      const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
      const process = processes[Math.floor(Math.random() * processes.length)];
      const ms = Math.floor(Math.random() * 100) + 1;
      
      const newEntry = {
        cmd: `${process}_${hex}`,
        status: 'OK',
        time: `${ms}ms`
      };

      setDataLogs(prev => [newEntry, ...prev].slice(0, 7));
      
      // Dynamic metric fluctuations
      setLoad(prev => {
        const delta = (Math.random() * 4 - 2);
        return Math.min(99, Math.max(30, prev + delta));
      });
      setLatency(prev => {
        const delta = (Math.random() * 0.02 - 0.01);
        return Math.max(0.01, parseFloat((prev + delta).toFixed(3)));
      });
    }, 400); // Faster updates for "running" feel

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30; 
      const y = (clientY / innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden bg-[#020202] perspective-[1000px]"
    >
      {/* Dynamic 3D Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated perspective grid */}
        <div 
          className="absolute inset-0 opacity-[0.05] transition-transform duration-700 ease-out" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
            backgroundSize: '80px 80px',
            transform: `translateZ(-50px) rotateX(20deg) translateY(${mousePos.y * 0.15}px) translateX(${mousePos.x * 0.15}px)`,
          }}
        ></div>
        
        {/* Moving Glow Blobs */}
        <div 
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px] animate-pulse-soft"
          style={{ transform: `translate3d(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px, 0)` }}
        ></div>
        
        <div 
          className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"
          style={{ transform: `translate3d(${-mousePos.x * 1}px, ${-mousePos.y * 1}px, 0)` }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 flex flex-col items-start reveal reveal-left active">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 px-3 py-1 rounded-sm border border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                <span className="mono text-[8px] text-cyan-500 font-black uppercase tracking-[0.4em]">
                  NODE_STABLE: 2.5.0
                </span>
              </div>
              <div className="h-[1px] w-12 bg-zinc-800"></div>
              <div className="mono text-[8px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                {currentTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1] mb-10 tracking-tighter uppercase italic">
              Digital <br />
              <span className="text-cyan-500">Infrastructure</span> <br />
              <span className="text-zinc-800">Orchestra.</span>
            </h1>

            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl mb-12 border-l-2 border-cyan-500/30 pl-8">
              ZENTRIX engineers high-performance <span className="text-zinc-300">automation nodes</span> designed for enterprise logic. 
              Deploying military-grade software for real-time intelligence and seamless business scaling.
            </p>

            <div className="flex flex-wrap gap-5 items-center">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-10 py-5 bg-white text-black rounded-sm font-black text-[10px] tracking-[0.4em] uppercase transition-all hover:bg-cyan-500 hover:text-white flex items-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10">Initialize Sync</span> 
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => window.open(`tel:${PHONE_NUMBER}`)}
                className="px-10 py-5 border border-zinc-800 rounded-sm font-black text-[10px] tracking-[0.4em] uppercase text-zinc-500 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-3 bg-transparent backdrop-blur-md"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-500" /> Remote Access
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: NEURAL DATA SCAN CARD (The "Coding" Motion Section) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end reveal reveal-right active stagger-1">
             <div 
                className="relative group max-w-sm w-full transition-transform duration-500 ease-out"
                style={{ 
                  transform: `rotateY(${mousePos.x * 0.15}deg) rotateX(${-mousePos.y * 0.15}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Visual Ambient Glow */}
                <div className="absolute -inset-4 bg-cyan-500/10 rounded-[4rem] blur-3xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                
                <div className="relative p-12 bg-[#060606]/95 border border-white/5 rounded-[4rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden backdrop-blur-xl">
                   
                   {/* DYNAMIC SCANNING BEAM */}
                   <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-[4rem]">
                      <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent shadow-[0_0_20px_#06b6d4] animate-scan-line"></div>
                   </div>

                   {/* HUD HEADER */}
                   <div className="flex justify-between items-start mb-12 relative z-10">
                      <div className="flex flex-col gap-1.5">
                        <span className="mono text-[8px] text-zinc-600 font-black tracking-widest uppercase opacity-70">System_Identifier</span>
                        <span className="mono text-[12px] text-white font-black tracking-tighter italic uppercase">XN-2092 / ALPHA</span>
                      </div>
                      <div className="w-12 h-12 bg-[#0A0A0A] border border-white/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:border-cyan-500/40 transition-colors duration-500">
                        <Cpu className="w-6 h-6 text-cyan-500 animate-pulse-soft" />
                      </div>
                   </div>

                   {/* LIVE RUNNING DATA STREAM (TERMINAL) */}
                   <div className="bg-[#020202] rounded-3xl p-8 border border-white/[0.05] mb-12 relative overflow-hidden shadow-inner group/stream min-h-[180px]">
                      {/* Terminal Accents */}
                      <div className="absolute top-4 right-6 flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-data-flicker"></div>
                        <div className="w-1.5 h-1.5 bg-white/5 rounded-full"></div>
                      </div>
                      
                      <div className="mono text-[9px] space-y-3.5">
                        {dataLogs.map((log, i) => (
                          <div 
                            key={i} 
                            className={`flex justify-between items-center transition-all duration-300 ${i === 0 ? 'text-white opacity-100 translate-x-1' : 'text-zinc-600 opacity-30'}`}
                          >
                            <div className="flex gap-4">
                              <span className={`${i === 0 ? 'text-cyan-400' : 'text-zinc-700'}`}>&gt;</span>
                              <span className={`font-bold ${i === 0 ? 'text-cyan-400' : ''}`}>{log.cmd}:</span>
                              <span className="tracking-widest">{log.status}</span>
                            </div>
                            <span className="text-[7px] text-cyan-500/60 font-black tracking-widest">{log.time}</span>
                          </div>
                        ))}
                      </div>

                      {/* Moving Matrix Overlay Effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-500/[0.02] pointer-events-none"></div>
                   </div>

                   {/* DYNAMIC METRICS */}
                   <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
                      <div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl group-hover:bg-white/[0.04] transition-colors">
                        <p className="text-[8px] mono text-zinc-600 uppercase tracking-[0.2em] mb-3 font-bold">Latency_MS</p>
                        <div className="flex items-end gap-3">
                           <span className="text-xl font-black text-white italic tracking-tighter transition-all tabular-nums">
                            {latency.toFixed(3)}
                           </span>
                           <Activity className="w-4 h-4 text-cyan-500 mb-1.5 animate-pulse" />
                        </div>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl group-hover:bg-white/[0.04] transition-colors">
                        <p className="text-[8px] mono text-zinc-600 uppercase tracking-[0.2em] mb-3 font-bold">Neural_Load</p>
                        <div className="flex items-end gap-3">
                           <span className="text-xl font-black text-white italic tracking-tighter tabular-nums">{load.toFixed(0)}%</span>
                           <div className="w-2 h-2 rounded-full bg-green-500 mb-2 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        </div>
                      </div>
                   </div>

                   {/* STATUS FOOTER */}
                   <div className="pt-8 border-t border-white/5 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-zinc-700 group-hover:text-cyan-500 transition-colors" />
                        <span className="text-[8px] mono text-zinc-500 uppercase font-black tracking-[0.3em]">Protocol_Encrypted</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1.5 h-3 bg-zinc-900 group-hover:bg-cyan-600/40 transition-all duration-300"></div>
                        <div className="w-1.5 h-3 bg-zinc-900 group-hover:bg-cyan-500/60 transition-all duration-500"></div>
                        <div className="w-1.5 h-3 bg-zinc-900 group-hover:bg-cyan-400 transition-all duration-700"></div>
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
