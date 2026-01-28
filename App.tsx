
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
import { PHONE_NUMBER } from './constants';
import { MessageCircle, Zap, Shield, Rocket, Layers, Database, Ticket, Phone, ChevronUp, Activity, BarChart3, Fingerprint, Cpu } from 'lucide-react';
import IntroSequence from './components/IntroSequence';

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
    const observer = new IntersectionObserver(revealCallback, { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

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
      <IntroSequence />
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
                <span className="mono text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Infrastructure Audit</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic leading-none uppercase">
                Enterprise <span className="text-blue-500">Ecosystem.</span>
              </h2>
              <p className="mt-8 text-zinc-500 text-lg font-medium leading-relaxed max-w-xl">
                Deploying modular automation nodes designed for high-availability business environments.
              </p>
            </div>
            <div className="mt-8 md:mt-0 glass p-5 rounded-2xl border-white/5 flex items-center gap-5 reveal reveal-right">
              <div className="flex flex-col">
                <span className="mono text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Global System Stability</span>
                <span className="mono text-xs text-green-500 font-black tracking-widest uppercase">99.998% Uptime</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-green-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: 'Adaptive Framework', status: 'OPTIMAL', text: 'Proprietary management layers designed for seamless enterprise scaling.', anim: 'reveal-up' },
              { icon: Database, title: 'Neural Orchestration', status: 'SYNCED', text: 'Real-time multi-node synchronization with predictive resource balancing.', anim: 'reveal-up' },
              { icon: Ticket, title: 'Autonomous Intelligence', status: 'ONLINE', text: 'Cognitive resolution engines processing support and sales logic instantly.', anim: 'reveal-up' },
              { icon: Shield, title: 'Hardened Security', status: 'PROTECTED', text: 'AES-256 military-grade encryption protocols securing global data-at-rest.', anim: 'reveal-up' },
              { icon: Rocket, title: 'Strategic Execution', status: 'DEPLOYED', text: 'Rapid implementation cycles leveraging modular deployment blueprints.', anim: 'reveal-up' },
              { icon: Cpu, title: 'System Observability', status: 'MONITORED', text: 'Advanced telemetry providing sub-second system performance insights.', anim: 'reveal-up' },
            ].map((feature, i) => (
              <div
                key={i}
                className={`reveal ${feature.anim} stagger-${(i % 3) + 1} spotlight-card bg-[#050505] p-12 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/[0.03] group-hover:border-blue-500/20 transition-colors"></div>

                <div className="flex justify-between items-start mb-12">
                  <div className="bg-[#0A0A0A] w-16 h-16 rounded-2xl flex items-center justify-center text-zinc-500 border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <div className="text-right">
                    <p className="mono text-[8px] text-gray-600 font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className="mono text-[10px] text-blue-500 font-black uppercase tracking-widest">{feature.status}</p>
                  </div>
                </div>

                <h4 className="text-white font-black text-2xl mb-6 tracking-tighter uppercase italic">{feature.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-bold uppercase tracking-widest">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />
      <AIConsultant />
      <TestimonialsSection />
      <ContactSection />

      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-[9999]">
        <button onClick={() => window.open(`https://wa.me/91${PHONE_NUMBER}`, '_blank')} className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-2xl shadow-2xl flex items-center justify-center border border-white/10 hover:scale-110 transition-transform">
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
        </button>
        <a href={`tel:${PHONE_NUMBER}`} className="w-12 h-12 md:w-14 md:h-14 bg-white text-black rounded-2xl shadow-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform">
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
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
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
