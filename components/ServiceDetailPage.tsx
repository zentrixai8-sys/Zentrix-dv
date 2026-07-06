
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { SERVICES, PHONE_NUMBER } from '../constants';

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Find service by slug
  const serviceIndex = SERVICES.findIndex(
    s => s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
  );
  const service = SERVICES[serviceIndex];
  const nextService = SERVICES[(serviceIndex + 1) % SERVICES.length];

  useEffect(() => {
    if (!service) {
      navigate('/');
    }
  }, [service, navigate]);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection observer for scroll sections
  useEffect(() => {
    const sections = document.querySelectorAll('.service-scroll-section');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveSection(index);
            entry.target.classList.add('section-visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [service]);

  if (!service) return null;

  const IconComponent = (Icons as any)[service.icon] || Icons.Zap;
  const NextIconComponent = nextService ? ((Icons as any)[nextService.icon] || Icons.Zap) : Icons.Zap;

  const getSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Extended features for scroll sections
  const features = [
    {
      icon: Icons.Target,
      title: 'Precision Built',
      description: 'Every solution is custom-engineered for your specific business needs. No generic templates.',
    },
    {
      icon: Icons.Gauge,
      title: 'Performance First',
      description: 'Optimized for speed and reliability. Your systems stay fast even as your business grows.',
    },
    {
      icon: Icons.Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols protect your data around the clock.',
    },
    {
      icon: Icons.Headphones,
      title: 'Dedicated Support',
      description: 'Our team is always available to help you with any issues or questions you may have.',
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#010101] relative overflow-hidden">
      {/* Floating gradient orbs */}
      <div
        className="fixed top-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none z-0 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* ============================================ */}
      {/* SECTION 1: Hero Section */}
      {/* ============================================ */}
      <section
        className="service-scroll-section min-h-screen flex items-center justify-center relative pt-28 pb-20"
        data-index="0"
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-3 mb-16 text-zinc-500 hover:text-white transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
              <Icons.ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Back to Services</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="service-hero-content">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/20 mb-8 animate-[fadeInUp_0.6s_ease-out_forwards]">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-blue-400 font-bold tracking-widest text-[10px] uppercase">
                  Service #{String(serviceIndex + 1).padStart(2, '0')}
                </span>
              </div>

              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] mb-8"
                style={{
                  animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
                  opacity: 0,
                }}
              >
                {service.title.split(' ').map((word, i) => (
                  <span key={i} className={i === service.title.split(' ').length - 1 ? 'text-blue-500' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>

              <p
                className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg mb-12 font-medium"
                style={{
                  animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
                  opacity: 0,
                }}
              >
                {service.details}
              </p>

              <div
                className="flex flex-wrap gap-4"
                style={{
                  animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards',
                  opacity: 0,
                }}
              >
                <button
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
                  className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(37,99,235,0.3)]"
                >
                  Start Integration
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/91${PHONE_NUMBER}?text=Hi,%20I%20want%20to%20know%20about%20${encodeURIComponent(service.title)}`, '_blank')}
                  className="px-10 py-5 glass text-white rounded-2xl font-black text-xs tracking-[0.3em] uppercase border border-white/10 hover:border-blue-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  WhatsApp Us
                </button>
              </div>
            </div>

            {/* Right: Floating 3D Card */}
            <div className="relative flex items-center justify-center">
              <div
                className="relative w-full max-w-[420px] aspect-square"
                style={{
                  animation: 'fadeInScale 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards',
                  opacity: 0,
                }}
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-[4rem] bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/10 animate-spin-slow opacity-50" />
                
                {/* Main card */}
                <div
                  className="absolute inset-4 rounded-[3.5rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 flex flex-col items-center justify-center p-12 shadow-2xl"
                  style={{
                    transform: `perspective(1000px) rotateY(${mousePos.x * 8}deg) rotateX(${mousePos.y * -8}deg)`,
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Icon circle */}
                  <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/20 flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 rounded-[2rem] bg-blue-500/10 animate-pulse-soft" />
                    <IconComponent className="w-14 h-14 text-blue-500 relative z-10" />
                  </div>

                  {/* Spec badges */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {service.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10 text-zinc-400 bg-white/[0.02]"
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${0.6 + i * 0.1}s forwards`,
                          opacity: 0,
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-0 right-0 w-20 h-20">
                  <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-blue-500/30 animate-pulse" />
                </div>
                <div className="absolute bottom-0 left-0 w-20 h-20">
                  <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-cyan-500/30 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
            <span className="text-[10px] text-zinc-600 font-bold tracking-[0.3em] uppercase">Scroll</span>
            <Icons.ChevronDown className="w-4 h-4 text-zinc-600" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: Specs & Details */}
      {/* ============================================ */}
      <section
        className="service-scroll-section min-h-screen flex items-center relative py-32"
        data-index="1"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Big number + tagline */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20 mb-8">
                <Icons.Sparkles className="w-3 h-3 text-blue-500" />
                <span className="text-blue-500 font-bold tracking-widest text-[10px] uppercase">What's Included</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95] mb-8">
                Everything You <span className="text-blue-500">Need.</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-md font-medium">
                {service.description}
              </p>

              {/* Implementation story */}
              <div className="mt-12 p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                <div className="pl-6">
                  <span className="text-[10px] text-blue-500 font-bold tracking-[0.3em] uppercase block mb-3">Case Study</span>
                  <p className="text-zinc-300 text-sm leading-relaxed font-medium">{service.implementation}</p>
                </div>
              </div>
            </div>

            {/* Right: Spec cards */}
            <div className="grid grid-cols-2 gap-4">
              {service.specs.map((spec, i) => (
                <div
                  key={i}
                  className="service-spec-card group p-8 rounded-[2rem] bg-[#080808] border border-white/5 hover:border-blue-500/20 transition-all duration-500 relative overflow-hidden cursor-default"
                  style={{
                    transitionDelay: `${i * 0.1}s`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="text-5xl font-black text-white/[0.04] mb-4 leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <Icons.Check className="w-5 h-5 text-blue-500 mb-4" />
                    <h4 className="text-white font-bold text-base tracking-tight">{spec}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: Why This Service */}
      {/* ============================================ */}
      <section
        className="service-scroll-section min-h-screen flex items-center relative py-32"
        data-index="2"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20 mb-6">
              <Icons.Zap className="w-3 h-3 text-blue-500" />
              <span className="text-blue-500 font-bold tracking-widest text-[10px] uppercase">Why Choose This</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Built for <span className="text-blue-500">Results.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-10 rounded-[3rem] bg-[#080808] border border-white/5 hover:border-blue-500/20 transition-all duration-700 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all">
                      <FeatureIcon className="w-6 h-6 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h4 className="text-white font-bold text-xl mb-4 tracking-tight">{feature.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 4: CTA + Next Service */}
      {/* ============================================ */}
      <section
        className="service-scroll-section min-h-screen flex items-center relative py-32"
        data-index="3"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          {/* CTA Block */}
          <div className="relative rounded-[4rem] bg-gradient-to-br from-[#080808] to-[#050505] border border-white/[0.05] p-16 md:p-24 text-center mb-20 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-40 h-40 border-l border-b border-white/[0.03] rounded-bl-[4rem]" />
            <div className="absolute top-0 right-0 w-40 h-40 border-r border-t border-white/[0.03] rounded-tr-[4rem]" />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-[1.5rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-10">
                <Icons.Rocket className="w-8 h-8 text-blue-500" />
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                Ready to <span className="text-blue-500">Get Started?</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-12 font-medium leading-relaxed">
                Let's transform your business with {service.title}. Book a free consultation today.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
                  className="px-12 py-6 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-[0_0_60px_rgba(37,99,235,0.3)]"
                >
                  Book Free Demo
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/91${PHONE_NUMBER}?text=Hi,%20I%20need%20${encodeURIComponent(service.title)}%20for%20my%20business`, '_blank')}
                  className="px-12 py-6 glass text-white rounded-2xl font-black text-xs tracking-[0.3em] uppercase border border-white/10 hover:border-green-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center gap-3">
                    <Icons.MessageCircle className="w-4 h-4 text-green-500" />
                    Chat on WhatsApp
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Next Service Card */}
          {nextService && (
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                navigate(`/services/${getSlug(nextService.title)}`);
              }}
              className="group cursor-pointer p-10 md:p-16 rounded-[3rem] bg-[#080808] border border-white/5 hover:border-blue-500/20 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-all">
                  <NextIconComponent className="w-7 h-7 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 font-bold tracking-[0.3em] uppercase block mb-2">Next Service</span>
                  <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    {nextService.title}
                  </h4>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase group-hover:text-blue-400 transition-colors">Explore</span>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                  <Icons.ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section progress dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 hidden lg:flex">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={() => {
              const section = document.querySelector(`[data-index="${i}"]`);
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              activeSection === i
                ? 'bg-blue-500 h-8 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                : 'bg-zinc-700 hover:bg-zinc-500'
            }`}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .service-scroll-section {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .service-scroll-section.section-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* First section visible by default */
        .service-scroll-section[data-index="0"] {
          opacity: 1;
          transform: translateY(0);
        }

        .service-spec-card {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out, border-color 0.5s;
        }

        .section-visible .service-spec-card {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default ServiceDetailPage;
