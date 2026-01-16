
import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Loader2, Globe, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from '../constants';
import { fetchTestimonialsFromSheet } from '../services/sheetService';

const ImageWithFallback = ({ src, alt, className }: { src: string | null, alt: string, className: string }) => {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const initial = alt ? alt.charAt(0).toUpperCase() : 'Z';

  if (error || !src) {
    return (
      <div className={`${className} bg-zinc-900 flex items-center justify-center border border-white/10 text-cyan-500 font-black text-xl uppercase`}>
        {initial}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${className} transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
      onLoad={(e) => {
        setIsLoaded(true);
        (e.target as HTMLImageElement).classList.add('loaded');
      }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

const TestimonialsSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sheetData = await fetchTestimonialsFromSheet();
        if (sheetData && sheetData.length > 0) {
          setTestimonials(sheetData);
        } else {
          setTestimonials(DEFAULT_TESTIMONIALS);
        }
      } catch (e) {
        setTestimonials(DEFAULT_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const next = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setStartIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    const visible = [];
    const displayCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
    const count = Math.min(testimonials.length, displayCount);
    for (let i = 0; i < count; i++) {
      visible.push(testimonials[(startIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section id="why" className="py-32 bg-[#020202] relative overflow-hidden border-y border-white/[0.03]">
      {/* Background visual elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ENTERPRISE PARTNERS MARQUEE (Matching user screenshot exactly) */}
        <div className="mb-48 reveal reveal-up active">
          <div className="flex flex-col items-center mb-16 text-center">
             <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-cyan-500/30 bg-transparent mb-12 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">ENTERPRISE PARTNERS</span>
             </div>
          </div>

          <div className="relative overflow-hidden group">
            {/* Fade masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#020202] via-[#020202]/50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#020202] via-[#020202]/50 to-transparent z-10 pointer-events-none"></div>
            
            {/* Running Marquee Container */}
            <div className="animate-marquee flex items-center gap-6 md:gap-8 py-8">
              {[...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="shrink-0">
                  {/* Card container matching the screenshot style */}
                  <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 flex items-center justify-center p-6 transition-all duration-500 hover:border-cyan-500/40 hover:bg-[#0F0F0F] group/logo shadow-2xl relative">
                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                      <ImageWithFallback 
                        src={t.logo} 
                        alt={t.company} 
                        className="max-w-full max-h-full object-contain" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SERVICE DEPLOYMENTS (Feedback Section) */}
        <div className="text-center mb-24 reveal reveal-up active">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Globe className="w-5 h-5 text-cyan-500" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Project Delivery Logs</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-none italic">
            SERVICE <span className="text-cyan-500">DEPLOYMENTS.</span>
          </h2>
          <p className="text-zinc-500 text-sm md:text-base font-medium uppercase tracking-[0.1em] max-w-2xl mx-auto leading-relaxed border-t border-white/5 pt-8">
            A comprehensive track record of high-performance <span className="text-white">solutions delivered</span> to our global enterprise network. 
            All projects verified for operational excellence.
          </p>
          
          <div className="flex justify-center items-center gap-8 mt-16">
            <button 
              onClick={prev} 
              className="w-14 h-14 rounded-full border border-white/10 bg-zinc-900/50 hover:bg-cyan-600/10 hover:border-cyan-500/50 transition-all text-zinc-400 hover:text-white group flex items-center justify-center shadow-xl"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={next} 
              className="w-14 h-14 rounded-full border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-600 hover:border-cyan-500 transition-all text-cyan-500 hover:text-white group flex items-center justify-center shadow-xl"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin opacity-50" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getVisibleTestimonials().map((t, i) => (
              <div 
                key={`${startIndex}-${i}`} 
                className="bg-[#050505] border border-white/5 p-10 md:p-12 rounded-[3.5rem] flex flex-col h-full transition-all duration-700 hover:border-cyan-500/30 hover:-translate-y-3 group relative overflow-hidden shadow-2xl animate-fade-in"
              >
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity" 
                     style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
                </div>
                
                <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-4 h-4 fill-cyan-500 text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                    ))}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-center group-hover:bg-cyan-600/20 group-hover:border-cyan-500/40 transition-all shadow-inner">
                    <Quote className="w-8 h-8 text-cyan-500 rotate-180 transition-all group-hover:scale-110" />
                  </div>
                </div>

                <p className="text-zinc-300 text-lg md:text-xl leading-relaxed mb-16 font-black uppercase tracking-tight italic relative z-10 group-hover:text-white transition-colors">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-6 pt-10 border-t border-white/5 mt-auto relative z-10 group-hover:border-cyan-500/20 transition-all">
                  {/* Testimonial Card Logo Container Refined */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-transparent group-hover:border-cyan-500 transition-all p-2 flex items-center justify-center shadow-2xl">
                    <ImageWithFallback src={t.logo} alt={t.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-[14px] font-black text-white uppercase tracking-[0.2em] leading-none mb-2 truncate group-hover:text-cyan-400 transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.3em] group-hover:text-zinc-300 transition-colors truncate">
                      {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-3 mt-20">
          {testimonials.slice(0, 10).map((_, i) => (
            <button 
              key={i} 
              onClick={() => setStartIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-700 ${i === startIndex ? 'w-20 bg-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'w-4 bg-zinc-800 hover:bg-zinc-700'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
