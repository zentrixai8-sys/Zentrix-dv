import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Bot,
  MessageCircle,
  Users,
  FileText,
  Globe,
  PhoneCall,
  CheckCircle2,
  Phone,
  MapPin,
  Award,
  ArrowRight
} from 'lucide-react';
import {
  COMPANY_NAME,
  PHONE_NUMBER,
  ADDRESS,
  CITY,
  STATE,
  SERVICES
} from '../constants';

const AboutPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#010101] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-10 text-xs font-bold tracking-widest uppercase text-zinc-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            </li>
            <li className="text-zinc-600">/</li>
            <li className="text-blue-500" aria-current="page">About Us</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Business Automation &amp; AI Agents</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-8">
            About {COMPANY_NAME} &mdash; <span className="text-blue-500">Autonomous AI Agents &amp; Automation</span> in {CITY}
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed font-normal">
            Eliminating repetitive human bottlenecks with custom generative AI business agents, official WhatsApp Cloud API automation, intelligent CRM pipelines, and automated billing software for enterprises across {CITY}, {STATE}, and nationwide.
          </p>
        </header>

        {/* Narrative & History (500+ words section) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-24">
          <div className="lg:col-span-2 space-y-8 text-zinc-300 leading-relaxed font-normal text-base sm:text-lg">
            <section aria-labelledby="who-we-are">
              <h2 id="who-we-are" className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                Pioneering Intelligent Business Automation in Chhattisgarh
              </h2>
              <p className="mb-4">
                At <strong className="text-white">{COMPANY_NAME}</strong>, we build automated business operating systems and autonomous AI agents designed to scale enterprises without requiring proportional increases in headcount. In today&apos;s fast-paced digital marketplace, customers demand instant 24/7 responses, sales reps need automated lead follow-ups, and business owners need real-time operational visibility.
              </p>
              <p>
                From real estate developers and coaching institutes to high-volume retail stores and distributors in {CITY}, we replace chaotic Excel sheets, unorganized WhatsApp chats, and manual registers with unified, intelligent software systems that run autonomously around the clock.
              </p>
            </section>

            <section aria-labelledby="engineering-philosophy">
              <h2 id="engineering-philosophy" className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                What We Build: AI Agents, WhatsApp Bots &amp; Custom Software
              </h2>
              <p className="mb-4">
                We believe that artificial intelligence should deliver direct, measurable revenue growth rather than generic gimmicks. Our autonomous AI agents are fine-tuned on your exact company brochures, pricing sheets, and service guidelines. They converse fluently in both English and Hindi, understand customer intent, qualify leads, and book sales meetings directly into your calendar.
              </p>
              <p>
                Our official Meta WhatsApp Cloud API workflows deliver instant quotations, automated PDF catalogs, and payment reminders. Combined with bespoke CRM pipelines and GST billing software, our systems handle the repetitive heavy lifting so your human team can focus exclusively on closing high-value deals.
              </p>
            </section>

            <section aria-labelledby="local-commitment">
              <h2 id="local-commitment" className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                Local Presence &amp; Turn-Key Deployment in {CITY}
              </h2>
              <p>
                Headquartered at <strong className="text-white">{ADDRESS}</strong>, our engineers work closely with local business owners in {CITY} to map their sales processes, build custom software solutions, and provide ongoing optimization and training.
              </p>
            </section>
          </div>

          {/* Quick Info Card */}
          <aside className="space-y-6">
            <div className="bg-[#080808] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
              <h3 className="text-xl font-bold text-white mb-6">Company Snapshot</h3>
              
              <ul className="space-y-4 text-sm text-zinc-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Headquarters:</strong>
                    <span>{ADDRESS}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Direct Phone:</strong>
                    <a href={`tel:${PHONE_NUMBER}`} className="hover:text-blue-400 font-mono">+91 {PHONE_NUMBER}</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Core Focus:</strong>
                    <span>AI Business Agents &amp; WhatsApp Automation</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Automations Delivered:</strong>
                    <span>500+ Deployed Workflows</span>
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  <Phone className="w-4 h-4" /> Call Direct
                </a>
                <a
                  href={`https://wa.me/91${PHONE_NUMBER}?text=Hi%20Zentrixs,%20I%20want%20to%20automate%20my%20business%20workflows`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 border border-white/10 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-green-400" /> WhatsApp Us
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Core Pillars */}
        <section aria-labelledby="core-pillars" className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 id="core-pillars" className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Our 4 Pillars of Business Automation
            </h2>
            <p className="text-zinc-400 text-base">
              Engineered to turn manual tasks into self-driving automated workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Bot,
                title: 'Autonomous AI Agents',
                desc: 'Generative AI chatbots and voice calling agents trained on your business data to support and sell 24/7 in English and Hindi.'
              },
              {
                icon: MessageCircle,
                title: 'WhatsApp Automation',
                desc: 'Official Meta WhatsApp Business Cloud API with auto-replies, interactive button menus, PDF catalogs, and bulk broadcasts.'
              },
              {
                icon: Users,
                title: 'Custom CRM Pipelines',
                desc: 'Capture leads from forms, ads, and phone calls into a single live dashboard with automated timed follow-up reminders.'
              },
              {
                icon: FileText,
                title: 'Billing & Inventory',
                desc: 'Lightning-fast GST invoicing, barcode checkout, automated low-stock warnings, and real-time profit analytics.'
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-[#080808] border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{pillar.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Links to Services */}
        <section aria-labelledby="explore-services" className="mb-20 pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 id="explore-services" className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                Explore Our Automation Solutions in {CITY}
              </h2>
              <p className="text-zinc-400 text-sm">
                Click any service below to explore features, case studies, and live demo requests.
              </p>
            </div>
            <Link
              to="/services"
              className="mt-4 md:mt-0 text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, idx) => (
              <Link
                key={idx}
                to={`/services/${s.slug}`}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between group"
              >
                <div>
                  <h3 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">{s.title}</h3>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{s.shortTitle}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section aria-labelledby="cta-heading" className="bg-gradient-to-r from-blue-950/40 via-zinc-900 to-black border border-blue-500/20 rounded-3xl p-10 sm:p-14 text-center">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to Automate Your Business Operations?
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto mb-8">
            Schedule a free 15-minute business automation discovery call and live AI agent demo with our engineers in {CITY}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all"
            >
              Book Free Discovery Call
            </Link>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="px-8 py-4 glass text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-blue-400" /> +91 {PHONE_NUMBER}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
