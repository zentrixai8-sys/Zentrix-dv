
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
    <section id="why" className="py-24 bg-[#020202] relative overflow-hidden border-y border-white/[0.03]">
      {/* Background visual elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none opacity-20"></div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ENTERPRISE PARTNERS MARQUEE */}
        <div className="mb-32 reveal reveal-up active">
          <div className="flex flex-col items-center mb-12 text-center">
             <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-cyan-500/20 bg-transparent mb-10 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.4em]">ENTERPRISE PARTNERS</span>
             </div>
          </div>

          <div className="relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#020202] via-[#020202]/50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#020202] via-[#020202]/50 to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-marquee flex items-center gap-5 md:gap-6 py-6">
              {[...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="shrink-0">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-[#0A0A0A] border border-white/5 flex items-center justify-center p-5 transition-all duration-500 hover:border-cyan-500/30 hover:bg-[#0D0D0D] group/logo shadow-xl relative">
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

        {/* SERVICE DEPLOYMENTS TITLE */}
        <div className="text-center mb-20 reveal reveal-up active">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Globe className="w-4 h-4 text-cyan-500" />
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Project Delivery Logs</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-none italic">
            SERVICE <span className="text-cyan-500">DEPLOYMENTS.</span>
          </h2>
          <p className="text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed border-t border-white/5 pt-6">
            A comprehensive track record of high-performance <span className="text-white">solutions delivered</span> to our network.
          </p>
          
          <div className="flex justify-center items-center gap-6 mt-12">
            <button 
              onClick={prev} 
              className="w-12 h-12 rounded-full border border-white/10 bg-zinc-900/50 hover:bg-cyan-600/10 hover:border-cyan-500/50 transition-all text-zinc-400 hover:text-white group flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={next} 
              className="w-12 h-12 rounded-full border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500 hover:text-white transition-all text-cyan-500 group flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin opacity-50" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((t, i) => (
              <div 
                key={`${startIndex}-${i}`} 
                className="bg-[#050505] border border-white/5 p-8 md:p-10 rounded-[2.5rem] flex flex-col h-full transition-all duration-700 hover:border-cyan-500/30 group relative overflow-hidden shadow-2xl"
              >
                {/* Subtle Grid Background matching screenshot */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.06]" 
                     style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
                </div>
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    ))}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-center group-hover:bg-cyan-600/10 transition-all">
                    <Quote className="w-5 h-5 text-cyan-500 rotate-180" />
                  </div>
                </div>

                <div className="flex-grow relative z-10">
                  <p className="text-zinc-200 text-sm md:text-base leading-relaxed mb-12 font-black uppercase tracking-tight italic group-hover:text-white transition-colors">
                    "{t.text}"
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 mt-auto relative z-10 flex items-center gap-5">
                  {/* Footer Logo Card Refined */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-transparent p-3 flex items-center justify-center shadow-lg group-hover:border-cyan-500/40 transition-all">
                    <ImageWithFallback src={t.logo} alt={t.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-[12px] font-black text-white uppercase tracking-[0.2em] leading-tight mb-1 truncate group-hover:text-cyan-400 transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] truncate">
                      {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-2.5 mt-16">
          {testimonials.slice(0, 8).map((_, i) => (
            <button 
              key={i} 
              onClick={() => setStartIndex(i)}
              className={`h-1 rounded-full transition-all duration-700 ${i === startIndex ? 'w-12 bg-cyan-600' : 'w-3 bg-zinc-800'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
