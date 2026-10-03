import React, { useRef, useEffect, useState } from 'react';
import { Play, Sparkles, ArrowRight, Zap, Volume2, VolumeX } from 'lucide-react';

interface ScrollZoomRevealProps {
  leftText?: string;
  rightText?: string;
  buttonText?: string;
  videoUrl?: string;
  imageSrc?: string;
  onExplore?: () => void;
}

export const ScrollZoomReveal: React.FC<ScrollZoomRevealProps> = ({
  leftText = "©2026 ZERO FRICTION",
  rightText = "AUTONOMOUS SYSTEM",
  buttonText = "INITIALIZE AUTOPILOT",
  videoUrl = "https://framerusercontent.com/assets/eyVMUuEcpvbKYJwPqZANvybTfI.mp4",
  imageSrc = "/images/ai-software-website-and-app-development.webp",
  onExplore
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [screenSize, setScreenSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setScreenSize('mobile');
      else if (window.innerWidth < 1200) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      
      rafId = requestAnimationFrame(() => {
        setProgress(rawProgress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Compute responsive dimensions based on scroll progress [0 -> 1]
  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';

  const startWidthVw = isMobile ? 22 : isTablet ? 18 : 14;
  const startHeightVh = isMobile ? 7 : isTablet ? 6.5 : 5.5;

  const currentWidth = startWidthVw + (100 - startWidthVw) * progress;
  const currentHeight = startHeightVh + (100 - startHeightVh) * progress;
  const currentRadius = Math.max(0, 48 * (1 - progress * 1.3));
  const centerTextOpacity = Math.max(0, Math.min(1, (progress - 0.35) * 3));
  const centerTextY = Math.max(0, (1 - Math.min(1, (progress - 0.35) * 3)) * 40);

  const sideTextOpacity = Math.max(0, 1 - progress * 2.5);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExplore) {
      onExplore();
      return;
    }
    setIsPlaying(prev => {
      const next = !prev;
      if (videoRef.current) {
        if (next) videoRef.current.play();
        else videoRef.current.pause();
      }
      return next;
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#050608] select-none"
      style={{ height: '320vh' }}
    >
      {/* Sticky Fullscreen Frame */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 md:px-8">
        
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-black to-black opacity-80" />

        {/* Left Side Typographic Label */}
        <div 
          className="hidden sm:block text-right font-mono font-bold tracking-widest text-zinc-500 uppercase transition-opacity duration-300 shrink-0"
          style={{
            opacity: sideTextOpacity,
            width: isTablet ? '140px' : '220px',
            fontSize: isTablet ? '18px' : '26px'
          }}
        >
          <div className="flex items-center justify-end gap-2 text-cyan-400/80 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] tracking-[0.3em] font-sans font-black">LEGACY SYSTEM</span>
          </div>
          <span className="text-zinc-300">{leftText}</span>
        </div>

        {/* Center Expanding Reveal Container */}
        <div
          className="relative mx-3 md:mx-6 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-cyan-500/30 transition-[border-radius] duration-75"
          style={{
            width: `${currentWidth}vw`,
            height: `${currentHeight}vh`,
            borderRadius: `${currentRadius}px`,
            background: '#04060a'
          }}
        >
          {/* Background Image / Texture */}
          <img
            src={imageSrc}
            alt="Zentrixs Autonomous Systems Showreel"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-0' : 'opacity-85'}`}
            style={{ minWidth: '100vw', minHeight: '100vh', transform: 'scale(1.05)' }}
          />

          {/* Futuristic Grid & Gradient Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.4) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

          {/* Video Player */}
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              loop
              muted={isMuted}
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />
          )}

          {/* Sound Toggle when playing */}
          {isPlaying && (
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="absolute top-8 right-8 z-30 p-3 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md hover:scale-110 transition-transform shadow-2xl"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-zinc-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
            </button>
          )}

          {/* Center Call to Action Trigger (Reveals smoothly on scroll zoom) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-auto"
            style={{
              opacity: centerTextOpacity,
              transform: `translateY(${centerTextY}px)`
            }}
          >
            {/* Top Subtitle badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Zentrixs Enterprise Architecture</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tight max-w-3xl mb-4 leading-tight">
              Eliminate Manual Friction. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Run On Autopilot.
              </span>
            </h2>

            <p className="text-zinc-300 text-xs sm:text-sm md:text-base max-w-xl font-light mb-8 line-clamp-2 sm:line-clamp-none">
              Stop losing leads, wasting payroll on manual data entry, and waiting hours for reports. Scale seamlessly with AI agents.
            </p>

            {/* Action Trigger Button */}
            <button
              onClick={handlePlayClick}
              className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:shadow-[0_0_60px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black flex items-center justify-center text-cyan-400 group-hover:rotate-12 transition-transform">
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-cyan-400 text-cyan-400 ml-0.5" />
              </div>
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Bottom Progress Bar */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Right Side Typographic Label */}
        <div 
          className="hidden sm:block text-left font-mono font-bold tracking-widest text-zinc-500 uppercase transition-opacity duration-300 shrink-0"
          style={{
            opacity: sideTextOpacity,
            width: isTablet ? '140px' : '220px',
            fontSize: isTablet ? '18px' : '26px'
          }}
        >
          <div className="flex items-center justify-start gap-2 text-blue-400/80 mb-1">
            <span className="text-[10px] tracking-[0.3em] font-sans font-black">THE REVELATION</span>
            <Sparkles className="w-3 h-3 text-cyan-400" />
          </div>
          <span className="text-zinc-300">{rightText}</span>
        </div>

      </div>
    </section>
  );
};

export default ScrollZoomReveal;
