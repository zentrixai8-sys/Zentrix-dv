
import React, { useEffect, useRef } from 'react';
import { Target, Eye, Cpu } from 'lucide-react';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4';
const POSTER_SRC = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp';

const MissionVision: React.FC = () => {
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vidA = videoRefA.current;
    const vidB = videoRefB.current;
    if (!vidA || !vidB) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      vidA.removeAttribute('autoplay');
      vidA.pause();
      vidB.pause();
      try {
        vidA.currentTime = 0;
      } catch {}
      return;
    }

    const FADE = 0.9;
    let cur = vidA;
    let nxt = vidB;
    let swapping = false;

    const play = (v: HTMLVideoElement) => {
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    };

    play(vidA);

    const tick = () => {
      if (swapping || !cur.duration) return;
      if (cur.duration - cur.currentTime > FADE) return;

      swapping = true;
      const out = cur;
      nxt.currentTime = 0;
      play(nxt);
      nxt.classList.add('opacity-100');
      nxt.classList.remove('opacity-0');
      out.classList.remove('opacity-100');
      out.classList.add('opacity-0');

      // Swap active video handles
      const temp = cur;
      cur = nxt;
      nxt = temp;

      setTimeout(() => {
        out.pause();
        out.currentTime = 0;
        swapping = false;
      }, FADE * 1000 + 100);
    };

    vidA.addEventListener('timeupdate', tick);
    vidB.addEventListener('timeupdate', tick);

    return () => {
      vidA.removeEventListener('timeupdate', tick);
      vidB.removeEventListener('timeupdate', tick);
    };
  }, []);

  return (
    <section id="directives" className="py-32 bg-black relative overflow-hidden">
      {/* Seamless Dual-Video Looping Earth Background */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        role="img"
        aria-label="Stylised globe of Earth rendered as a purple dot matrix against a starfield, slowly rotating"
      >
        <video
          ref={videoRefA}
          className="absolute inset-0 w-full h-full object-cover object-[51%_8%] transition-opacity duration-1000 ease-linear opacity-100"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          poster={POSTER_SRC}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        <video
          ref={videoRefB}
          className="absolute inset-0 w-full h-full object-cover object-[51%_8%] transition-opacity duration-1000 ease-linear opacity-0"
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          poster={POSTER_SRC}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        {/* Ambient Dark Backdrop Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),rgba(0,0,0,0.85))]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-24 reveal reveal-up">
          <div className="flex items-center gap-3 px-4 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 mb-6 backdrop-blur-md">
            <Cpu className="w-3 h-3 text-blue-500" />
            <span className="mono text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Our Goals</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic text-center">
            Mission <span className="text-zinc-700">&</span> Vision.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission Node: Slide from Left */}
          <div className="reveal reveal-left group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur transition-opacity"></div>
            <div className="relative h-full bg-[#080808]/85 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 overflow-hidden shadow-2xl">
              <div className="bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border border-blue-500/20 shadow-xl shadow-blue-500/5">
                <Target className="w-8 h-8 text-blue-500" />
              </div>

              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight italic">Our Mission</h3>
              <p className="text-zinc-400 text-lg leading-relaxed font-medium uppercase tracking-tight mb-8">
                To build <span className="text-white">smart systems</span> that help businesses in Raipur grow faster. We fix manual problems with smart software.
              </p>
            </div>
          </div>

          {/* Vision Node: Slide from Right */}
          <div className="reveal reveal-right stagger-1 group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur transition-opacity"></div>
            <div className="relative h-full bg-[#080808]/85 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 overflow-hidden shadow-2xl">
              <div className="bg-purple-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border border-purple-500/20 shadow-xl shadow-purple-500/5">
                <Eye className="w-8 h-8 text-purple-500" />
              </div>

              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight italic">Our Vision</h3>
              <p className="text-zinc-400 text-lg leading-relaxed font-medium uppercase tracking-tight mb-8">
                To become the <span className="text-white">simplest way</span> for any business to upgrade their technology and work 10x faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
