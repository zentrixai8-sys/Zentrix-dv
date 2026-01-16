
import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Loader2, Globe, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from '../constants';
import { fetchTestimonialsFromSheet } from '../services/sheetService';

const ImageWithFallback = ({ src, alt, className }: { src: string | null, alt: string, className: string }) => {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const initial = alt.charAt(0).toUpperCase();

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
      onLoad={() => setIsLoaded(true)}
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
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* LOGO MARQUEE */}
        <div className="mb-32 reveal reveal-up active">
          <div className="flex flex-col items-center mb-12">
             <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.4em]">ENTERPRISE PARTNERS</span>
             </div>
          </div>

          <div className="relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-[#020202] via-[#020202]/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-[#020202] via-[#020202]/80 to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-marquee flex items-center gap-12 py-8">
              {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="flex items-center gap-6 group/logo transition-all duration-500">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden bg-zinc-900/40 border border-white/10 p-6 flex items-center justify-center group-hover/logo:border-cyan-500/60 group-hover/logo:bg-cyan-500/10 transition-all relative">
                    <ImageWithFallback 
                      src={t.logo} 
                      alt={t.company} 
                      className="w-full h-full object-contain filter contrast-110 brightness-110 group-hover/logo:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-zinc-500 font-black text-[12px] uppercase tracking-[0.3em] whitespace-nowrap group-hover/logo:text-white transition-colors">
                      {t.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heading & Controls */}
        <div className="text-center mb-16 reveal reveal-up active">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-none italic">
            Client <span className="text-cyan-500">Feedback</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-xl mx-auto border-t border-white/5 pt-6 mb-12">
            Verification protocols from our global operational network.
          </p>
          
          <div className="flex justify-center items-center gap-6">
            <button 
              onClick={prev} 
              className="p-4 rounded-2xl border border-white/5 bg-zinc-900/40 hover:bg-cyan-600/10 hover:border-cyan-500/40 transition-all text-zinc-500 hover:text-white group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={next} 
              className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-600 hover:border-cyan-500 transition-all text-cyan-500 hover:text-white group"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin opacity-40" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((t, i) => (
              <div 
                key={`${startIndex}-${i}`} 
                className="bg-[#050505] border border-white/10 p-8 rounded-[2.5rem] flex flex-col h-full transition-all duration-500 hover:border-cyan-500/50 hover:-translate-y-2 group relative overflow-hidden shadow-2xl animate-fade-in"
              >
                {/* Visual Grid Background */}
                <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.04] transition-opacity" 
                     style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
                </div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-4 h-4 fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                    ))}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center group-hover:bg-cyan-600/20 group-hover:border-cyan-500/60 transition-all">
                    <Quote className="w-6 h-6 text-cyan-500 rotate-180 transition-transform group-hover:scale-110" />
                  </div>
                </div>

                {/* Reduced Text Size */}
                <p className="text-zinc-300 text-base md:text-lg leading-[1.6] mb-12 font-bold uppercase tracking-tight italic relative z-10 group-hover:text-white transition-colors">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4 pt-8 border-t border-white/[0.08] mt-auto relative z-10 group-hover:border-cyan-500/30 transition-all">
                  {/* Smaller Logo Container */}
                  <div className="w-14 h-14 rounded-[1.5rem] overflow-hidden border-2 border-white/10 shrink-0 bg-zinc-950 group-hover:border-cyan-500/60 transition-all p-1">
                    <ImageWithFallback src={t.logo} alt={t.name} className="w-full h-full object-cover rounded-[1.2rem]" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-white uppercase tracking-widest leading-none mb-1.5 group-hover:text-cyan-400 transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] group-hover:text-zinc-300 transition-colors">
                      {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Bar Indicators */}
        <div className="flex justify-center items-center gap-2 mt-16">
          {testimonials.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setStartIndex(i)}
              className={`h-1 rounded-full transition-all duration-700 ${i === startIndex ? 'w-16 bg-cyan-500 shadow-[0_0_15px_#06b6d4]' : 'w-3 bg-zinc-800 hover:bg-zinc-700'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
