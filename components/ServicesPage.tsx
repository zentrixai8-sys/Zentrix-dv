import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { COMPANY_NAME, SERVICES, PHONE_NUMBER, CITY } from '../constants';

const ServicesPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#010101] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-10 text-xs font-bold tracking-widest uppercase text-zinc-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            </li>
            <li className="text-zinc-600">/</li>
            <li className="text-blue-500" aria-current="page">Services</li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Icons.Bot className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Business Automation &amp; AI Agents</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Business Automation &amp; AI Agent Services in <span className="text-blue-500">{CITY}</span>
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed font-normal">
            Autonomous AI business agents, official WhatsApp Cloud API bots, custom CRM pipelines, and automated billing software &mdash; engineered to scale your operations without human bottlenecks.
          </p>
        </header>

        {/* 6 Automation Services Grid */}
        <section aria-labelledby="services-grid" className="mb-24">
          <h2 id="services-grid" className="sr-only">Our Business Automation &amp; AI Agent Services in {CITY}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => {
              const IconComp = (Icons as any)[service.icon] || Icons.Bot;
              return (
                <article
                  key={service.slug}
                  className="bg-[#080808] border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all flex flex-col justify-between group hover:shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>

                  <div>
                    {/* Top Row: Icon & Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                        <IconComp className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-600 group-hover:text-blue-400 transition-colors">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      <Link to={`/services/${service.slug}`} className="hover:underline">
                        {service.title}
                      </Link>
                    </h3>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-normal">
                      {service.description}
                    </p>

                    {/* Specs Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {service.specs.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-white/[0.02] border border-white/5 text-zinc-400"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-xs font-bold uppercase tracking-widest text-blue-400 group-hover:text-white flex items-center gap-2 transition-colors"
                    >
                      Explore Service <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                      href={`https://wa.me/91${PHONE_NUMBER}?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-green-400 transition-colors p-1"
                      title="Inquire on WhatsApp"
                      aria-label={`Inquire about ${service.title} on WhatsApp`}
                    >
                      <Icons.MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Why Choose Zentrixs in Raipur */}
        <section aria-labelledby="why-choose" className="mb-24 bg-[#050505] border border-white/5 rounded-3xl p-10 lg:p-16">
          <div className="max-w-3xl mb-12">
            <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-3 block">High-ROI Automation</span>
            <h2 id="why-choose" className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Raipur Businesses Automate With {COMPANY_NAME}
            </h2>
            <p className="text-zinc-400 text-base mt-4">
              We replace chaotic spreadsheets, manual customer typing, and lost inquiries with self-driving software systems that generate revenue around the clock.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Icons.Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">24/7 AI Availability</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Your AI agents answer customer inquiries and capture warm leads at 2 AM with zero human delays.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Icons.MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Official WhatsApp Cloud API</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Meta-verified official WhatsApp API infrastructure with zero ban risk, automated buttons, and catalog sharing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Icons.Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero Lead Leakage</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Every call, form, and message funnels directly into your custom CRM with instant sales rep alerts.
              </p>
            </div>
          </div>
        </section>

        {/* Global CTA Section */}
        <section aria-labelledby="cta-heading" className="text-center p-12 lg:p-16 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-white/10">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to Build Your Custom AI Business Agent?
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto mb-8">
            Tell us about your business workflow. We will demonstrate how an autonomous AI agent can handle your customer inquiries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all"
            >
              Request Live Demo
            </Link>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="px-8 py-4 glass text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
            >
              <Icons.Phone className="w-4 h-4 text-blue-400" /> Call Direct
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ServicesPage;
