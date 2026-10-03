import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpRight, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface ArcProduct {
  id: string;
  badge: string;
  categoryColor: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
}

export const ARC_PRODUCTS: ArcProduct[] = [
  {
    id: 'crm',
    badge: 'SALES & CRM',
    categoryColor: 'text-cyan-400 border-cyan-500/30',
    title: 'Custom CRM & Lead Intelligence',
    slug: 'crm-lead-management',
    tagline: 'Zero lead leakage with automated pipeline tracking.',
    description: 'Capture, score, and qualify inbound leads across WhatsApp, Meta ads, and web forms with automated follow-ups and real-time alerts.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'inventory',
    badge: 'OPERATIONS',
    categoryColor: 'text-amber-400 border-amber-500/30',
    title: 'Smart Inventory & Billing Control',
    slug: 'billing-inventory-software',
    tagline: 'Multi-warehouse stock sync & automated invoicing.',
    description: 'Real-time stock tracking, low-stock reorder triggers, automated GST bills, and instant WhatsApp payment reminders.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ai-agent',
    badge: 'INTELLIGENCE',
    categoryColor: 'text-purple-400 border-purple-500/30',
    title: 'Autonomous AI Agents & Voice Bots',
    slug: 'ai-business-chatbot',
    tagline: 'Human-like conversational AI that sells & supports 24/7.',
    description: 'Bilingual AI trained on your catalog and pricing to answer queries, qualify prospects, and book appointments in Hindi and English.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'website-design',
    badge: 'WEBCRAFT',
    categoryColor: 'text-emerald-400 border-emerald-500/30',
    title: 'Website Design & Custom Software',
    slug: 'website-and-software-development',
    tagline: 'Ultra-fast, high-converting digital web platforms.',
    description: 'Bespoke corporate websites, web applications, and customer portals engineered for maximum speed, SEO domination, and conversion.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bulk-whatsapp',
    badge: 'MARKETING',
    categoryColor: 'text-green-400 border-green-500/30',
    title: 'Bulk WhatsApp Cloud Automation',
    slug: 'whatsapp-automation',
    tagline: 'Official Meta WhatsApp Business Cloud API solutions.',
    description: 'High-speed verified broadcast campaigns, interactive catalog buttons, automated order confirmations, and multi-agent chat support desks.',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mobile-app',
    badge: 'MOBILITY',
    categoryColor: 'text-blue-400 border-blue-500/30',
    title: 'iOS & Android Mobile App Development',
    slug: 'website-and-software-development',
    tagline: 'Native performance mobile apps for customers & field teams.',
    description: 'Intuitive, scalable mobile apps with push notifications, offline syncing, and frictionless payment checkout built on Flutter and React Native.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'
  }
];

export const ArcFocusCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const lastScrollTime = useRef(0);
  const navigate = useNavigate();

  const total = ARC_PRODUCTS.length;

  const nextSlide = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  // Wheel scroll with throttle so 1 scroll tick = 1 smooth card step
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 260) return;
    
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 20) {
        nextSlide();
        lastScrollTime.current = now;
      } else if (e.deltaX < -20) {
        prevSlide();
        lastScrollTime.current = now;
      }
    } else if (Math.abs(e.deltaY) > 25) {
      if (e.deltaY > 0) {
        nextSlide();
        lastScrollTime.current = now;
      } else {
        prevSlide();
        lastScrollTime.current = now;
      }
    }
  };

  // Drag / Swipe Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPointerDown(true);
    setStartX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    setIsPointerDown(false);
    const diff = e.clientX - startX;
    if (diff > 45) prevSlide();
    else if (diff < -45) nextSlide();
  };

  return (
    <div 
      className="relative w-full py-8 select-none overflow-hidden"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* 3D Arc Stage Viewport */}
      <div 
        className="relative w-full h-[520px] sm:h-[560px] md:h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1100px' }}
      >
        {ARC_PRODUCTS.map((product, index) => {
          // Calculate wrapped circular distance from activeIndex
          let diff = index - activeIndex;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          const isCenter = diff === 0;
          const absDiff = Math.abs(diff);

          // Only render visible arc items within range 2
          const isVisible = absDiff <= 2;
          if (!isVisible) return null;

          // Responsive Arc Layout Math
          const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
          const translateX = diff * (isMobile ? 220 : 330);
          const translateZ = -absDiff * 150;
          const rotateY = diff * -22;
          const scale = 1 - Math.min(absDiff * 0.12, 0.28);
          const opacity = isCenter ? 1 : Math.max(0.25, 0.65 - absDiff * 0.22);
          const zIndex = 20 - absDiff;

          return (
            <div
              key={product.id}
              onClick={(e) => {
                if (!isCenter) {
                  e.stopPropagation();
                  setActiveIndex(index);
                } else {
                  navigate(`/services/${product.slug}`);
                }
              }}
              className={`absolute top-0 w-[290px] sm:w-[350px] md:w-[410px] h-[480px] sm:h-[520px] md:h-[560px] rounded-[2.5rem] p-6 sm:p-7 md:p-8 cursor-pointer transition-all duration-700 ease-out flex flex-col justify-between overflow-hidden group ${
                isCenter 
                  ? 'border-2 border-cyan-400 shadow-[0_20px_60px_rgba(6,182,212,0.3)] bg-gradient-to-b from-[#111724] via-[#090d14] to-[#040609]' 
                  : 'border border-white/10 shadow-2xl bg-zinc-900/85 backdrop-blur-xl hover:border-white/30'
              }`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity'
              }}
            >
              {/* Card Image Banner */}
              <div className="relative w-full h-44 sm:h-48 md:h-52 rounded-2xl overflow-hidden mb-5 shrink-0 bg-zinc-950 border border-white/10">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d14] via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border ${product.categoryColor} text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-lg`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{product.badge}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm line-clamp-3 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider group-hover:underline flex items-center gap-1">
                    <span>{isCenter ? 'Explore Architecture' : 'Click to Focus'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400 transition-all">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arc Carousel Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous service"
          className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-2">
          {ARC_PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to item ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                i === activeIndex 
                  ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]' 
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next service"
          className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ArcFocusCarousel;
