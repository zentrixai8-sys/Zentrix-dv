
import React from 'react';
import { AlertTriangle, Rocket, CheckCircle, Smartphone, Clock, XCircle, Users, Zap, TrendingUp } from 'lucide-react';

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

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
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

          <div className="grid md:grid-cols-3 gap-8">
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
        <div className="flex flex-col items-center text-center mb-24 reveal reveal-scale">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 font-black tracking-widest text-[10px] uppercase">The Solution</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase italic">
            Automated <span className="text-emerald-500">Growth.</span>
          </h2>

          <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl font-medium leading-relaxed uppercase italic">
            We build smart systems that work for you.
            Focus on <span className="text-white">Growing Business</span> while we handle the rest.
          </p>
        </div>

        {/* STATISTICS */}
        {/* BUSINESS USE CASES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Leads Auto Capture", desc: "Never miss a customer inquiry from any source.", icon: Users },
            { label: "Automatic Follow-ups", desc: "AI agents chase leads until they convert.", icon: Zap },
            { label: "Billing Automation", desc: "Generate invoices and track payments instantly.", icon: TrendingUp },
            { label: "Inventory Control", desc: "Real-time stock tracking and low-stock alerts.", icon: CheckCircle },
            { label: "Customer Database", desc: "Securely store and organize all client data.", icon: Rocket },
            { label: "Sales Reports", desc: "Daily analytics to measure your business growth.", icon: Smartphone }
          ].map((item, i) => (
            <div key={i} className="reveal reveal-up stagger-2 bg-[#080808] border border-white/5 p-10 rounded-[2.5rem] hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white text-blue-500 transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-white mb-4 uppercase italic tracking-tighter">{item.label}</h4>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProblemSolution;
