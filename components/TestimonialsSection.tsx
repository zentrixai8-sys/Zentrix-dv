
import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Loader2, Globe, Activity } from 'lucide-react';
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from '../constants';
import { fetchTestimonialsFromSheet } from '../services/sheetService';

const ImageWithFallback = ({ src, alt, className }: { src: string | null, alt: string, className: string }) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const initial = alt ? alt.charAt(0).toUpperCase() : 'Z';

  // Return a typographic fallback if image is missing or errors
  if (error || !src) {
    return (
      <div className={`${className} bg-zinc-50 flex flex-col items-center justify-center border border-zinc-100`}>
        <span className="text-blue-600 font-black text-2xl italic tracking-tighter leading-none">{initial}</span>
        <span className="text-[6px] text-zinc-400 font-black uppercase tracking-[0.4em] mt-2 opacity-60">NODE_AUTH</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden bg-white flex items-center justify-center`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 z-10">
          <Loader2 className="w-5 h-5 text-zinc-300 animate-spin" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className="max-w-[85%] max-h-[85%] w-auto h-auto transition-opacity duration-700 object-contain"
        style={{ opacity: isLoading ? 0 : 1 }}
        onError={() => setError(true)}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const sheetData = await fetchTestimonialsFromSheet();
      if (sheetData && sheetData.length > 0) {
        setTestimonials(sheetData);
      }
      setLoading(false);
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
    const visible = [];
    if (testimonials.length === 0) return [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(startIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section id="why" className="py-32 bg-[#020202] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* PREMIUM CLIENT LOGO MARQUEE */}
        <div className="mb-48 reveal">
          <div className="flex flex-col items-center mb-16 text-center px-4">
             <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] mb-6">
                <Globe className="w-3 h-3 text-cyan-500" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.5em]">Global Enterprise Network</span>
             </div>
             <p className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.3em] mb-4 italic">Strategic Business Alliance</p>
             <div className="w-12 h-px bg-cyan-500/30"></div>
          </div>

          <div className="relative overflow-hidden group">
            {/* Fade Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#020202] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#020202] to-transparent z-10"></div>
            
            <div className="animate-marquee flex items-center gap-16 md:gap-24 py-12">
              {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group/logo">
                  <div className="w-36 h-20 md:w-48 md:h-24 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_40px_-15px_rgba(255,255,255,0.1)] transition-all hover:scale-105 duration-500 border border-white/10 overflow-hidden">
                    <ImageWithFallback src={t.logo} alt={t.company} className="w-full h-full" />
                  </div>
                  <span className="text-[10px] text-zinc-600 group-hover/logo:text-cyan-500 transition-colors font-black uppercase tracking-[0.3em] opacity-40 group-hover/logo:opacity-100">
                    {t.company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="text-center mb-24 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-cyan-500/5 border border-cyan-500/10 mb-8">
             <Activity className="w-3 h-3 text-cyan-500" />
             <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Client Success Matrix</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">
            Node <span className="text-cyan-500">Verification.</span>
          </h2>
          <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-wider px-4">
            Encrypted reports from our global <span className="text-white">partnership network</span>.
          </p>
          
          <div className="flex justify-center items-center gap-6 mt-12">
            <button 
              onClick={prev} 
              className="w-14 h-14 rounded-full border border-white/5 bg-white/[0.01] hover:bg-cyan-600/10 hover:border-cyan-500/30 transition-all text-zinc-600 hover:text-white flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={next} 
              className="w-14 h-14 rounded-full border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-600 hover:border-cyan-500 transition-all text-cyan-500 hover:text-white flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin opacity-40" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
            {getVisibleTestimonials().map((t, i) => (
              <div 
                key={`${startIndex}-${i}`} 
                className="bg-[#050505] border border-white/5 p-10 md:p-12 rounded-3xl flex flex-col h-full transition-all duration-500 hover:border-cyan-500/30 group animate-fade-in relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/5 group-hover:border-cyan-500/40 transition-colors"></div>

                <div className="flex justify-between items-start mb-14">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-3 h-3 fill-cyan-500/40 text-cyan-500/40" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-zinc-800 rotate-180 group-hover:text-cyan-500/20 transition-colors" />
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-14 font-medium uppercase tracking-tight italic">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-5 pt-10 border-t border-white/5 mt-auto">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-white shadow-xl flex items-center justify-center">
                    <ImageWithFallback src={t.logo} alt={t.name} className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest leading-none mb-2">{t.name}</h4>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                      {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-3 mt-20">
          {testimonials.slice(0, 8).map((_, i) => (
            <button 
              key={i} 
              onClick={() => setStartIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === startIndex ? 'w-12 bg-cyan-600' : 'w-3 bg-white/5 hover:bg-white/10'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
