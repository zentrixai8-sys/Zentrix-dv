import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  MessageSquare, 
  Cpu, 
  LineChart, 
  Layers, 
  ShieldCheck, 
  Flame, 
  Star, 
  Clock, 
  Check, 
  ChevronRight,
  TrendingUp,
  Headphones,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OffersSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Categories aligned with Zentrixs core offerings (in app-like icon grid)
  const categories = [
    { id: 'ai-agents', label: 'AI Voice & Chat Agents', icon: Bot, badge: 'Popular' },
    { id: 'whatsapp', label: 'WhatsApp Automation', icon: MessageSquare, badge: 'High ROI' },
    { id: 'crm', label: 'CRM & Lead Autopilot', icon: LineChart },
    { id: 'custom-dev', label: 'Custom App & Software', icon: Cpu },
    { id: 'erp', label: 'Billing & ERP Systems', icon: Layers },
    { id: 'integration', label: 'System Integration', icon: Settings },
  ];

  // Recommended automation packages with price cards & metrics
  const offers = [
    {
      id: 'agent-starter',
      category: 'ai-agents',
      title: 'AI Inbound & Outbound Calling Agent',
      subtitle: 'Zero Human Calling',
      rating: '4.9',
      reviews: '1.2k',
      time: 'Deploy in 48 hrs',
      bestseller: true,
      price: '₹24,999',
      originalPrice: '₹45,000',
      discount: '44% OFF',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
      features: [
        'Natural Hindi & English accent calling',
        'Auto qualification of inbound inquiries',
        'Real-time CRM & Google Sheets sync'
      ],
      slug: '/services/ai-voice-agents'
    },
    {
      id: 'whatsapp-growth',
      category: 'whatsapp',
      title: 'Meta WhatsApp Business Autopilot',
      subtitle: 'Automated Sales & Support Funnel',
      rating: '4.95',
      reviews: '2.4k',
      time: 'Instant Setup',
      bestseller: true,
      price: '₹14,999',
      originalPrice: '₹28,000',
      discount: '46% OFF',
      image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=700&q=80',
      features: [
        'Official Meta Cloud API & Green Tick verification',
        'Interactive Catalogs & Payment links',
        '24/7 Smart Auto-Replier for leads'
      ],
      slug: '/services/whatsapp-automation'
    },
    {
      id: 'crm-pipeline',
      category: 'crm',
      title: 'Full Business Automation & CRM Suite',
      subtitle: 'End-to-End Enterprise Control',
      rating: '4.88',
      reviews: '890',
      time: 'Custom Scope',
      bestseller: false,
      price: '₹39,999',
      originalPrice: '₹65,000',
      discount: '38% OFF',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=80',
      features: [
        'Live Client Task & Ticket Portal included',
        'Automated WhatsApp notification pipeline',
        'Live telemetry & executive dashboard'
      ],
      slug: '/services/crm-lead-management'
    }
  ];

  return (
    <section id="offers-spotlight" className="relative w-full py-12 md:py-20 bg-[#07090E] overflow-hidden select-none border-t border-white/5">
      {/* Background glow effects matching Zentrixs Cyan/Blue theme */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. HERO PROMO BANNER (Matching the Phone Mockup Hero Banner)               */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#0c1322] via-[#09101d] to-[#04070d] p-6 sm:p-10 md:p-12 mb-10 md:mb-14 shadow-[0_20px_50px_rgba(6,182,212,0.12)]">
          {/* Subtle Cyber Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
                <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Enterprise Automation Pass</span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Business slow or manual? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  We automate it fast.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
                Transform customer capture, lead follow-ups, and field tasks into autonomous 24/7 AI systems engineered specifically for your business.
              </p>

              {/* Instant Service Highlights */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-300 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span>Instant Deployment in 48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span>100% Dedicated Engineer Support</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs font-mono tracking-wider uppercase hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Get Instant Automation</span>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/15 transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Schedule Consultation</span>
                </Link>
              </div>
            </div>

            {/* Right Graphic Column: High-tech AI Robot & Terminal visual */}
            <div className="md:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
                  alt="Zentrixs Enterprise Automation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Zentrixs AI Node 01: Live
                  </div>
                  <p className="text-white text-xs font-semibold mt-1">Autonomous Business Execution</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. POPULAR SERVICES GRID (Matching App Quick-Category Icons)               */}
        {/* ========================================================================= */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">Popular Solutions</h3>
              <p className="text-xs text-zinc-400 font-mono">Engineered to scale revenue automatically</p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono tracking-wider uppercase group"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to="/services"
                  className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#0B0F19] border border-white/10 hover:border-cyan-500/50 hover:bg-[#0E1526] transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-md text-center"
                >
                  {cat.badge && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-black font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      {cat.badge}
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors leading-tight">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. RECOMMENDED FOR YOU (Matching App Product Deal Cards with Book Now)     */}
        {/* ========================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">Recommended For You</h3>
              <p className="text-xs text-zinc-400 font-mono">Turnkey systems ready for immediate deployment</p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono tracking-wider uppercase group"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="group relative rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:-translate-y-1.5"
              >
                {/* Image Header with Bestseller Badge */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-black/30" />

                  {offer.bestseller && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-[10px] font-black font-mono tracking-wider uppercase shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-black" />
                      <span>Bestseller</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-emerald-400 text-[10px] font-mono font-bold">
                    {offer.discount}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-400 transition-colors leading-snug">
                      {offer.title}
                    </h4>

                    {/* Rating & Delivery Badges */}
                    <div className="flex items-center gap-3 mt-2 text-xs font-mono text-zinc-400">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{offer.rating}</span>
                        <span className="text-zinc-500 font-normal">({offer.reviews})</span>
                      </div>
                      <span className="opacity-40">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{offer.time}</span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <ul className="mt-3.5 space-y-2 border-t border-white/5 pt-3">
                      {offer.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price Row + Book Now Button */}
                  <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black text-white font-mono">{offer.price}</span>
                        <span className="text-xs text-zinc-500 line-through font-mono">{offer.originalPrice}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Solution
                      </span>
                    </div>

                    <Link
                      to="/contact"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs font-mono tracking-wider uppercase shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. BOTTOM TRUST BADGES (Matching App 4-Badge Guarantee Bar)                */}
        {/* ========================================================================= */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <h5 className="text-xs font-bold text-white">Verified Engineers</h5>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Top-tier AI architects</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h5 className="text-xs font-bold text-white">Transparent ROI</h5>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Clear deliverables & scope</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Cpu className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <h5 className="text-xs font-bold text-white">30-Day Support Guarantee</h5>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Bug-free production</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Headphones className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <h5 className="text-xs font-bold text-white">Live Client Portal</h5>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Real-time task tracking</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OffersSection;
