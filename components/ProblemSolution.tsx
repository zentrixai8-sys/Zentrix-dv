import React from 'react';
import { Users, Bot, FileText, PackageCheck, Database, BarChart3, ArrowRight, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ScrollZoomReveal from './ScrollZoomReveal';
import { AI_BOT_NUMBER } from '../constants';

const ProblemSolution: React.FC = () => {
  const whatsappUrl = `https://wa.me/91${AI_BOT_NUMBER}?text=Hi%20Zentrixs,%20I%20want%20to%20automate%20our%20business%20workflows!`;

  return (
    <div id="problem-solution" className="bg-black text-white relative">
      
      {/* 1. SCROLL ZOOM REVEAL SHOWCASE (Replaces Slow Operations) */}
      <ScrollZoomReveal
        leftText="©2026 MANUAL CHAOS"
        rightText="AUTONOMOUS SYSTEM"
        buttonText="EXPLORE AUTONOMOUS MATRIX"
        imageSrc="/images/ai-software-website-and-app-development.webp"
        videoUrl="https://framerusercontent.com/assets/eyVMUuEcpvbKYJwPqZANvybTfI.mp4"
      />

      {/* 2. THE SOLUTION SECTION: AUTOPILOT ENGINE */}
      <section className="relative py-28 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden border-t border-white/5">
        
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-20 reveal reveal-scale">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="uppercase tracking-[0.2em]">AUTOPILOT ENGINE &bull; 6 CORE CAPABILITIES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
              Put Your Business On{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                Autopilot Growth.
              </span>
            </h2>

            <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl font-normal leading-relaxed">
              Eliminate manual friction, never lose another deal, and automate your end-to-end operations with autonomous AI agents &amp; custom software pipelines.
            </p>
          </div>

          {/* 6 HIGH-MOTION INTERACTIVE AUTOPILOT MODULES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[
              {
                id: "leads",
                badge: "Zero Lead Leakage",
                label: "Leads Auto Capture",
                desc: "Instantly captures and qualifies customer inquiries from WhatsApp, Meta ads, Google & website forms into one unified pipeline.",
                icon: Users,
                metric: "Omnichannel 24/7",
                color: "cyan",
                stats: "100% Ingested",
                previewType: "pipeline"
              },
              {
                id: "followup",
                badge: "Autonomous AI",
                label: "Automatic Follow-ups",
                desc: "Intelligent AI agents follow up with warm leads on WhatsApp, answer product FAQs, and book consultations until they convert.",
                icon: Bot,
                metric: "3x Faster Conversions",
                color: "blue",
                stats: "24/7 Active Bot",
                previewType: "chat"
              },
              {
                id: "billing",
                badge: "Instant Invoicing",
                label: "Billing Automation",
                desc: "Generate professional GST bills, dispatch automated payment reminders via WhatsApp, and track settlements in real time.",
                icon: FileText,
                metric: "100% Tax Compliant",
                color: "emerald",
                stats: "Auto E-Way & GST",
                previewType: "invoice"
              },
              {
                id: "inventory",
                badge: "Live Multi-Warehouse",
                label: "Inventory Control",
                desc: "Automated stock tracking, reorder alert triggers, and real-time catalog syncing to prevent costly stockouts or dead inventory.",
                icon: PackageCheck,
                metric: "Real-Time Sync",
                color: "amber",
                stats: "Low-Stock Alerts",
                previewType: "stock"
              },
              {
                id: "crm",
                badge: "Bank-Grade Encryption",
                label: "Customer Database (CRM)",
                desc: "Securely organize client interaction histories, transaction records, and communication timelines in one high-speed database.",
                icon: Database,
                metric: "Cloud Encrypted",
                color: "purple",
                stats: "AES-256 Vault",
                previewType: "security"
              },
              {
                id: "reports",
                badge: "Executive Insights",
                label: "Sales & Growth Reports",
                desc: "Automated daily and weekly analytics digests delivered right to your WhatsApp with revenue metrics, margins & team performance.",
                icon: BarChart3,
                metric: "Daily WhatsApp Digest",
                color: "rose",
                stats: "+42.8% Margin Gain",
                previewType: "chart"
              }
            ].map((item, i) => (
              <AutopilotCard key={item.id} item={item} index={i} />
            ))}
          </div>

          {/* Bottom Action CTA Ribbon */}
          <div className="mt-16 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-zinc-900/80 via-zinc-950 to-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 reveal reveal-up">
            <div className="max-w-xl text-center md:text-left">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-3 inline-block">
                Zero Setup Barrier
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Ready to transition from manual to autonomous?
              </h3>
              <p className="text-zinc-400 text-sm mt-2">
                Deploy customized AI workflows tailored for your business within 48 to 72 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black uppercase text-xs tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Automate My Business</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-white font-bold uppercase text-xs tracking-wider border border-white/10 transition-all hover:scale-105"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Talk to Architect</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

// Interactive Motion Card Component with Dynamic Spotlight & Live Simulation Visuals
interface AutopilotCardProps {
  item: {
    id: string;
    badge: string;
    label: string;
    desc: string;
    icon: any;
    metric: string;
    color: string;
    stats: string;
    previewType: string;
  };
  index: number;
}

const AutopilotCard: React.FC<AutopilotCardProps> = ({ item, index }) => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="reveal reveal-up relative rounded-[2rem] p-8 transition-all duration-500 group flex flex-col justify-between overflow-hidden cursor-default border border-white/[0.08] hover:border-cyan-500/50 hover:shadow-[0_20px_50px_rgba(6,182,212,0.18)] hover:-translate-y-1.5"
      style={{
        background: 'linear-gradient(180deg, rgba(14, 18, 27, 0.85) 0%, rgba(6, 8, 12, 0.95) 100%)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Dynamic Cursor-Tracking Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.15), transparent 80%)`
        }}
      />

      {/* Top Ambient Corner Light */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/25 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

      <div>
        {/* Top Bar: Icon + Live Pill */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300">
              <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 group-hover:border-cyan-500/40 group-hover:text-cyan-300 group-hover:bg-cyan-950/40 transition-all duration-300 font-mono text-[10px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{item.badge}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2.5 tracking-tight group-hover:text-cyan-200 transition-colors relative z-10">
          {item.label}
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal mb-6 relative z-10">
          {item.desc}
        </p>

        {/* Dynamic Visualizer Mockup */}
        <div className="relative rounded-xl p-4 bg-black/40 border border-white/5 mb-6 overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono mb-2">
            <span className="text-zinc-400">{item.metric}</span>
            <span className="text-cyan-400 font-bold">{item.stats}</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" style={{ width: '88%' }} />
          </div>
        </div>
      </div>

      {/* Card Footer Metric */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 relative z-10">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Autonomous Sync</span>
        </span>
        <span className="font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
      </div>
    </div>
  );
};

export default ProblemSolution;
