
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import OffersSection from './components/OffersSection';
import ProblemSolution from './components/ProblemSolution';
import MissionVision from './components/MissionVision';
import ServicesSection from './components/ServicesSection';
import AIConsultant from './components/AIConsultant';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import LegalPage from './components/LegalPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import TechStackSection from './components/TechStackSection';
import { PHONE_NUMBER, AI_BOT_NUMBER } from './constants';
import { MessageCircle, Zap, Shield, Rocket, Layers, Database, Ticket, Phone, ChevronUp, Activity, BarChart3, Fingerprint, Cpu, Bot } from 'lucide-react';

import CEOMessage from './components/CEOMessage';

// Wrapper to handle scroll-to-top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Landing Page Component
const LandingPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Animation Observer Logic
    const revealCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    };
    const observer = new IntersectionObserver(revealCallback, { root: null, threshold: 0.05 });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('reveal')) observer.observe(node);
            node.querySelectorAll('.reveal').forEach(el => observer.observe(el));
          }
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Hero />
      <OffersSection />
      <ProblemSolution />
      <MissionVision />

      <section id="ecosystem" className="py-32 relative bg-[#010101] border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 reveal reveal-up">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Fingerprint className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500 font-bold uppercase tracking-widest">Why Choose Zentrixs?</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                Everything Your Business Needs <span className="text-blue-500">To Grow.</span>
              </h2>
              <p className="mt-6 text-zinc-400 text-lg font-normal leading-relaxed max-w-xl">
                We provide all the tools you need to run your business smoothly. From managing customers to tracking sales, we handle it all.
              </p>
            </div>
            <div className="mt-8 md:mt-0 glass p-5 rounded-2xl border-white/5 flex items-center gap-5 reveal reveal-right">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 font-medium mb-1">System Status</span>
                <span className="text-sm text-green-500 font-bold">100% Operational</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-green-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: 'Easy Management', status: 'Simple', text: 'Manage your entire business from one simple dashboard.', anim: 'reveal-up' },
              { icon: Database, title: 'Safe Data', status: 'Secure', text: 'Your customer data is always safe and backed up automatically.', anim: 'reveal-up' },
              { icon: Ticket, title: 'Smart Support', status: '24/7', text: 'AI agents answer customer questions instantly, day or night.', anim: 'reveal-up' },
              { icon: Shield, title: 'Full Security', status: 'Protected', text: 'Bank-level security to keep your business information private.', anim: 'reveal-up' },
              { icon: Rocket, title: 'Fast Setup', status: 'Ready', text: 'Get your system running in days, not months.', anim: 'reveal-up' },
              { icon: Cpu, title: 'Live Tracking', status: 'Real-time', text: 'See your sales and leads update in real-time.', anim: 'reveal-up' },
            ].map((feature, i) => (
              <div
                key={i}
                className={`reveal ${feature.anim} stagger-${(i % 3) + 1} spotlight-card bg-[#050505] p-10 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/[0.03] group-hover:border-blue-500/20 transition-colors"></div>

                <div className="flex justify-between items-start mb-8">
                  <div className="bg-[#0A0A0A] w-14 h-14 rounded-2xl flex items-center justify-center text-zinc-500 border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Status</p>
                    <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">{feature.status}</p>
                  </div>
                </div>

                <h4 className="text-white font-bold text-xl mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />
      <TechStackSection />
      <AIConsultant />
      <TestimonialsSection />
      <CEOMessage />
      <ContactSection />

      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end gap-3 md:gap-4 z-[9999]">
        {/* Floating AI Assistant Chatbot Button */}
        <div className="flex items-center gap-2 group">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI Assistant: <span className="font-mono text-white">+91 {AI_BOT_NUMBER}</span>
          </div>
          <button
            onClick={() => window.open(`https://wa.me/91${AI_BOT_NUMBER}?text=Hi%20Zentrix%20AI%20Assistant,%20I%20want%20to%20see%20Zentrixs%20Business%20Automation%20Demo`, '_blank')}
            className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white rounded-2xl shadow-[0_0_25px_rgba(37,211,102,0.4)] flex items-center justify-center border border-white/20 hover:scale-110 transition-transform"
            title={`Zentrix AI Assistant: +91 ${AI_BOT_NUMBER}`}
          >
            <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[8px] font-black text-black items-center justify-center">AI</span>
            </span>
          </button>
        </div>

        <a href={`tel:${PHONE_NUMBER}`} className="w-12 h-12 md:w-14 md:h-14 bg-white text-black rounded-2xl shadow-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform" title={`Call: ${PHONE_NUMBER}`}>
          <Phone className="h-5 w-5 md:h-6 md:w-6" />
        </a>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`w-12 h-12 md:w-14 md:h-14 glass text-white rounded-2xl shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center border border-white/10 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <ChevronUp className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </>
  );
};

// Main App Structure with Routing
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState('');

  const handleLoginSuccess = (user: string) => {
    setIsAdmin(true);
    setAdminUser(user);
    // Navigation to dashboard handled declaratively or via hook in child components if needed
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#010101] selection:bg-blue-600/40 text-white">
        <Header isAdmin={isAdmin} onLogout={() => setIsAdmin(false)} onLoginSuccess={handleLoginSuccess} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/privacy-policy" element={<LegalPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route
            path="/dashboard"
            element={
              isAdmin
                ? <div className="pt-40 pb-20 px-6"><AdminDashboard onClose={() => window.location.href = '/'} /></div>
                : <LandingPage /> // Or redirect to login
            }
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
