import React, { useEffect, useRef, useState } from 'react';
import { Cpu } from 'lucide-react';
import type { IconType } from 'react-icons';
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiPython, SiExpress, SiFastapi,
  SiMongodb, SiPostgresql, SiFirebase, SiSupabase,
  SiDocker, SiVercel, SiCloudflare,
  SiWhatsapp, SiRazorpay, SiStripe, SiGooglesheets,
  SiGooglegemini, SiLangchain, SiZapier,
} from 'react-icons/si';
import { TbBrandAws, TbBrandOpenai } from 'react-icons/tb';

interface TechItem {
  name: string;
  icon: IconType;
  color: string;
  category: string;
}

// Icons rendered as bundled SVG components (no external network fetch, so they
// always render regardless of firewalls / ad-blockers / offline previews).
const NEEDS_LIGHT_FILL = new Set(['Express', 'Next.js', 'Vercel', 'OpenAI', 'AWS']);

// Flat list of all tools, grouped by the 6 wheel categories (4 tools each)
const TECH_TOOLS: TechItem[] = [
  // Frontend
  { name: 'React', category: 'Frontend', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', category: 'Frontend', icon: SiNextdotjs, color: '#ffffff' },
  { name: 'TypeScript', category: 'Frontend', icon: SiTypescript, color: '#3178C6' },
  { name: 'Tailwind', category: 'Frontend', icon: SiTailwindcss, color: '#06B6D4' },
  // Backend
  { name: 'Node.js', category: 'Backend', icon: SiNodedotjs, color: '#339933' },
  { name: 'Python', category: 'Backend', icon: SiPython, color: '#3776AB' },
  { name: 'Express', category: 'Backend', icon: SiExpress, color: '#ffffff' },
  { name: 'FastAPI', category: 'Backend', icon: SiFastapi, color: '#009688' },
  // Database
  { name: 'MongoDB', category: 'Database', icon: SiMongodb, color: '#47A248' },
  { name: 'PostgreSQL', category: 'Database', icon: SiPostgresql, color: '#4169E1' },
  { name: 'Firebase', category: 'Database', icon: SiFirebase, color: '#FFCA28' },
  { name: 'Supabase', category: 'Database', icon: SiSupabase, color: '#3ECF8E' },
  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud & DevOps', icon: TbBrandAws, color: '#FF9900' },
  { name: 'Docker', category: 'Cloud & DevOps', icon: SiDocker, color: '#2496ED' },
  { name: 'Vercel', category: 'Cloud & DevOps', icon: SiVercel, color: '#ffffff' },
  { name: 'Cloudflare', category: 'Cloud & DevOps', icon: SiCloudflare, color: '#F38020' },
  // Integrations
  { name: 'WhatsApp API', category: 'Integrations', icon: SiWhatsapp, color: '#25D366' },
  { name: 'Razorpay', category: 'Integrations', icon: SiRazorpay, color: '#3395FF' },
  { name: 'Stripe', category: 'Integrations', icon: SiStripe, color: '#635BFF' },
  { name: 'Google Sheets', category: 'Integrations', icon: SiGooglesheets, color: '#0F9D58' },
  // AI & Automation
  { name: 'OpenAI', category: 'AI & Automation', icon: TbBrandOpenai, color: '#ffffff' },
  { name: 'Google AI', category: 'AI & Automation', icon: SiGooglegemini, color: '#4285F4' },
  { name: 'LangChain', category: 'AI & Automation', icon: SiLangchain, color: '#1C3C3C' },
  { name: 'Zapier', category: 'AI & Automation', icon: SiZapier, color: '#FF4A00' },
];

// Distribute into roughly equal tracks (mobile fallback marquee)
const TRACK_1 = TECH_TOOLS.slice(0, 8);
const TRACK_2 = TECH_TOOLS.slice(8, 16);
const TRACK_3 = TECH_TOOLS.slice(16, 24);

const TechCard: React.FC<{ tech: TechItem }> = ({ tech }) => {
  return (
    <div className="flex-shrink-0 group cursor-pointer">
      <div
        className="flex items-center gap-4 px-6 py-4 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-white/[0.08] hover:scale-105 hover:border-white/20"
        style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 0 16px ${tech.color}08` }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center bg-black/50 border border-white/5 shadow-inner"
          style={{ boxShadow: `inset 0 0 10px ${tech.color}20` }}
        >
          <tech.icon
            size="1.25rem"
            color={NEEDS_LIGHT_FILL.has(tech.name) ? '#ffffff' : tech.color}
            style={{ filter: `drop-shadow(0 0 8px ${tech.color}60)` }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm tracking-wide">{tech.name}</span>
          <span className="text-[10px] font-semibold tracking-widest uppercase opacity-60" style={{ color: tech.color }}>{tech.category}</span>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Radial 3D Tech Wheel (desktop / tablet)
// ---------------------------------------------------------------------------

const CATEGORY_ORDER: { name: string; color: string }[] = [
  { name: 'Frontend', color: '#3b82f6' },
  { name: 'Backend', color: '#10b981' },
  { name: 'Database', color: '#f59e0b' },
  { name: 'Cloud & DevOps', color: '#f97316' },
  { name: 'Integrations', color: '#a855f7' },
  { name: 'AI & Automation', color: '#06b6d4' },
];

const INNER_RADIUS = 28; // %
const OUTER_RADIUS = 43; // %
const LABEL_RADIUS = 48; // %
// Per-icon (0..3 within a category) angular offset from the sector's center, and which ring it sits on
const RING_OFFSETS = [-15, 15, -24, 24];
const RING_RADII = [INNER_RADIUS, INNER_RADIUS, OUTER_RADIUS, OUTER_RADIUS];

interface WheelIcon extends TechItem {
  x: number;
  y: number;
  delay: number;
  ring: number;
}

interface WheelLabel {
  name: string;
  color: string;
  x: number;
  y: number;
  rotate: number;
}

function buildWheel(): { icons: WheelIcon[]; labels: WheelLabel[] } {
  const icons: WheelIcon[] = [];
  const labels: WheelLabel[] = [];

  CATEGORY_ORDER.forEach((cat, ci) => {
    const centerAngle = ci * 60;
    const group = TECH_TOOLS.filter(t => t.category === cat.name);

    group.forEach((tool, ti) => {
      const angle = centerAngle + (RING_OFFSETS[ti] ?? 0);
      const radius = RING_RADII[ti] ?? OUTER_RADIUS;
      const rad = (angle * Math.PI) / 180;
      icons.push({
        ...tool,
        x: radius * Math.sin(rad),
        y: -radius * Math.cos(rad),
        delay: (ci * 4 + ti) * 0.12,
        ring: ti < 2 ? 0 : 1,
      });
    });

    const labRad = (centerAngle * Math.PI) / 180;
    let rotate = centerAngle;
    if (centerAngle > 90 && centerAngle < 270) rotate += 180;
    labels.push({
      name: cat.name,
      color: cat.color,
      x: LABEL_RADIUS * Math.sin(labRad),
      y: -LABEL_RADIUS * Math.cos(labRad),
      rotate,
    });
  });

  return { icons, labels };
}

const WHEEL = buildWheel();
const WHEEL_OUTER_ICONS = WHEEL.icons.filter(icon => icon.ring === 1);
const WHEEL_INNER_ICONS = WHEEL.icons.filter(icon => icon.ring === 0);
const BOUNDARY_ANGLES = CATEGORY_ORDER.map((_, i) => i * 60 + 30);
const SECTOR_BACKGROUND = `conic-gradient(from -30deg, ${CATEGORY_ORDER.map((c, i) => `${c.color}26 ${i * 60}deg ${(i + 1) * 60}deg`).join(', ')})`;

const BASE_TILT = 50;
// Outer (bigger) ring and inner (smaller) ring orbit independently, in opposite directions
const OUTER_ORBIT_DURATION = 50;
const INNER_ORBIT_DURATION = 34;

const TechOrb: React.FC<{ tech: TechItem; delay: number }> = ({ tech, delay }) => (
  <div
    className="group/orb absolute left-1/2 top-1/2 z-10 hover:z-30 flex flex-col items-center"
    style={{ transform: 'translate(-50%, -50%)' }}
  >
    <div
      className="relative flex items-center justify-center rounded-full bg-black/70 backdrop-blur-md border border-white/10 shadow-lg cursor-pointer transition-transform duration-300 group-hover/orb:scale-125 animate-float [animation-play-state:running] group-hover/orb:[animation-play-state:paused]"
      style={{
        width: 'clamp(32px, 4.6vw, 56px)',
        height: 'clamp(32px, 4.6vw, 56px)',
        boxShadow: `0 4px 18px rgba(0,0,0,0.55), inset 0 0 10px ${tech.color}30, 0 0 14px ${tech.color}25`,
        animationDuration: `${5 + (delay % 3)}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <tech.icon
        size="50%"
        color={NEEDS_LIGHT_FILL.has(tech.name) ? '#ffffff' : tech.color}
        style={{ filter: `drop-shadow(0 0 6px ${tech.color}80)` }}
      />
      <div
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 border border-white/10 px-2 py-1 text-[10px] font-bold text-white opacity-0 scale-90 transition-all duration-200 group-hover/orb:opacity-100 group-hover/orb:scale-100 z-30"
        style={{ boxShadow: `0 0 12px ${tech.color}50` }}
      >
        {tech.name}
      </div>
    </div>
    <span
      className="mt-1 text-[7px] md:text-[8.5px] font-semibold tracking-wide text-white/45 whitespace-nowrap transition-colors duration-200 group-hover/orb:text-white pointer-events-none"
      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
    >
      {tech.name}
    </span>
  </div>
);

const TechWheel = () => {
  const [tilt, setTilt] = useState({ x: BASE_TILT, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: BASE_TILT - py * 14, y: px * 16 });
  };

  const handleMouseLeave = () => setTilt({ x: BASE_TILT, y: 0 });

  return (
    <div
      className="relative mx-auto"
      style={{ width: 'min(84vw, 760px)', perspective: '1800px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grounding shadow */}
      <div
        className="absolute left-1/2 top-[92%] -translate-x-1/2 w-[70%] h-16 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
      />

      <div
        className="relative aspect-square transition-transform duration-300 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: 'preserve-3d' }}
      >
        {/* Soft blurred category sectors (donut) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: SECTOR_BACKGROUND,
            filter: 'blur(26px) saturate(1.3)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 14%, black 22%, black 92%, transparent 100%)',
            maskImage: 'radial-gradient(circle, transparent 14%, black 22%, black 92%, transparent 100%)',
          }}
        />

        {/* Rotating radar sweep highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none animate-wheel-spin"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.16) 10deg, transparent 22deg, transparent 360deg)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 14%, black 20%, black 92%, transparent 100%)',
            maskImage: 'radial-gradient(circle, transparent 14%, black 20%, black 92%, transparent 100%)',
          }}
        />

        {/* Concentric structure rings */}
        <div className="absolute rounded-full border border-white/10 pointer-events-none" style={{ inset: '2%' }} />
        <div className="absolute rounded-full border border-dashed border-white/10 pointer-events-none" style={{ inset: '40%' }} />

        {/* Radial divider lines */}
        {BOUNDARY_ANGLES.map((a, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-px h-[46%] pointer-events-none"
            style={{
              transformOrigin: 'top center',
              transform: `translateX(-50%) rotate(${a - 180}deg)`,
              background: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.14) 0 4px, transparent 4px 9px)',
            }}
          />
        ))}

        {/* Category labels */}
        {WHEEL.labels.map((lab, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `calc(50% + ${lab.x}%)`,
              top: `calc(50% + ${lab.y}%)`,
              transform: `translate(-50%, -50%) rotate(${lab.rotate}deg)`,
            }}
          >
            <span
              className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap"
              style={{ color: lab.color, textShadow: `0 0 12px ${lab.color}80` }}
            >
              {lab.name}
            </span>
          </div>
        ))}

        {/* Tech orbs — outer (bigger) ring and inner (smaller) ring orbit independently in opposite directions, staying upright via counter-rotation */}
        <div className="absolute inset-0" style={{ animation: `wheel-spin ${OUTER_ORBIT_DURATION}s linear infinite` }}>
          {WHEEL_OUTER_ICONS.map((icon, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `calc(50% + ${icon.x}%)`, top: `calc(50% + ${icon.y}%)` }}
            >
              <div style={{ animation: `wheel-spin-reverse ${OUTER_ORBIT_DURATION}s linear infinite` }}>
                <TechOrb tech={icon} delay={icon.delay} />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0" style={{ animation: `wheel-spin-reverse ${INNER_ORBIT_DURATION}s linear infinite` }}>
          {WHEEL_INNER_ICONS.map((icon, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `calc(50% + ${icon.x}%)`, top: `calc(50% + ${icon.y}%)` }}
            >
              <div style={{ animation: `wheel-spin ${INNER_ORBIT_DURATION}s linear infinite` }}>
                <TechOrb tech={icon} delay={icon.delay} />
              </div>
            </div>
          ))}
        </div>

        {/* Center hub */}
        <div className="absolute left-1/2 top-1/2 z-20" style={{ transform: 'translate(-50%, -50%)' }}>
          <div className="relative flex items-center justify-center" style={{ width: 'clamp(120px, 21vw, 190px)', height: 'clamp(120px, 21vw, 190px)' }}>
            <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse-soft" />
            <div className="absolute inset-[10%] rounded-full bg-blue-500/10 animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
            <div className="absolute inset-[18%] rounded-full border border-dashed border-white/15 animate-wheel-spin-reverse" />
            <div
              className="relative flex flex-col items-center justify-center rounded-full bg-black/80 backdrop-blur-xl border border-white/10 text-center"
              style={{ width: '76%', height: '76%', boxShadow: '0 0 40px rgba(59,130,246,0.25), inset 0 0 24px rgba(59,130,246,0.12)' }}
            >
              <Cpu className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-white font-black text-sm md:text-lg tracking-tight leading-none">Zentrixs</span>
              <span className="text-zinc-500 text-[9px] md:text-[10px] font-bold tracking-[0.25em] uppercase mt-1">Tech Stack</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechStackSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      className="py-32 bg-[#010101] relative border-y border-white/[0.03] overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flow-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes flow-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wheel-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-flow-left { animation: flow-left 40s linear infinite; }
        .animate-flow-right { animation: flow-right 45s linear infinite; }
        .animate-wheel-spin { animation: wheel-spin 34s linear infinite; }
        .animate-wheel-spin-reverse { animation: wheel-spin-reverse 26s linear infinite; }
        .hover-pause:hover > div { animation-play-state: paused !important; }
      `}} />

      {/* Futuristic Background Grids */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          backgroundPosition: 'center center'
        }}
      />
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)]" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-16 md:mb-20">
        {/* Header Section */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">The Zentrixs Ecosystem</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white w-full tracking-tight mb-6">
            Technologies We <span className="text-blue-500">Master</span>
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Our high-speed infrastructure flow is powered by battle-tested tools mapped out for pure scale, security, and velocity.
          </p>
        </div>
      </div>

      {/* Radial 3D Tech Wheel — desktop / tablet */}
      <div className={`hidden md:flex justify-center px-4 transition-all duration-[1200ms] delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <TechWheel />
      </div>

      {/* Infinite Flowing Tracks — mobile fallback */}
      <div
        className={`md:hidden relative w-full overflow-hidden transition-all duration-[1200ms] delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        {/* Track 1: Left */}
        <div className="w-full hover-pause py-4 relative group">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex w-max animate-flow-left gap-6 px-3">
            {[...TRACK_1, ...TRACK_1].map((tech, i) => (
              <TechCard key={`t1-${i}`} tech={tech} />
            ))}
          </div>
        </div>

        {/* Track 2: Right */}
        <div className="w-full hover-pause py-4 relative group">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex w-max animate-flow-right gap-6 px-3">
            {[...TRACK_2, ...TRACK_2].map((tech, i) => (
              <TechCard key={`t2-${i}`} tech={tech} />
            ))}
          </div>
        </div>

        {/* Track 3: Left (Faster) */}
        <div className="w-full hover-pause py-4 relative group">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex w-max gap-6 px-3" style={{ animation: 'flow-left 35s linear infinite' }}>
            {[...TRACK_3, ...TRACK_3].map((tech, i) => (
              <TechCard key={`t3-${i}`} tech={tech} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
