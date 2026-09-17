import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Cpu, Sparkles, Layers, CheckCircle2, Zap, Orbit, Grid, Play, Pause, ShieldCheck, Database, Server, Compass, Radio } from 'lucide-react';
import type { IconType } from 'react-icons';
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiPython, SiExpress, SiFastapi,
  SiMongodb, SiPostgresql, SiFirebase, SiSupabase,
  SiDocker, SiVercel, SiCloudflare,
  SiWhatsapp, SiRazorpay, SiStripe, SiGooglesheets,
  SiGooglegemini, SiLangchain, SiZapier,
} from 'react-icons/si';
import { TbBrandAws, TbBrandOpenai } from 'react-icons/tb';

interface TechItem {
  id: string;
  name: string;
  icon: IconType;
  color: string;
  category: string;
  role: string;
  highlight: string;
  speed: string;
  reliability: string;
}

const NEEDS_LIGHT_FILL = new Set(['Express', 'Next.js', 'Vercel', 'OpenAI', 'AWS']);

const TECH_CATEGORIES = [
  { id: 'all', name: 'All Ecosystem', color: '#06b6d4', icon: Orbit },
  { id: 'ai', name: 'AI & Automation', color: '#06b6d4', icon: Sparkles },
  { id: 'cloud', name: 'Cloud & DevOps', color: '#f97316', icon: Zap },
  { id: 'database', name: 'Database', color: '#f59e0b', icon: Layers },
  { id: 'backend', name: 'Backend', color: '#10b981', icon: Cpu },
  { id: 'frontend', name: 'Frontend', color: '#3b82f6', icon: Server },
  { id: 'integrations', name: 'Integrations', color: '#a855f7', icon: Database },
];

