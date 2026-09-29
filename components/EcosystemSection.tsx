import React, { useState } from 'react';
import { Layers, Database, Ticket, Shield, Rocket, Cpu } from 'lucide-react';

interface EcosystemFeature {
  icon: React.ElementType;
  title: string;
  status: string;
  text: string;
  category: string;
}

const FEATURES: EcosystemFeature[] = [
  { icon: Layers, title: 'Easy Management', status: 'Simple', text: 'Manage your entire business workflow from one synchronized dashboard.', category: 'Benefits' },
  { icon: Database, title: 'Safe Data', status: 'Secure', text: 'Your customer data is encrypted, compliant, and backed up automatically.', category: 'How It Works' },
  { icon: Ticket, title: 'Smart Support', status: '24/7', text: 'Autonomous AI agents answer customer questions instantly, day or night.', category: 'AI Voice & Chat' },
  { icon: Shield, title: 'Full Security', status: 'Protected', text: 'Enterprise-grade privacy to keep your business records and leads isolated.', category: 'Benefits' },
  { icon: Rocket, title: 'Fast Setup', status: 'Ready', text: 'Deploy functional AI agents and automations in days, not months.', category: 'How It Works' },
  { icon: Cpu, title: 'Live Tracking', status: 'Real-time', text: 'Watch pipelines, sales metrics, and conversation funnels update live.', category: 'Ecosystem Tools' },
];

const PILL_CATEGORIES = ['All Features', 'Benefits', 'How It Works', 'AI Voice & Chat', 'Ecosystem Tools'];

