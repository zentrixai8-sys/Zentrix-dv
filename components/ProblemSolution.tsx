import React from 'react';
import { AlertTriangle, Rocket, CheckCircle, Smartphone, Clock, XCircle, Users, Zap, TrendingUp, Bot, FileText, PackageCheck, Database, BarChart3 } from 'lucide-react';

const ProblemSolution: React.FC = () => {
  return (
    <section id="problem-solution" className="bg-gradient-to-b from-zinc-950 to-black py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* THE PROBLEM SECTION */}
        <div className="flex flex-col items-center text-center mb-32 reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-red-500 font-black tracking-widest text-[10px] uppercase">Business Analysis</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 uppercase italic">
            Slow <span className="text-zinc-800">Operations.</span>
          </h2>
          <p className="text-zinc-500 text-2xl font-medium mb-12 uppercase italic">Stop doing manual work that slows down your growth.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <div className="p-12 bg-red-500/5 border border-red-500/10 rounded-[3rem] reveal reveal-left">
              <p className="text-xl text-zinc-400 font-medium uppercase italic tracking-tight leading-relaxed">
                Losing business focus due to <br /><span className="text-red-500 font-bold">constant manual follow-ups.</span>
              </p>
            </div>
            <div className="p-12 bg-red-500/5 border border-red-500/10 rounded-[3rem] reveal reveal-right">
              <p className="text-xl text-zinc-400 font-medium uppercase italic tracking-tight leading-relaxed">
                Wasting money on <br /><span className="text-red-500 font-bold">old, slow software systems.</span>
              </p>
            </div>
          </div>
        </div>

        {/* THE WHY SECTION */}
        <div className="mb-40">
          <div className="text-center mb-16 reveal reveal-up">
            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 uppercase italic">Main Problems</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Hard to Use",
                desc: "Confusing mobile apps that your team hates using.",
                anim: 'reveal-left'
              },
              {
                icon: Clock,
                title: "Slow Speed",
                desc: "Slow software that makes you wait for reports.",
                anim: 'reveal-up'
              },
              {
                icon: XCircle,
                title: "More Errors",
                desc: "Manual mistakes that cost your business money.",
                anim: 'reveal-right'
              }
            ].map((item, i) => (
              <div key={i} className={`reveal ${item.anim} stagger-${i + 1} bg-[#080808] border border-white/5 p-12 rounded-[3rem] text-center group`}>
                <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-10">
                  <item.icon className="w-8 h-8 text-red-500" />
                </div>
                <h4 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tight">{item.title}</h4>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* THE SOLUTION SECTION */}
        <div className="flex flex-col items-center text-center mb-20 reveal reveal-scale">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>AUTOPILOT ENGINE &bull; 6 CORE PILLARS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Put Your Business On{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              Autopilot Growth.
            </span>
          </h2>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-normal leading-relaxed">
            Eliminate manual friction, never miss a lead, and automate end-to-end operations with our custom software &amp; autonomous AI agents.
          </p>
        </div>

        {/* 6 MISSION-CRITICAL AUTOPILOT MODULES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              badge: "Zero Lead Leakage",
              label: "Leads Auto Capture",
              desc: "Instantly captures and qualifies customer inquiries from WhatsApp, Meta ads, Google & website forms into one unified pipeline.",
              icon: Users,
              metric: "Omnichannel 24/7"
            },
            {
              badge: "Autonomous AI",
              label: "Automatic Follow-ups",
              desc: "Intelligent AI agents follow up with warm leads on WhatsApp, answer product FAQs, and book consultations until they convert.",
              icon: Bot,
              metric: "3x Faster Conversions"
            },
            {
              badge: "Instant Invoicing",
              label: "Billing Automation",
              desc: "Generate professional GST bills, dispatch automated payment reminders via WhatsApp, and track settlements in real time.",
              icon: FileText,
              metric: "100% Tax Compliant"
            },
            {
              badge: "Live Multi-Warehouse",
              label: "Inventory Control",
              desc: "Automated stock tracking, reorder alert triggers, and real-time catalog syncing to prevent costly stockouts or dead inventory.",
              icon: PackageCheck,
              metric: "Real-Time Sync"
            },
            {
              badge: "Bank-Grade Encryption",
              label: "Customer Database (CRM)",
              desc: "Securely organize client interaction histories, transaction records, and communication timelines in one high-speed database.",
              icon: Database,
              metric: "Cloud Encrypted"
            },
            {
              badge: "Executive Insights",
              label: "Sales & Growth Reports",
              desc: "Automated daily and weekly analytics digests delivered right to your WhatsApp with revenue metrics, margins & team performance.",
              icon: BarChart3,
              metric: "Daily WhatsApp Digest"
            }
          ].map((item, i) => (
            <div
              key={i}
              className="reveal reveal-up stagger-2 relative bg-gradient-to-b from-zinc-900/70 via-black/80 to-black/90 backdrop-blur-xl border border-white/[0.08] p-8 md:p-9 rounded-3xl hover:border-cyan-500/40 hover:shadow-[0_15px_40px_rgba(6,182,212,0.12)] transition-all duration-500 group flex flex-col justify-between overflow-hidden"
            >
              {/* Radial ambient glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/25 transition-all duration-500 pointer-events-none" />

              <div>
                {/* Header: Icon + Micro Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300">
                    <item.icon className="w-6 h-6 transition-transform duration-300" />
                  </div>
                  <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-200 transition-colors">
                  {item.label}
                </h4>

                {/* Description */}
                <p className="text-zinc-400 text-sm leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Footer Accent */}
              <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span className="group-hover:text-zinc-300 transition-colors">{item.metric}</span>
                <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-bold text-[11px]">
                  Autopilot Active &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProblemSolution;