const TECH_TOOLS: TechItem[] = [
  // AI & Automation
  { id: 'openai', name: 'OpenAI', category: 'AI & Automation', icon: TbBrandOpenai, color: '#10a37f', role: 'Autonomous AI Agents & GPT-4o Multi-Agent Workflows', highlight: 'Enterprise AI Core', speed: '< 240ms', reliability: '99.95%' },
  { id: 'gemini', name: 'Google AI', category: 'AI & Automation', icon: SiGooglegemini, color: '#4285F4', role: 'Multimodal Vision, Realtime Audio & Fast Inference', highlight: 'Sub-second Latency', speed: '< 180ms', reliability: '99.99%' },
  { id: 'langchain', name: 'LangChain', category: 'AI & Automation', icon: SiLangchain, color: '#1C3C3C', role: 'RAG Knowledge Retrieval & Vector Memory Pipelines', highlight: 'Neural AI Memory', speed: '< 50ms', reliability: '99.9%' },
  { id: 'zapier', name: 'Zapier', category: 'AI & Automation', icon: SiZapier, color: '#FF4A00', role: 'Hyper-automated Trigger-Action Data Synchronization', highlight: '1000+ Connectors', speed: 'Realtime', reliability: '99.99%' },

  // Cloud & DevOps
  { id: 'aws', name: 'AWS', category: 'Cloud & DevOps', icon: TbBrandAws, color: '#FF9900', role: 'Elastic Serverless Architecture & Global Cloud Mesh', highlight: 'Infinite Scale', speed: '10ms Edge', reliability: '99.999%' },
  { id: 'docker', name: 'Docker', category: 'Cloud & DevOps', icon: SiDocker, color: '#2496ED', role: 'Containerized Microservices & Isolated Environments', highlight: 'Zero Downtime', speed: 'Instant Boot', reliability: '100%' },
  { id: 'vercel', name: 'Vercel', category: 'Cloud & DevOps', icon: SiVercel, color: '#ffffff', role: 'Edge Computing, Instant SSG & Global CDN Deployment', highlight: 'Global 10ms TTFB', speed: '12ms TTFB', reliability: '99.99%' },
  { id: 'cloudflare', name: 'Cloudflare', category: 'Cloud & DevOps', icon: SiCloudflare, color: '#F38020', role: 'DDoS Shielding, Web Application Firewall & SSL Routing', highlight: 'Military Grade Sec', speed: '< 5ms DNS', reliability: '100%' },

  // Database
  { id: 'mongodb', name: 'MongoDB', category: 'Database', icon: SiMongodb, color: '#47A248', role: 'High-Throughput NoSQL JSON Cluster Storage', highlight: 'Flexible Scale', speed: '< 2ms Query', reliability: '99.99%' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database', icon: SiPostgresql, color: '#4169E1', role: 'ACID-Compliant Relational Data Warehouse', highlight: 'High Concurrency', speed: '< 1ms Indexed', reliability: '99.999%' },
  { id: 'supabase', name: 'Supabase', category: 'Database', icon: SiSupabase, color: '#3ECF8E', role: 'Realtime PostgreSQL with Row Level Security & Auth', highlight: 'Live WebSockets', speed: '< 8ms Stream', reliability: '99.95%' },
  { id: 'firebase', name: 'Firebase', category: 'Database', icon: SiFirebase, color: '#FFCA28', role: 'Event-Driven Cloud Firestore & Push Notifications', highlight: 'Instant Cloud Sync', speed: '< 15ms PubSub', reliability: '99.95%' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'Backend', icon: SiNodedotjs, color: '#339933', role: 'High-Concurrency Non-Blocking Event-Driven Core', highlight: '100k+ Req/sec', speed: '0.8ms Loop', reliability: '99.99%' },
  { id: 'python', name: 'Python', category: 'Backend', icon: SiPython, color: '#3776AB', role: 'Deep Learning, Predictive Models & Data Engineering', highlight: 'AI Compute Engine', speed: 'Optimized C-Ext', reliability: '99.95%' },
  { id: 'fastapi', name: 'FastAPI', category: 'Backend', icon: SiFastapi, color: '#009688', role: 'Async Python Microservices with Automated OpenAPI', highlight: 'Starlette Powered', speed: '< 4ms Resp', reliability: '99.99%' },
  { id: 'express', name: 'Express', category: 'Backend', icon: SiExpress, color: '#ffffff', role: 'Minimalist High-Speed RESTful Routing Layer', highlight: 'Ultra Lightweight', speed: '< 1ms Overhead', reliability: '99.99%' },

  // Frontend
  { id: 'react', name: 'React', category: 'Frontend', icon: SiReact, color: '#61DAFB', role: 'Interactive Component State Architecture', highlight: 'Smooth 120 FPS', speed: 'Instant DOM', reliability: '100%' },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', icon: SiNextdotjs, color: '#ffffff', role: 'Hybrid SSR/SSG Enterprise Frontend Framework', highlight: 'A+ SEO Score', speed: '< 0.3s FCP', reliability: '99.99%' },
  { id: 'typescript', name: 'TypeScript', category: 'Frontend', icon: SiTypescript, color: '#3178C6', role: 'Strict Type-Safety & Compile-Time Bug Elimination', highlight: 'Zero Type Errors', speed: 'Optimized AST', reliability: '100%' },
  { id: 'tailwind', name: 'Tailwind', category: 'Frontend', icon: SiTailwindcss, color: '#06B6D4', role: 'Modern Responsive Design System & Hardware Acceleration', highlight: 'Zero CSS Bloat', speed: '0ms Paint Lag', reliability: '100%' },

  // Integrations
  { id: 'whatsapp', name: 'WhatsApp API', category: 'Integrations', icon: SiWhatsapp, color: '#25D366', role: '24/7 Automated Business AI Bot & Lead Dispatcher', highlight: '98% Open Rate', speed: 'Instant Ping', reliability: '99.9%' },
  { id: 'razorpay', name: 'Razorpay', category: 'Integrations', icon: SiRazorpay, color: '#3395FF', role: 'Encrypted Payment Processing & Automated Invoicing', highlight: 'Instant Payouts', speed: '< 1s Gateway', reliability: '99.99%' },
  { id: 'stripe', name: 'Stripe', category: 'Integrations', icon: SiStripe, color: '#635BFF', role: 'Global Multi-Currency Billing & Subscription Engine', highlight: 'Global Merchant', speed: 'PCI-DSS L1', reliability: '99.999%' },
  { id: 'sheets', name: 'Google Sheets', category: 'Integrations', icon: SiGooglesheets, color: '#0F9D58', role: 'Automated Real-Time Cloud Sheet Synchronization', highlight: 'Zero Admin UI', speed: 'Live Webhook', reliability: '99.9%' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'AI & Automation': '#06b6d4',
  'Cloud & DevOps': '#f97316',
  'Database': '#f59e0b',
  'Backend': '#10b981',
  'Frontend': '#3b82f6',
  'Integrations': '#a855f7',
};

// ---------------------------------------------------------------------------
// 3D Luxury Holographic Neural Orbit with Scroll-Triggered Expansion
// ---------------------------------------------------------------------------
const LuxuryNeuralOrbit: React.FC<{
  activeCategory: string;
  selectedTech: TechItem | null;
  onSelectTech: (tech: TechItem) => void;
  isRotating: boolean;
  onToggleRotating: () => void;
  isVisible: boolean;
  scrollProgress: number;
}> = ({ activeCategory, selectedTech, onSelectTech, isRotating, onToggleRotating, isVisible, scrollProgress }) => {
  const [mouseTilt, setMouseTilt] = useState({ x: 16, y: 0 });
  const [hoveredTool, setHoveredTool] = useState<TechItem | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: 16 - py * 16, y: px * 18 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 16, y: 0 });
    setHoveredTool(null);
  };

  // 3 Concentric Orbit Rings configuration
  const ring1 = useMemo(() => TECH_TOOLS.slice(0, 6), []);   // r = 120px
  const ring2 = useMemo(() => TECH_TOOLS.slice(6, 15), []);  // r = 195px
  const ring3 = useMemo(() => TECH_TOOLS.slice(15, 24), []); // r = 270px

  const activeTool = hoveredTool || selectedTech || TECH_TOOLS[0];

  // Dynamic parallax tilt combined with scroll progress
  const finalTiltX = mouseTilt.x + (scrollProgress - 0.5) * 8;
  const finalTiltY = mouseTilt.y;

  return (
    <div
      className="relative mx-auto flex items-center justify-center select-none transition-all duration-1000"
      style={{
        width: 'min(94vw, 680px)',
        height: 'min(90vw, 600px)',
        perspective: '1300px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(40px)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        @keyframes orbit-spin-cw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit-spin-ccw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .orbit-spin-cw {
          animation: orbit-spin-cw var(--orbit-dur, 45s) linear infinite;
        }
        .orbit-spin-ccw {
          animation: orbit-spin-ccw var(--orbit-dur, 60s) linear infinite;
        }
        .orbit-counter-cw {
          animation: orbit-spin-ccw var(--orbit-dur, 45s) linear infinite;
        }
        .orbit-counter-ccw {
          animation: orbit-spin-cw var(--orbit-dur, 60s) linear infinite;
        }
        .orbit-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Holographic Ambient Glow Aura */}
      <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/15 blur-[100px] pointer-events-none animate-pulse-soft" />
      <div className="absolute w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[60px] pointer-events-none" />

      {/* 3D Master Disc Container */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
        style={{
          transform: `rotateX(${finalTiltX}deg) rotateY(${finalTiltY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Outer Grid Cosmic Halo */}
        <div
          className={`absolute w-[560px] h-[560px] rounded-full border border-white/[0.04] pointer-events-none transition-all duration-1000 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
          style={{ transitionDelay: '100ms' }}
        />

        {/* Ring 3 Cosmic Track (r = 270px, diameter 540px) */}
        <div
          className={`absolute w-[540px] h-[540px] rounded-full border border-violet-500/20 shadow-[0_0_25px_rgba(168,85,247,0.08)] pointer-events-none transition-all duration-1000 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {/* Subtle Radar Scanner Glow */}
          <div className="absolute inset-0 rounded-full border border-violet-400/30 animate-ping opacity-25" style={{ animationDuration: '4s' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_10px_#a855f7]" />
        </div>

        {/* Ring 2 Quantum Dashed Track (r = 195px, diameter 390px) */}
        <div
          className={`absolute w-[390px] h-[390px] rounded-full border border-dashed border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.12)] pointer-events-none transition-all duration-1000 ${
            isVisible ? 'scale-100 opacity-80' : 'scale-50 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#06b6d4] animate-pulse" />
        </div>

        {/* Ring 1 Inner Magnetic Ring (r = 120px, diameter 240px) */}
        <div
          className={`absolute w-[240px] h-[240px] rounded-full border border-blue-500/35 shadow-[0_0_20px_rgba(59,130,246,0.18)] pointer-events-none transition-all duration-1000 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6] animate-ping" />
        </div>

        {/* Center Glowing Hub - ZENTRIX NEURAL OS CORE */}
        <div
          className={`relative z-30 flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-full bg-black/95 border border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.35)] backdrop-blur-2xl group cursor-pointer transition-all duration-700 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          onClick={() => onSelectTech(TECH_TOOLS[0])}
        >
          {/* Multi-layered spinning energetic auras */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/25 via-indigo-600/15 to-violet-500/20 animate-spin-slow pointer-events-none" />
          <div className="absolute inset-[2px] rounded-full border border-white/10 pointer-events-none" />

          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-400/40 flex items-center justify-center mb-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
            <Cpu className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>

          <span className="text-white font-black text-[10px] md:text-xs tracking-widest uppercase font-mono">ZENTRIXS</span>
          <span className="text-[7px] text-cyan-400 font-bold tracking-[0.25em] uppercase">NEURAL CORE</span>

          <div className="mt-0.5 flex items-center gap-1 text-[6.5px] font-black text-emerald-400 px-1.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
            SYNAPSE ONLINE
          </div>
        </div>

        {/* Orbit Ring 1: Inner (6 tools, r = 120px) - Clockwise continuous rotation */}
        <div
          className={`absolute w-[240px] h-[240px] rounded-full flex items-center justify-center ${
            isRotating ? 'orbit-spin-cw' : 'orbit-paused'
          }`}
          style={{ '--orbit-dur': '45s' } as React.CSSProperties}
        >
          {ring1.map((tool, idx) => {
            const angle = (idx * 360) / ring1.length;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 120;
            const y = Math.sin(rad) * 120;
            const isMatch = activeCategory === 'all' || tool.category.toLowerCase().includes(activeCategory);
            const isSelected = selectedTech?.id === tool.id;

            return (
              <div
                key={tool.id}
                className="absolute z-20 cursor-pointer"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                onMouseEnter={() => setHoveredTool(tool)}
                onMouseLeave={() => setHoveredTool(null)}
                onClick={() => onSelectTech(tool)}
              >
                {/* Counter-rotation to keep icons perfectly upright */}
                <div
                  className={isRotating ? 'orbit-counter-cw' : 'orbit-paused'}
                  style={{ '--orbit-dur': '45s' } as React.CSSProperties}
                >
                  <LuxuryOrbNode tool={tool} isMatch={isMatch} isSelected={isSelected} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Orbit Ring 2: Middle (9 tools, r = 195px) - Counter-clockwise continuous rotation */}
        <div
          className={`absolute w-[390px] h-[390px] rounded-full flex items-center justify-center ${
            isRotating ? 'orbit-spin-ccw' : 'orbit-paused'
          }`}
          style={{ '--orbit-dur': '65s' } as React.CSSProperties}
        >
          {ring2.map((tool, idx) => {
            const angle = (idx * 360) / ring2.length;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 195;
            const y = Math.sin(rad) * 195;
            const isMatch = activeCategory === 'all' || tool.category.toLowerCase().includes(activeCategory);
            const isSelected = selectedTech?.id === tool.id;

            return (
              <div
                key={tool.id}
                className="absolute z-20 cursor-pointer"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                onMouseEnter={() => setHoveredTool(tool)}
                onMouseLeave={() => setHoveredTool(null)}
                onClick={() => onSelectTech(tool)}
              >
                {/* Counter-rotation to keep icons perfectly upright */}
                <div
                  className={isRotating ? 'orbit-counter-ccw' : 'orbit-paused'}
                  style={{ '--orbit-dur': '65s' } as React.CSSProperties}
                >
                  <LuxuryOrbNode tool={tool} isMatch={isMatch} isSelected={isSelected} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Orbit Ring 3: Outer (9 tools, r = 270px) - Clockwise continuous rotation */}
        <div
          className={`absolute w-[540px] h-[540px] rounded-full flex items-center justify-center ${
            isRotating ? 'orbit-spin-cw' : 'orbit-paused'
          }`}
          style={{ '--orbit-dur': '85s' } as React.CSSProperties}
        >
          {ring3.map((tool, idx) => {
            const angle = (idx * 360) / ring3.length;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 270;
            const y = Math.sin(rad) * 270;
            const isMatch = activeCategory === 'all' || tool.category.toLowerCase().includes(activeCategory);
            const isSelected = selectedTech?.id === tool.id;

            return (
              <div
                key={tool.id}
                className="absolute z-20 cursor-pointer"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                onMouseEnter={() => setHoveredTool(tool)}
                onMouseLeave={() => setHoveredTool(null)}
                onClick={() => onSelectTech(tool)}
              >
                {/* Counter-rotation to keep icons perfectly upright */}
                <div
                  className={isRotating ? 'orbit-counter-cw' : 'orbit-paused'}
                  style={{ '--orbit-dur': '85s' } as React.CSSProperties}
                >
                  <LuxuryOrbNode tool={tool} isMatch={isMatch} isSelected={isSelected} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Motion Control */}
      <button
        onClick={onToggleRotating}
        className="absolute bottom-1 right-2 px-3 py-1 rounded-full bg-black/80 border border-white/10 hover:border-cyan-400/50 text-[9px] font-bold text-gray-400 hover:text-white flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg hover:scale-105 z-30"
        title={isRotating ? 'Pause Orbit Animation' : 'Resume Orbit Animation'}
      >
        {isRotating ? <Pause className="w-2.5 h-2.5 text-cyan-400" /> : <Play className="w-2.5 h-2.5 text-emerald-400" />}
        <span>{isRotating ? 'Orbit Active' : 'Orbit Paused'}</span>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sleek Compact Luxury Orb Node (Small & Elegant)
// ---------------------------------------------------------------------------
const LuxuryOrbNode: React.FC<{
  tool: TechItem;
  isMatch: boolean;
  isSelected: boolean;
}> = ({ tool, isMatch, isSelected }) => {
  return (
    <div
      className={`group/node relative flex flex-col items-center justify-center transition-all duration-300 ${
        isMatch ? 'opacity-100 scale-100' : 'opacity-20 scale-75 blur-[1px]'
      }`}
    >
      {/* Compact Icon Box */}
      <div
        className={`relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl backdrop-blur-2xl border transition-all duration-300 group-hover/node:scale-120 ${
          isSelected
            ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.9)] scale-110'
            : 'bg-zinc-950/85 border-white/10 hover:border-white/40 shadow-lg'
        }`}
        style={{
          boxShadow: isSelected
            ? `0 0 25px ${tool.color}90, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 10px ${tool.color}40`
            : `0 6px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 8px ${tool.color}20`,
        }}
      >
        <tool.icon
          size="1.15rem"
          color={NEEDS_LIGHT_FILL.has(tool.name) ? '#ffffff' : tool.color}
          style={{ filter: `drop-shadow(0 0 8px ${tool.color}80)` }}
        />

        {/* Small Active Corner Pulse Dot */}
        <span
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-black"
          style={{ backgroundColor: tool.color, boxShadow: `0 0 6px ${tool.color}` }}
        />
      </div>

      {/* Monospace Sleek Pill Label */}
      <span
        className="mt-1 text-[8px] md:text-[9px] font-bold tracking-wider text-gray-300 group-hover/node:text-white transition-colors whitespace-nowrap bg-black/90 px-2 py-0.5 rounded border border-white/10 backdrop-blur-md shadow-md"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
      >
        {tool.name}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Luxury Bento Grid Matrix
// ---------------------------------------------------------------------------
const LuxuryBentoMatrix: React.FC<{
  activeCategory: string;
  selectedTech: TechItem | null;
  onSelectTech: (tech: TechItem) => void;
}> = ({ activeCategory, selectedTech, onSelectTech }) => {
  const categories = Object.keys(CATEGORY_COLORS);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto px-4">
      {categories.map((catName) => {
        const catColor = CATEGORY_COLORS[catName];
        const tools = TECH_TOOLS.filter((t) => t.category === catName);
        const isCatActive = activeCategory === 'all' || catName.toLowerCase().includes(activeCategory);

        return (
          <div
            key={catName}
            className={`relative p-6 rounded-2xl bg-zinc-950/90 border transition-all duration-500 backdrop-blur-2xl flex flex-col justify-between group overflow-hidden ${
              isCatActive
                ? 'border-white/15 hover:border-cyan-500/50 shadow-2xl hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] opacity-100'
                : 'opacity-30 border-white/5'
            }`}
          >
            {/* Top Iridescent Bevel Highlight */}
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent group-hover:via-cyan-400/80 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2"
                  style={{ color: catColor }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse shadow-md"
                    style={{ backgroundColor: catColor, boxShadow: `0 0 8px ${catColor}` }}
                  />
                  {catName}
                </span>
                <span className="text-[9px] font-mono font-black text-gray-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  4 ENGINES
                </span>
              </div>

              {/* Tools Badges Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {tools.map((tech) => {
                  const isSelected = selectedTech?.id === tech.id;
                  return (
                    <div
                      key={tech.id}
                      onClick={() => onSelectTech(tech)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 group/item ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform"
                        style={{ boxShadow: `inset 0 0 8px ${tech.color}30` }}
                      >
                        <tech.icon
                          size="1rem"
                          color={NEEDS_LIGHT_FILL.has(tech.name) ? '#ffffff' : tech.color}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-white truncate">{tech.name}</p>
                        <p className="text-[8px] font-mono text-cyan-400 truncate">{tech.speed}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono border-t border-white/5 pt-3">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3" /> High Availability
              </span>
              <span className="uppercase tracking-widest text-gray-500 font-bold">SLA: 99.99%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Section Component with Scroll Reveal & Parallax
// ---------------------------------------------------------------------------
const TechStackSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(TECH_TOOLS[0]);
  const [viewMode, setViewMode] = useState<'orbit' | 'bento'>('orbit');
  const [isRotating, setIsRotating] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    // Scroll listener for dynamic scroll parallax effects
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      className="py-28 bg-[#020205] relative border-y border-white/[0.05] overflow-hidden"
    >
      {/* Cyber Particle / Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.12),transparent_70%)]" />

      {/* Luxury Telemetry Live Ticker */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className={`py-2 px-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-gray-500 uppercase tracking-widest backdrop-blur-md transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>ZENTRIX PROTOCOL 4.2</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span>UPTIME: 99.99%</span>
            <span>NODES: 24 ACTIVE</span>
            <span>LATENCY: 12ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURED HIGH-SPEED MESH
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-8">
        {/* Header Section with Smooth Scroll Reveal */}
        <div className={`text-center transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="text-cyan-400 font-black tracking-widest text-xs uppercase">Enterprise Architecture</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white w-full tracking-tight mb-4">
            Zentrixs <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500">Tech Ecosystem</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Engineered with high-velocity modern frameworks, autonomous AI pipelines, and distributed cloud microservices.
          </p>
        </div>

        {/* View Switcher & Category Filters */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-6 transition-all duration-1000 delay-150 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl">
            {TECH_CATEGORIES.map((cat) => {
              const isActive = activeCategory === (cat.id === 'all' ? 'all' : cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id === 'all' ? 'all' : cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105 border border-cyan-300/40'
                      : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  <cat.icon className="w-3 h-3" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md shrink-0">
            <button
              onClick={() => setViewMode('orbit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'orbit'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" /> 3D Orbit
            </button>
            <button
              onClick={() => setViewMode('bento')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'bento'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Bento Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Main View Display */}
      {viewMode === 'orbit' ? (
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Desktop & Tablet 3D Orbit */}
          <div className="hidden md:flex justify-center w-full">
            <LuxuryNeuralOrbit
              activeCategory={activeCategory}
              selectedTech={selectedTech}
              onSelectTech={(tech) => setSelectedTech(tech)}
              isRotating={isRotating}
              onToggleRotating={() => setIsRotating(!isRotating)}
              isVisible={isVisible}
              scrollProgress={scrollProgress}
            />
          </div>

          {/* Mobile View: Sleek Bento Cards */}
          <div className="md:hidden w-full px-4">
            <LuxuryBentoMatrix
              activeCategory={activeCategory}
              selectedTech={selectedTech}
              onSelectTech={(tech) => setSelectedTech(tech)}
            />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <LuxuryBentoMatrix
            activeCategory={activeCategory}
            selectedTech={selectedTech}
            onSelectTech={(tech) => setSelectedTech(tech)}
          />
        </div>
      )}
    </section>
  );
};

export default TechStackSection;

