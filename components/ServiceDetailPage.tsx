import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { SERVICES, PHONE_NUMBER, CITY } from '../constants';

interface ServiceDetailPageProps {
  slugOverride?: string;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slugOverride }) => {
  const params = useParams<{ slug: string }>();
  const slug = slugOverride || params.slug;
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Find service by slug or fallback (with alias support for website-and-software-development)
  const serviceIndex = SERVICES.findIndex(
    s => s.slug === slug || 
         s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug ||
         (slug === 'business-website-development' && s.slug === 'website-and-software-development')
  );
  const service = SERVICES[serviceIndex];
  const nextService = SERVICES[(serviceIndex + 1) % SERVICES.length];

  useEffect(() => {
    if (!service && slug) {
      navigate('/services');
    }
  }, [service, slug, navigate]);

  if (!service) return null;

  const IconComponent = (Icons as any)[service.icon] || Icons.Zap;
  const NextIconComponent = nextService ? ((Icons as any)[nextService.icon] || Icons.Zap) : Icons.Zap;

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white pt-28 pb-24 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div
        className="fixed top-0 left-0 w-[700px] h-[700px] rounded-full pointer-events-none z-0 opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)'
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-10 text-xs font-bold tracking-widest uppercase text-zinc-500">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            </li>
            <li className="text-zinc-600">/</li>
            <li>
              <Link to="/services" className="hover:text-blue-400 transition-colors">Services</Link>
            </li>
            <li className="text-zinc-600">/</li>
            <li className="text-blue-500" aria-current="page">{service.shortTitle || service.title}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="mb-20 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Heading, Subtitle & CTAs */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <IconComponent className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-400 font-bold tracking-widest text-[11px] uppercase">
                  Service #{String(serviceIndex + 1).padStart(2, '0')} &bull; {CITY}, Chhattisgarh
                </span>
              </div>

              {/* Exact Localized H1 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
                {service.h1}
              </h1>

              <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-8 font-normal">
                {service.details}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center gap-2"
                >
                  <Icons.Calendar className="w-4 h-4" /> Book Consultation
                </Link>
                <a
                  href={`https://wa.me/91${PHONE_NUMBER}?text=Hi%20Zentrixs,%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(service.title)}%20in%20${CITY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 glass text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-green-500/40 hover:bg-green-500/10 transition-all flex items-center gap-2"
                >
                  <Icons.MessageCircle className="w-4 h-4 text-green-400" /> WhatsApp Us
                </a>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="px-6 py-4 glass text-zinc-300 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-blue-500/40 transition-all flex items-center gap-2"
                >
                  <Icons.Phone className="w-4 h-4 text-blue-400" /> Call Direct
                </a>
              </div>

              {/* Key Specs Pills */}
              <div className="flex flex-wrap gap-2">
                {service.specs.map((spec, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase bg-white/[0.03] border border-white/10 text-zinc-300"
                  >
                    &bull; {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-[#0c0c0c] to-[#040404] border border-white/10 rounded-[2.5rem] p-10 sm:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <div className="w-20 h-20 rounded-3xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-8 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                  <IconComponent className="w-10 h-10" />
                </div>

                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-400 block mb-2">Proven Implementation</span>
                <h3 className="text-xl font-bold text-white mb-4">Enterprise Case Study</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-medium">
                  {service.implementation}
                </p>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>Guaranteed SLA in {CITY}</span>
                  <span className="text-green-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 99.9% Uptime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* In-Depth Overview (500+ Words Technical Content) */}
        <section aria-labelledby="technical-overview" className="mb-24 pt-16 border-t border-white/5">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Icons.FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Technical Overview</span>
            </div>

            <h2 id="technical-overview" className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">
              Engineered For High Reliability &amp; Seamless Scalability
            </h2>

            <div className="space-y-6 text-zinc-300 text-base sm:text-lg leading-relaxed font-normal">
              {service.overview.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {service.slug === 'website-and-software-development' && (
              <div className="my-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src="/images/website-and-software-development.webp"
                  alt="Zentrixs - Premier website and software development company"
                  width="1200"
                  height="675"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* Key Features & Architecture Grid */}
        <section aria-labelledby="features-heading" className="mb-24">
          <div className="max-w-3xl mb-14">
            <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-3 block">Specifications</span>
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Enterprise Features &amp; Standards
            </h2>
            <p className="text-zinc-400 text-base mt-2">
              Every detail is calibrated to eliminate failures, simplify administration, and maximize performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.keyFeatures.map((feat, i) => (
              <div
                key={i}
                className="bg-[#080808] border border-white/5 rounded-3xl p-8 hover:border-blue-500/20 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Icons.Check className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-normal pl-11">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Local Industry Solutions in Raipur */}
        <section aria-labelledby="industries-heading" className="mb-24 bg-[#050505] border border-white/5 rounded-3xl p-10 lg:p-14">
          <div className="max-w-3xl mb-10">
            <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-3 block">Localized Expertise</span>
            <h2 id="industries-heading" className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tailored Solutions for {CITY}&apos;s Leading Industries
            </h2>
            <p className="text-zinc-400 text-base mt-2">
              We specialize in understanding the unique regulatory, physical, and environmental demands of enterprises operating across Chhattisgarh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.industries.map((ind, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3"
              >
                <Icons.Building2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-zinc-300">{ind}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Step Deployment Workflow */}
        <section aria-labelledby="workflow-heading" className="mb-24">
          <div className="max-w-3xl mb-14">
            <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-3 block">Deployment Protocol</span>
            <h2 id="workflow-heading" className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Our 4-Step Engineering Workflow
            </h2>
            <p className="text-zinc-400 text-base mt-2">
              From site survey to ongoing support, our structured milestones ensure transparent delivery with zero surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.workflow.map((step, i) => (
              <div
                key={i}
                className="bg-[#080808] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/20 transition-all"
              >
                <span className="text-4xl font-black text-white/[0.05] group-hover:text-blue-500/10 transition-colors block mb-4">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Section with FAQPage Schema */}
        <section aria-labelledby="faqs-heading" className="mb-24 pt-16 border-t border-white/5">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <Icons.HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Frequently Asked Questions</span>
            </div>
            <h2 id="faqs-heading" className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Got Questions About {service.shortTitle || service.title}?
            </h2>
            <p className="text-zinc-400 text-base mt-2">
              Common questions answered by our senior IT engineers in {CITY}.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {service.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-[#080808] border border-white/5 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white hover:text-blue-400 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <Icons.ChevronDown
                      className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-zinc-300 text-sm sm:text-base leading-relaxed font-normal border-t border-white/[0.03]">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Call-to-Action Card */}
        <section aria-labelledby="service-cta" className="mb-20 rounded-3xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-black border border-blue-500/20 p-10 sm:p-14 text-center">
          <h2 id="service-cta" className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to Implement {service.title} in {CITY}?
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto mb-8">
            Speak directly with an enterprise solutions architect. We offer complimentary site visits and technical scoping across {CITY} and Chhattisgarh.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all"
            >
              Book Free Site Survey
            </Link>
            <a
              href={`https://wa.me/91${PHONE_NUMBER}?text=Hi,%20I%20would%20like%20to%20schedule%20a%20site%20visit%20for%20${encodeURIComponent(service.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 glass text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-green-500/30 transition-all flex items-center gap-2"
            >
              <Icons.MessageCircle className="w-4 h-4 text-green-400" /> WhatsApp Direct
            </a>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="px-8 py-4 glass text-zinc-300 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-blue-500/30 transition-all flex items-center gap-2"
            >
              <Icons.Phone className="w-4 h-4 text-blue-400" /> Call: +91 {PHONE_NUMBER}
            </a>
          </div>
        </section>

        {/* Next Service Navigation Card */}
        {nextService && (
          <nav aria-label="Next Service" className="pt-8 border-t border-white/5">
            <Link
              to={`/services/${nextService.slug}`}
              className="group p-8 rounded-3xl bg-[#080808] border border-white/5 hover:border-blue-500/20 transition-all flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <NextIconComponent className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">
                    Explore Next Service
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {nextService.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest group-hover:text-white transition-colors">
                <span>View Details</span>
                <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </nav>
        )}
      </div>
    </main>
  );
};

export default ServiceDetailPage;