export const EcosystemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Features');

  const filteredFeatures = activeTab === 'All Features' 
    ? FEATURES 
    : FEATURES.filter(f => f.category === activeTab);

  return (
    <section id="ecosystem" className="relative bg-[#000000] border-y border-white/[0.06] overflow-hidden">
      {/* Background Video - 100% Opacity with Cinematic Gradient Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
            type="video/mp4"
          />
        </video>
        {/* Scrim Layers for Contrast & Polish */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#000000]/60 to-[#000000]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.2),rgba(0,0,0,0.85))]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
        {/* Top Header & Intro */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          {/* Badge: Operational AI Infrastructure with Sparkle SVG */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[5px] bg-gradient-to-r from-[#7d7d7d] via-[#2a2a2a] to-[#0a0a0a] text-[#f2f2f2] text-[12.5px] font-normal tracking-[-0.01em] shadow-lg mb-8 border-0">
            <svg
              className="w-[18px] h-[20px] text-white shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.45))' }}
              aria-hidden="true"
            >
              <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
            </svg>
            <span>Operational AI Infrastructure</span>
          </div>

          {/* Main H2 with Instrument Serif Italic Accent */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-medium tracking-[-0.045em] leading-[1.12] text-white mb-6">
            Everything Your Business Needs <br className="hidden sm:inline" />
            <em className="font-instrument italic font-normal text-[#9a9a9a] not-italic-fallback">To Grow.</em>
          </h2>

          {/* Lede Text */}
          <p className="text-[#9a9a9a] text-[15.5px] md:text-lg leading-[1.55] max-w-[520px] font-normal tracking-[-0.015em] mb-10">
            Deploy adaptive AI agents that learn, execute, and scale operational tasks across your business in minutes.
          </p>

          {/* Liquid-Metal Pills Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {PILL_CATEGORIES.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`group relative h-[40px] px-5 rounded-[7px] text-[14px] font-normal tracking-[-0.01em] transition-all duration-300 overflow-hidden cursor-pointer ${
                    isActive
                      ? 'border border-[rgba(235,235,235,0.9)] bg-gradient-to-r from-[#111111] via-[#3a3a3a] to-[#6a6a6a] text-white shadow-[0_0_18px_rgba(200,210,230,0.22)]'
                      : 'border border-[rgba(198,198,198,0.55)] bg-gradient-to-r from-[#050505] via-[#2a2a2a] to-[#4a4a4a] text-[#f3f3f3] hover:border-[rgba(235,235,235,0.8)] hover:shadow-[0_0_15px_rgba(200,210,230,0.15)]'
                  }`}
                >
                  {/* Liquid Metal Shine sweep on hover */}
                  <span className="absolute inset-0 -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Liquid-Glass Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-16">
            {/* Solid Liquid-Glass CTA */}
            <a
              href="/contact"
              className="group relative isolate overflow-hidden inline-flex items-center justify-center h-[42px] px-6 rounded-[6px] text-[13.5px] font-medium tracking-[-0.02em] cursor-pointer transition-all duration-300 border border-[#ffffff] text-[#111111] bg-gradient-to-b from-[#ffffff] via-[#e7e7e7] to-[#cfcfcf] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-gradient-to-b hover:from-[#ffffff] hover:via-[#f3f6ff] hover:to-[#d5def2] hover:border-[#f2f6ff] hover:shadow-[inset_0_1px_0_#fff,0_0_26px_rgba(186,208,255,0.4),0_8px_18px_rgba(255,255,255,0.14)]"
            >
              <span className="absolute inset-0 -translate-x-[130%] group-hover:translate-x-[130%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
              <span className="relative z-10 font-semibold">Start for Free</span>
            </a>

            {/* Frost Ghost Hero CTA */}
            <a
              href="#services"
              className="group relative isolate overflow-hidden inline-flex items-center justify-center h-[42px] px-6 rounded-[6px] text-[13.5px] font-medium tracking-[-0.02em] cursor-pointer transition-all duration-300 border border-[rgba(198,198,198,0.55)] text-white bg-gradient-to-br from-white/[0.12] via-black/50 to-[rgba(150,170,200,0.1)] backdrop-blur-[16px] hover:border-[rgba(220,230,255,0.8)] hover:shadow-[0_0_24px_rgba(170,200,255,0.28)]"
            >
              <span className="absolute inset-0 -translate-x-[130%] group-hover:translate-x-[130%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <span className="relative z-10 font-normal">See it in action</span>
            </a>
          </div>
        </div>

        {/* Feature Cards Grid (Liquid Glass Tiles) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {filteredFeatures.map((feature, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.12)] bg-gradient-to-b from-[#080808]/90 via-[#040404]/80 to-[#000000]/95 backdrop-blur-xl p-8 hover:border-[rgba(198,198,198,0.5)] transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.12)]"
            >
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.06] to-transparent pointer-events-none" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-zinc-300 border border-white/10 bg-gradient-to-b from-[#1c1c1c] to-[#0c0c0c] shadow-lg group-hover:border-white/30 group-hover:text-white transition-all">
                  <feature.icon className="w-5 h-5 text-zinc-200 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-0.5">Status</span>
                  <span className="text-[12px] font-medium tracking-tight text-zinc-300 group-hover:text-white transition-colors">{feature.status}</span>
                </div>
              </div>

              <h3 className="text-xl font-medium tracking-tight text-white mb-2 relative z-10">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-normal relative z-10">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Stats Footer (Exact 3 Stats from Vesper.ai specification) */}
        <div className="pt-10 border-t border-[rgba(255,255,255,0.12)] flex flex-col md:flex-row items-center justify-between gap-8 text-[#d8d8d8]">
          {/* Stat 1: Dual-pill / workflow icon */}
          <div className="inline-flex items-center gap-3.5 text-[13.5px] tracking-[-0.015em] font-normal">
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="pillGrad1" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="38%" stopColor="#ffffff" />
                  <stop offset="62%" stopColor="#3a3a3a" />
                </linearGradient>
                <linearGradient id="pillGrad2" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="38%" stopColor="#3a3a3a" />
                  <stop offset="62%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#pillGrad1)" />
              <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#pillGrad2)" />
              <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
            </svg>
            <span>4.2M+ workflows automated</span>
          </div>

          {/* Stat 2: Download tile icon */}
          <div className="inline-flex items-center gap-3.5 text-[13.5px] tracking-[-0.015em] font-normal">
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
              <path
                d="M12 7.1v7.4M8.15 12.35L12 16.2l3.85-3.85"
                stroke="#111111"
                strokeWidth="1.85"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>92% reduction in manual operations</span>
          </div>

          {/* Stat 3: Three avatars icon */}
          <div className="inline-flex items-center gap-3.5 text-[13.5px] tracking-[-0.015em] font-normal">
            <svg
              className="w-[38px] h-[21px] shrink-0"
              viewBox="0 0 40 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Dark avatar */}
              <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
              <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
              <path d="M6.6 5.8 L8.4 8.2 L6.2 9.2 Z" fill="#2b2b2b" />
              <path d="M13.8 5.8 L12.0 8.2 L14.2 9.2 Z" fill="#2b2b2b" />
              <circle cx="9.1" cy="11.4" r="0.7" fill="#1a1a1a" />
              <circle cx="11.3" cy="11.4" r="0.7" fill="#1a1a1a" />

              {/* White avatar */}
              <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
              <circle cx="18.2" cy="9.8" r="1.7" fill="#111111" />
              <circle cx="22.2" cy="9.8" r="1.7" fill="#111111" />
              <ellipse cx="20.2" cy="12.4" rx="1.2" ry="0.9" fill="#111111" />
              <path d="M18.2 13.8 Q20.2 16.2 22.2 13.8" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" />

              {/* Orange avatar with Inter 'e' */}
              <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
              <text
                x="30.2"
                y="15.1"
                fontSize="12.5"
                fontFamily="'Inter', -apple-system, sans-serif"
                fontWeight="700"
                fill="#ffffff"
                textAnchor="middle"
              >
                e
              </text>
            </svg>
            <span>180+ operational teams onboarded</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
