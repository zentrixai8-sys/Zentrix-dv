
import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Loader2, Zap } from 'lucide-react';
import { fetchBannersFromSheet } from '../services/sheetService';

const OffersSection: React.FC = () => {
  const [banners, setBanners] = useState<{imageUrl: string, title: string, link: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      const data = await fetchBannersFromSheet();
      setBanners(data);
      setLoading(false);
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (loading) return null;
  if (banners.length === 0) return null;

  return (
    <section className="py-20 bg-[#020202] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8 reveal reveal-up">
           <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Tactical Intelligence Brief</span>
        </div>

        <div className="relative group reveal reveal-scale">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative aspect-[21/9] md:aspect-[21/7] rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 shadow-3xl">
            {banners.map((banner, idx) => (
              <a 
                key={idx}
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
              >
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="w-full h-full object-cover"
                  onLoad={(e) => (e.target as HTMLImageElement).classList.add('loaded')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                  <div className="max-w-lg">
                    <span className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest rounded-sm mb-4 inline-block">Flash Offer</span>
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{banner.title}</h3>
                  </div>
                </div>
              </a>
            ))}

            {/* Controls */}
            {banners.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-600 hover:border-amber-500"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setCurrentIndex(prev => (prev + 1) % banners.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-600 hover:border-amber-500"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Pagination */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
