
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, TrendingUp, Users, ShieldCheck, Zap } from 'lucide-react';
import { COMPANY_NAME } from '../constants';

const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <div ref={elementRef} className="text-5xl font-black mb-2 tracking-tighter">
      {count}{suffix}
    </div>
  );
};

const WhyChooseSection: React.FC = () => {
  return (
    <section id="why-choose" className="py-32 bg-[#050505] relative overflow-hidden perspective-3d">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Content */}
          <div className="reveal reveal-left">
            <span className="text-blue-500 font-black tracking-[0.5em] text-[10px] uppercase mb-6 block">Our Tactical Edge</span>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-10 tracking-tighter leading-none">
              Why <span className="gradient-text">{COMPANY_NAME}?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-xl font-medium">
              We don't just build apps; we architect <span className="text-white">autonomous environments</span> that drive regional growth in Raipur.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { icon: CheckCircle, title: "Proven Nodes", desc: "500+ Local Projects", color: "blue" },
                { icon: TrendingUp, title: "Hyper Scale", desc: "Future-proof Logic", color: "violet" },
                { icon: Users, title: "Expert Cell", desc: "Top 1% Talent", color: "blue" },
                { icon: ShieldCheck, title: "Fortress Security", desc: "AES-256 Grade", color: "violet" }
              ].map((item, i) => (
                <div key={i} className="group cursor-default">
                  <div className={`w-14 h-14 rounded-2xl ${item.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'} border flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-xl`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight italic">{item.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed uppercase tracking-widest font-bold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 3D Stack */}
          <div className="relative transform-style-3d">
             <div className="absolute -inset-10 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
             
             {/* Stacked Cards */}
             <div className="space-y-8 relative">
                <div className="tilt-card glass p-10 rounded-[3rem] border border-white/10 shadow-3xl bg-gradient-to-br from-[#121212] to-black transform translate-z-10">
                   <Zap className="text-blue-500 w-10 h-10 mb-8" />
                   <h3 className="text-3xl font-black text-white mb-6 tracking-tight">MISSION ALPHA</h3>
                   <p className="text-gray-400 text-lg leading-relaxed font-medium">
                     Empowering Raipur's enterprise ecosystem with intelligent, self-sustaining IT infrastructure.
                   </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 transform translate-z-20">
                   <div className="tilt-card glass p-8 rounded-[2.5rem] border border-white/10 text-center bg-blue-600/5">
                      <div className="text-blue-500">
                        <AnimatedCounter end={99} suffix="%" />
                      </div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Precision Rate</p>
                   </div>
                   <div className="tilt-card glass p-8 rounded-[2.5rem] border border-white/10 text-center bg-violet-600/5">
                      <div className="text-violet-500">
                        <AnimatedCounter end={24} suffix="/7" />
                      </div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Node Monitoring</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
      
      {/* Decorative Layer */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
    </section>
  );
};

export default WhyChooseSection;
