
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { SERVICES } from '../constants';

const SECTION_VH = 85; // scroll distance (vh) allotted to each service

const ServicesSection: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const anchorRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    anchorRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (i: number) => {
    anchorRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const activeService = SERVICES[active];
  const ActiveIcon = (Icons as any)[activeService.icon] || Icons.Zap;

  return (
    <section id="services" className="py-32 bg-zinc-950 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes service-fade-in {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .service-card-anim { animation: service-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-24 reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20 mb-6">
            <Icons.Cpu className="w-3 h-3 text-blue-500" />
            <span className="text-blue-500 font-bold tracking-widest text-xs uppercase">Our Services</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            What <span className="text-blue-500">We Do.</span>
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            Scroll through to see exactly what each service covers, what we automate, and the real results our clients get.
          </p>
        </div>

        {/* Scroll-driven service explorer — desktop / tablet */}
        <div
          className="hidden md:block relative"
          style={{ height: `${SERVICES.length * SECTION_VH}vh` }}
        >
          {/* Invisible scroll anchors used to detect which service is centered in view */}
          {SERVICES.map((_, i) => (
            <div
              key={i}
              data-index={i}
              ref={el => { anchorRefs.current[i] = el; }}
              className="absolute inset-x-0 pointer-events-none"
              style={{ top: `${i * SECTION_VH}vh`, height: `${SECTION_VH}vh` }}
            />
          ))}

          <div className="sticky top-28 grid grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8">
            {/* Sidebar navigation */}
            <div className="flex flex-col gap-2">
              {SERVICES.map((service, i) => {
                const NavIcon = (Icons as any)[service.icon] || Icons.Zap;
                const isActive = i === active;
                return (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    className={`flex items-center gap-4 text-left px-4 py-4 rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? 'bg-[#0f0f0f] border-blue-500/30 shadow-[0_0_24px_rgba(59,130,246,0.08)]'
                        : 'bg-transparent border-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className={`text-xs font-bold tabular-nums ${isActive ? 'text-blue-500' : 'text-zinc-700'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <NavIcon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-500' : 'text-zinc-600'}`} />
                    <span className={`text-sm font-bold leading-snug transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                      {service.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active service content card */}
            <div
              key={active}
              className="service-card-anim bg-[#080808] border border-white/5 rounded-[2.5rem] p-10 lg:p-14 shadow-2xl"
            >
              <div className="flex items-start gap-5 mb-6">
                <div className="bg-[#0f0f0f] w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 shrink-0">
                  <ActiveIcon className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-1">
                    {activeService.title}
                  </h3>
                  <p className="text-zinc-400 text-sm lg:text-base font-medium">
                    {activeService.description}
                  </p>
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed mb-10">
                {activeService.details}
              </p>

              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/[0.05]">
                <div>
                  <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-4 block">
                    Key Features
                  </span>
                  <ul className="space-y-3">
                    {activeService.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm font-medium">
                        <Icons.CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
                  <span className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-3 block">
                    Real-World Impact
                  </span>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {activeService.implementation}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/services/${getSlug(activeService.title)}`)}
                className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors group"
              >
                View Full Details
                <Icons.ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Static card grid — mobile fallback */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Zap;
            return (
              <div
                key={index}
                onClick={() => navigate(`/services/${getSlug(service.title)}`)}
                className={`reveal reveal-up stagger-${(index % 3) + 1} bg-[#080808] p-10 rounded-[3rem] border border-white/5 transition-all duration-500 cursor-pointer group flex flex-col h-full hover:border-blue-500/20 shadow-2xl relative overflow-hidden`}
              >
                <div className="bg-[#0f0f0f] w-20 h-20 rounded-[1.8rem] flex items-center justify-center mb-16 border border-white/5 group-hover:bg-[#151515] transition-colors">
                  <IconComponent className="w-8 h-8 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                </div>

                <div className="flex-grow">
                  <h4 className="text-2xl font-bold text-white mb-6 leading-tight">
                    {service.title}
                  </h4>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium mb-10">
                    {service.description}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.6)] animate-pulse"></div>
                    <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase group-hover:text-blue-400 transition-colors">Learn More</span>
                  </div>
                  <Icons.ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
