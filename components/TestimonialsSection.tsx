
import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Loader2, Globe, Activity, User, Building2 } from 'lucide-react';
import { fetchTestimonialsFromSheet } from '../services/sheetService';

const ClientLogoSlot = ({ src, name }: { src: string | null, name: string }) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-44 h-24 md:w-60 md:h-32 bg-[#080808] rounded-[2rem] p-6 flex items-center justify-center border border-white/5 border-t-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-110 hover:-translate-y-2 hover:shadow-cyan-500/20 group relative overflow-hidden">
      {/* 3D Depth Highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>

      {/* Visibility Glow */}
      <div className="absolute w-28 h-28 bg-white/[0.04] blur-2xl rounded-full pointer-events-none group-hover:bg-cyan-500/[0.06] transition-colors"></div>

      {isLoading && !error && src && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
        </div>
      )}

      {src && !error ? (
        <img
          src={src}
          alt={name}
          className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] ${isLoading ? 'opacity-0' : 'opacity-100 loaded'}`}
          onLoad={(e) => {
            setIsLoading(false);
            (e.target as HTMLImageElement).classList.add('loaded');
          }}
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
          <Building2 className="w-8 h-8 text-zinc-500" />
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">{name || 'PARTNER'}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors pointer-events-none"></div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sheetData = await fetchTestimonialsFromSheet();
        if (sheetData && Array.isArray(sheetData) && sheetData.length > 0) {
          setTestimonials(sheetData);
        }
      } catch (err) {
        console.error("Testimonial sync failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const next = () => {
    if (testimonials.length === 0) return;
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    if (testimonials.length === 0) return;
    setStartIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    const visible = [];
    const count = Math.min(testimonials.length, 3);
    for (let i = 0; i < count; i++) {
      visible.push(testimonials[(startIndex + i) % testimonials.length]);
    }
    return visible;
  };

  const marqueeItems = testimonials.length > 0
    ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
    : [];

  return (
    <section id="why" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {testimonials.length > 0 && (
          <div className="mb-32 reveal reveal-up">
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <Globe className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Verified Enterprise Partners</span>
              </div>
              <h3 className="text-3xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">
                OUR STRATEGIC <span className="text-cyan-500">CLIENTS.</span>
              </h3>
              <div className="w-20 h-1 bg-cyan-500/20 rounded-full"></div>
            </div>

            <div className="relative overflow-hidden group/marquee py-6">
              <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-black via-black/60 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-black via-black/60 to-transparent z-20 pointer-events-none"></div>

              <div className="animate-marquee flex items-center gap-14">
                {marqueeItems.map((t, i) => (
                  <div key={i} className="shrink-0 group">
                    <ClientLogoSlot src={t.logo} name={t.company || t.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK CARDS */}
        <div className="text-center mb-14 reveal reveal-up">
          <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight italic uppercase leading-none">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Feedback</span>
          </h2>

          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-5 mt-10">
              <button
                onClick={prev}
                className="w-14 h-14 rounded-full border border-zinc-800 bg-transparent hover:border-cyan-500/50 hover:bg-white/5 transition-all text-zinc-500 hover:text-white flex items-center justify-center group"
              >
                <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={next}
                className="w-14 h-14 rounded-full border border-cyan-500/50 bg-transparent hover:bg-cyan-500/10 transition-all text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)] group"
              >
                <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.4em]">Syncing Feed Nodes...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center gap-4 text-center">
            <Activity className="w-10 h-10 text-zinc-800 mb-4" />
            <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em]">Awaiting Data Input from Sheet Admin...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
            {getVisibleTestimonials().map((t, i) => (
              <div
                key={`${startIndex}-${i}`}
                className="bg-[#0D0D0F] border border-white/5 p-10 md:p-12 rounded-[2.5rem] flex flex-col h-full transition-all duration-700 hover:bg-[#121214] hover:border-cyan-500/20 group animate-fade-in relative shadow-2xl hover:-translate-y-3"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <div className="text-[#3a3a40]">
                    <Quote className="w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity" />
                  </div>
                </div>

                <p className="text-zinc-300 text-[15px] leading-relaxed mb-12 font-medium italic opacity-90 group-hover:opacity-100 transition-opacity">
                  "{t.text}"
                </p>

                {/* Footer Section */}
                <div className="flex items-center gap-5 mt-auto pt-10 border-t border-white/5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-white/5 shrink-0 bg-[#080808] shadow-[0_5px_25px_rgba(0,0,0,0.8)] flex items-center justify-center p-3.5 transition-all duration-500 group-hover:scale-110 relative group-hover:border-cyan-500/40">
                    <div className="absolute inset-0 bg-white/[0.04] rounded-full pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/[0.05] to-transparent pointer-events-none"></div>

                    {t.logo ? (
                      <img
                        src={t.logo}
                        alt={t.company}
                        className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)] transition-opacity duration-300"
                        onLoad={(e) => (e.target as HTMLImageElement).classList.add('loaded')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6 text-zinc-600 relative z-10" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-[15px] font-black text-white truncate tracking-tight uppercase italic group-hover:text-cyan-400 transition-colors">{t.name}</h4>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] truncate mt-1.5">
                      {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-20">
          <Activity className="w-3 h-3 text-cyan-500/40 animate-pulse" />
          <span className="mono text-[8px] text-zinc-800 font-bold uppercase tracking-[0.4em]">SYNC_STATUS: {testimonials.length > 0 ? 'ACTIVE_STABLE' : 'IDLE_WAITING'}</span>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
