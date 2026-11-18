import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  ShoppingCart, 
  Layout, 
  Smartphone, 
  Cpu, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Star,
  Layers
} from 'lucide-react';
import { getBanners, BannerItem } from '../services/bannerService';

interface AutoScrollBannerProps {
  isLight?: boolean;
  onActionClick?: (link: string) => void;
}

export const AutoScrollBanner: React.FC<AutoScrollBannerProps> = ({
  isLight = false,
  onActionClick
}) => {
  const [banners, setBanners] = useState<BannerItem[]>(getBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Sync with live banner updates dispatched from Admin Console
  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getBanners();
      setBanners(fresh);
      if (currentIndex >= fresh.length) {
        setCurrentIndex(0);
      }
    };
    window.addEventListener('zentrixs:banners-updated', handleUpdate);
    return () => window.removeEventListener('zentrixs:banners-updated', handleUpdate);
  }, [currentIndex]);

  // Auto-scroll loop every 4.2 seconds
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused, banners.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40 && banners.length > 1) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      }
    }
  };

  if (banners.length === 0) return null;

  const current = banners[currentIndex] || banners[0];

  // Helper icons
  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('app') || lower.includes('ios') || lower.includes('android')) return Smartphone;
    if (lower.includes('e-com') || lower.includes('store') || lower.includes('shop')) return ShoppingCart;
    if (lower.includes('landing') || lower.includes('web')) return Layout;
    if (lower.includes('software') || lower.includes('erp') || lower.includes('crm')) return Cpu;
    if (lower.includes('market') || lower.includes('lead') || lower.includes('ad')) return TrendingUp;
    return Layers;
  };

  const Icon = getIcon(current.title);

  return (
    <div 
      className="relative w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer Card with Futuristic Glassmorphism, Ambient Spotlight & Border Glow */}
      <div 
        className={`relative w-full rounded-[22px] overflow-hidden border transition-all duration-700 bg-gradient-to-br ${
          current.gradient || 'from-[#0A192F] via-[#0F3260] to-[#1E4E8C]'
        } border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]`}
      >
        {/* Futuristic Cyber Light Wave Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* Ambient Top Spotlight Cone */}
        <div 
          className="absolute -top-16 -right-10 w-44 h-44 rounded-full blur-3xl opacity-50 pointer-events-none transition-all duration-700 bg-white/20"
        />

        {/* Card Content: Full-Bleed Image Banner OR Structured Text+Artwork Banner */}
        {current.isFullImage ? (
          <div 
            onClick={() => {
              if (current.link) {
                if (onActionClick) onActionClick(current.link);
                else window.location.href = current.link;
              }
            }}
            className={`relative w-full h-36 sm:h-44 md:h-48 overflow-hidden ${current.link ? 'cursor-pointer' : ''} group`}
          >
            <img 
              src={current.image} 
              alt={current.title || 'Promotional Banner'} 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle soft gradient scrim at the bottom for indicator contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Optional Small Floating Pill if link or title present */}
            {current.cta && current.link && (
              <div className="absolute bottom-3 right-3 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onActionClick) onActionClick(current.link!);
                    else window.location.href = current.link!;
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 hover:bg-black text-white text-[10px] font-bold backdrop-blur-md border border-white/20 shadow-lg active:scale-95 transition-all"
                >
                  <span>{current.cta}</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative z-10 flex flex-row items-center justify-between p-3.5 sm:p-5 gap-3 pb-6">
            {/* Left Text & Interactive CTA Area */}
            <div className="flex-1 min-w-0 space-y-1.5 pr-1">
              {/* Tag Pill with glowing Icon */}
              {current.tag && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black font-mono uppercase tracking-wider border backdrop-blur-md shadow-sm bg-white/10 text-white border-white/25">
                  <Zap className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                  <span>{current.tag}</span>
                </div>
              )}

              {/* Headline + Highlight Accent */}
              <div className="leading-tight">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight drop-shadow-sm truncate">
                  {current.title}
                </h3>
                {current.highlight && (
                  <p className="text-[11px] font-extrabold tracking-tight text-cyan-300">
                    {current.highlight}
                  </p>
                )}
              </div>

              {/* Subtitle */}
              <p className="text-[10px] text-zinc-300 line-clamp-1 leading-normal max-w-sm opacity-90">
                {current.subtitle}
              </p>

              {/* Premium Curved Pill Button with Glowing Ring */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    if (current.link) {
                      if (onActionClick) onActionClick(current.link);
                      else window.location.href = current.link;
                    }
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-black text-[11px] font-black font-sans shadow-lg hover:shadow-white/20 active:scale-95 transition-all cursor-pointer group"
                >
                  <span>{current.cta || 'Explore'}</span>
                  <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </button>
              </div>
            </div>

            {/* Right Floating 3D Artwork Cutout with Neon Ring Badge */}
            <div className="relative w-28 sm:w-36 h-24 sm:h-28 shrink-0 flex items-center justify-center">
              {/* Elevated Photo Frame with Subtle Border Glow */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/25 group">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Vignette glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>

              {/* Floating Category Icon Pill */}
              <div 
                className="absolute -bottom-1 -left-2 w-7 h-7 rounded-xl bg-black/90 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl text-white"
              >
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Cutout Notch for Slide Dots (Sleek Apple style indicator) */}
        {banners.length > 1 && (
          <div className="absolute bottom-0 inset-x-0 flex justify-center pointer-events-none">
            <div className={`px-2.5 py-0.5 rounded-t-xl flex items-center gap-1.5 backdrop-blur-md border-t border-x shadow-sm ${
              isLight 
                ? 'bg-[#FFFCF8] border-[#EDE2D3]' 
                : 'bg-[#060A14] border-white/10'
            }`}>
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`transition-all duration-300 pointer-events-auto cursor-pointer ${
                    currentIndex === i 
                      ? 'w-4 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' 
                      : 'w-1 h-1 rounded-full bg-zinc-400/40 hover:bg-zinc-300'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoScrollBanner;
