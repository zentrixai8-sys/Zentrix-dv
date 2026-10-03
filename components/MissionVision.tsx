import React, { useState, useEffect, useRef } from 'react';
import { Target, Eye, Sparkles, Zap, Shield, ArrowRight, TrendingUp, CheckCircle2, Bot, Layers, Compass } from 'lucide-react';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4';
const POSTER_SRC = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp';

const PILLARS_DATA = [
  {
    id: 'mission',
    title: 'Our Mission',
    tagline: 'OPERATIONAL EXCELLENCE',
    badge: 'Core Purpose & Execution',
    icon: Target,
    accent: 'cyan',
    gradient: 'from-blue-500 via-cyan-400 to-teal-400',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    statement: 'To engineer intelligent AI agents, custom software architectures, and automated CRM pipelines that eliminate manual bottlenecks — empowering businesses in Raipur and across India to save 100+ hours every month and scale profitably.',
    metrics: [
      { label: 'Time Saved', val: '100+ Hrs/Mo', desc: 'Eliminating repetitive manual follow-ups' },
      { label: 'Conversion Lift', val: '3.8x Speed', desc: 'Sub-second AI lead qualification' },
      { label: 'Data Accuracy', val: '99.9%', desc: 'Synchronized direct sheet & CRM sync' }
    ],
    highlights: [
      'Replace chaotic manual spreadsheets with synchronized cloud software',
      'Deploy 24/7 bilingual AI business agents in pure Hindi & English',
      'Instant automated WhatsApp invoicing and real-time payment reconciliation'
    ]
  },
  {
    id: 'vision',
    title: 'Our Vision',
    tagline: 'NEXT-GEN HORIZON',
    badge: 'Futuristic Innovation',
    icon: Eye,
    accent: 'purple',
    gradient: 'from-purple-500 via-indigo-400 to-cyan-400',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    statement: 'To become India\'s most trusted business automation & AI powerhouse — establishing a standard where any growing enterprise can effortlessly upgrade its legacy operations and achieve 10x execution speed with zero technical barrier.',
    metrics: [
      { label: 'System Uptime', val: '99.99%', desc: 'Cloudflare & AWS edge infrastructure' },
      { label: 'Operational Speed', val: '10x Faster', desc: 'Autonomous event-driven workflows' },
      { label: 'Security Standard', val: 'AES-256', desc: 'Bank-grade client record isolation' }
    ],
    highlights: [
      'Democratize custom enterprise AI solutions for mid-market businesses',
      'Create self-driving sales, inventory, and support ecosystems',
      'Build long-term technology partnerships with zero vendor lock-in'
    ]
  }
];

const MissionVision: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);

  // Auto-switch slide preview every 7 seconds unless interacted
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev === 'mission' ? 'vision' : 'mission'));
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // Video looping background controller
  useEffect(() => {
    const vidA = videoRefA.current;
    const vidB = videoRefB.current;
    if (!vidA || !vidB) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      vidA.pause();
      vidB.pause();
      return;
    }

    const FADE = 0.9;
    let cur = vidA;
    let nxt = vidB;
    let swapping = false;

    const play = (v: HTMLVideoElement) => {
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    };

    play(vidA);

    const tick = () => {
      if (swapping || !cur.duration) return;
      if (cur.duration - cur.currentTime > FADE) return;

      swapping = true;
      const out = cur;
      nxt.currentTime = 0;
      play(nxt);
      nxt.classList.add('opacity-100');
      nxt.classList.remove('opacity-0');
      out.classList.remove('opacity-100');
      out.classList.add('opacity-0');

      const temp = cur;
      cur = nxt;
      nxt = temp;

      setTimeout(() => {
        out.pause();
        out.currentTime = 0;
        swapping = false;
      }, FADE * 1000 + 100);
    };

    vidA.addEventListener('timeupdate', tick);
    vidB.addEventListener('timeupdate', tick);

    return () => {
      vidA.removeEventListener('timeupdate', tick);
      vidB.removeEventListener('timeupdate', tick);
    };
  }, []);

  const currentPillar = PILLARS_DATA.find((p) => p.id === activeTab) || PILLARS_DATA[0];

  return (
    <section id="directives" className="py-28 md:py-36 bg-black relative overflow-hidden">
      {/* Seamless Dual-Video Looping Earth Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <video
          ref={videoRefA}
          className="absolute inset-0 w-full h-full object-cover object-[51%_8%] transition-opacity duration-1000 ease-linear opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          poster={POSTER_SRC}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        <video
          ref={videoRefB}
          className="absolute inset-0 w-full h-full object-cover object-[51%_8%] transition-opacity duration-1000 ease-linear opacity-0"
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          poster={POSTER_SRC}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.06),rgba(0,0,0,0.9))]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center reveal reveal-up active">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="text-[10px] font-black text-cyan-300 uppercase tracking-[0.35em]">Strategic Foundation</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase italic mb-6">
            Mission <span className="text-zinc-600">&amp;</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Vision.
            </span>
          </h2>

          <p className="text-zinc-400 text-sm md:text-base max-w-xl font-normal leading-relaxed">
            Discover the core driving philosophy and long-term commitment that powers every software engine we deploy.
          </p>

          {/* Interactive Slide Toggle Switcher */}
          <div className="flex items-center gap-3 p-1.5 mt-8 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <button
              onClick={() => {
                setActiveTab('mission');
                setIsAutoPlay(false);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'mission'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>01. Our Mission</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('vision');
                setIsAutoPlay(false);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'vision'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>02. Our Vision</span>
            </button>
          </div>
        </div>

        {/* Dynamic Holographic Interactive Showcase Card */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Glowing Backlight Effect */}
          <div
            className="absolute -inset-1 rounded-[3rem] blur-2xl opacity-30 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${currentPillar.glowColor}, transparent 70%)`
            }}
          />

          <div className="relative rounded-[2.5rem] bg-[#0c0f17]/90 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 md:p-14 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500">
            
            {/* Top Bar of Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border ${
                  activeTab === 'mission'
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                }`}>
                  <currentPillar.icon className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] block">
                    {currentPillar.tagline}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">
                    {currentPillar.title}
                  </h3>
                </div>
              </div>

              <span className={`self-start sm:self-auto px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                activeTab === 'mission'
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
              }`}>
                {currentPillar.badge}
              </span>
            </div>

            {/* Core Statement Body */}
            <div className="py-8">
              <p className="text-zinc-200 text-base sm:text-xl md:text-2xl leading-relaxed font-medium tracking-tight">
                "{currentPillar.statement}"
              </p>
            </div>

            {/* 3 Metric High-Velocity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
              {currentPillar.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300 group"
                >
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                    {m.label}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors font-mono">
                    {m.val}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Key Deliverables Checkpoints */}
            <div className="pt-6 border-t border-white/[0.08] space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 block mb-2">
                Core Execution Standards
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentPillar.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Slide Switch Progress Indicator */}
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            onClick={() => {
              setActiveTab('mission');
              setIsAutoPlay(false);
            }}
            aria-label="Mission Slide"
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              activeTab === 'mission' ? 'w-10 bg-cyan-400' : 'w-3 bg-zinc-800 hover:bg-zinc-700'
            }`}
          />
          <button
            onClick={() => {
              setActiveTab('vision');
              setIsAutoPlay(false);
            }}
            aria-label="Vision Slide"
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              activeTab === 'vision' ? 'w-10 bg-purple-400' : 'w-3 bg-zinc-800 hover:bg-zinc-700'
            }`}
          />
        </div>

      </div>
    </section>
  );
};

export default MissionVision;
