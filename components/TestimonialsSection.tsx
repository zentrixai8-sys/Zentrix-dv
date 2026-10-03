import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Loader2, Globe, Activity, User, Building2, Sparkles } from 'lucide-react';
import { fetchTestimonialsFromSheet, DEFAULT_TESTIMONIALS } from '../services/sheetService';
import DotGridBackground from './DotGridBackground';

export const ClientLogoSlot = ({ src, name }: { src: string | null; name: string }) => {
  const [error, setError] = useState(false);

  return (
    <div className="w-44 h-24 md:w-60 md:h-32 bg-[#080808] rounded-[2rem] p-6 flex items-center justify-center border border-white/5 border-t-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-110 hover:-translate-y-2 hover:shadow-cyan-500/20 group relative overflow-hidden">
      {/* 3D Depth Highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>

      {/* Visibility Glow */}
      <div className="absolute w-28 h-28 bg-white/[0.04] blur-2xl rounded-full pointer-events-none group-hover:bg-cyan-500/[0.06] transition-colors"></div>

      {src && !error ? (
        <img
          src={src}
          alt={name}
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-60 transition-opacity">
          <Building2 className="w-8 h-8 text-zinc-400" />
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{name || 'PARTNER'}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors pointer-events-none"></div>
    </div>
  );
};

// 1. Standalone Client Logos Marquee Section (Positioned 2nd on Landing Page)
export const ClientLogosSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sheetData = await fetchTestimonialsFromSheet();
        if (sheetData && Array.isArray(sheetData) && sheetData.length > 0) {
          setTestimonials(sheetData);
        }
      } catch (err) {
        console.error("Client logos sync error:", err);
      }
    };
    loadData();
  }, []);

  const marqueeItems = testimonials.length > 0
    ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
    : [];

  return (
    <section id="clients" className="py-20 bg-black relative overflow-hidden border-b border-white/[0.06]">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.06),transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-12 text-center reveal reveal-up active">
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 shadow-lg">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Verified Enterprise Partners</span>
          </div>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">
            OUR STRATEGIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">CLIENTS.</span>
          </h3>
          <div className="w-20 h-1 bg-cyan-500/30 rounded-full"></div>
        </div>

        <div className="relative overflow-hidden group/marquee py-6">
          <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none"></div>

          <div className="animate-marquee flex items-center gap-14">
            {marqueeItems.map((t, i) => (
              <div key={i} className="shrink-0 group">
                <ClientLogoSlot src={t.logo} name={t.company || t.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// 2. Standalone Client Feedback Section (Positioned Second-Last on Landing Page)
export const ClientFeedbackSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(false);

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

  return (
    <section id="feedback" className="py-28 bg-[#030508] relative overflow-hidden border-t border-white/[0.06]">
      {/* Interactive Framer Dot Grid 3D Orbit Canvas Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
        <DotGridBackground
          dotColor="#06b6d4"
          dotSize={2.5}
          dotSpacing={26}
          orbitSpeed={1.5}
          impactRadius={150}
          scaleOnHover={2.2}
          enableRevolve={true}
        />
      </div>

      {/* Ambient Gradient Lighting */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#030508]/40 via-transparent to-[#030508]/90 pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header Controls */}
        <div className="text-center mb-16 reveal reveal-up active">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <Quote className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Client Endorsements</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight italic uppercase leading-none">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">Feedback</span>
          </h2>

          <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto font-medium mb-8">
            Real feedback from enterprise leaders &amp; business owners using Zentrixs automation systems.
          </p>

          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-5 mt-6">
              <button
                onClick={prev}
                aria-label="Previous Testimonial"
                className="w-13 h-13 rounded-full border border-zinc-800 bg-black/50 hover:border-cyan-500/50 hover:bg-white/5 transition-all text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer group shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={next}
                aria-label="Next Testimonial"
                className="w-13 h-13 rounded-full border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] cursor-pointer group"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="h-[350px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Loading Reviews...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="h-[250px] flex flex-col items-center justify-center gap-4 text-center">
            <Activity className="w-10 h-10 text-zinc-800 mb-4" />
            <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em]">Awaiting feedback entries...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal active">
            {getVisibleTestimonials().map((t, i) => (
              <div
                key={`${startIndex}-${i}`}
                className="bg-[#0b0e14] border border-white/[0.08] p-8 md:p-10 rounded-[2.5rem] flex flex-col h-full transition-all duration-700 hover:bg-[#0f131c] hover:border-cyan-500/30 group animate-fade-in relative shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:-translate-y-2.5"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]" />
                    ))}
                  </div>
                  <div className="text-cyan-500/30 group-hover:text-cyan-400/60 transition-colors">
                    <Quote className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <p className="text-zinc-300 text-[15px] leading-relaxed mb-10 font-medium italic opacity-95 group-hover:opacity-100 transition-opacity">
                  "{t.text}"
                </p>

                {/* Footer Section */}
                <div className="flex items-center gap-4 mt-auto pt-8 border-t border-white/[0.06]">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-[#080808] shadow-lg flex items-center justify-center p-2.5 transition-all duration-500 group-hover:scale-105 relative group-hover:border-cyan-500/40">
                    <div className="absolute inset-0 bg-white/[0.04] rounded-2xl pointer-events-none"></div>

                    {t.logo ? (
                      <img
                        src={t.logo}
                        alt={t.company}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6 text-zinc-500 relative z-10" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-[15px] font-black text-white truncate tracking-tight uppercase italic group-hover:text-cyan-400 transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] truncate mt-1">
                      {t.company || t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-3 mt-16">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="mono text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
            VERIFIED RATINGS &bull; 5.0 STAR AVERAGE
          </span>
        </div>
      </div>
    </section>
  );
};

// Default Combined Component (Backward Compatibility)
const TestimonialsSection: React.FC = () => {
  return (
    <>
      <ClientLogosSection />
      <ClientFeedbackSection />
    </>
  );
};

export default TestimonialsSection;
