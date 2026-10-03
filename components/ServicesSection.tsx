import React from 'react';
import { Cpu, ArrowRight, Sparkles } from 'lucide-react';
import ArcFocusCarousel from './ArcFocusCarousel';
import { Link } from 'react-router-dom';

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-black relative overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[450px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-mono font-bold tracking-widest text-xs uppercase">Enterprise Automation Suite</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-6 uppercase">
            Autonomous <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Products &amp; Services</span>
          </h2>
          
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
            Drag, swipe, or click any capability on the 3D arc to explore how Zentrixs builds high-converting AI engines for modern business operations.
          </p>
        </div>

        {/* 3D Arc Focus Carousel */}
        <div className="reveal reveal-scale">
          <ArcFocusCarousel />
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-16 text-center reveal reveal-up">
          <Link
            to="/services"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all shadow-xl hover:scale-105"
          >
            <span>View Complete Service Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
