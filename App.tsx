
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
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

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [view, setView] = useState<'landing' | 'dashboard' | 'privacy' | 'terms'>('landing');

  // Sync internal state with URL params if possible, but handle environments where window.location is restricted
  useEffect(() => {
    const handleLocationChange = () => {
      try {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const v = params.get('protocol') || params.get('view');
        
        if (v === 'privacy') setView('privacy');
        else if (v === 'terms') setView('terms');
        else if (v === 'dashboard') setView('dashboard');
        else setView('landing');
        
        window.scrollTo(0, 0);
      } catch (e) {
        // Fallback if URL parsing fails in weird environments
        console.debug("Navigation sync bypass");
      }
    };
    
    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();
    
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    const revealCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) img.classList.add('loaded');
      img.onload = () => img.classList.add('loaded');
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [view]);

  const navigate = (to: 'landing' | 'privacy' | 'terms' | 'dashboard') => {
    setView(to);
    window.scrollTo(0, 0);
    
    // Attempt URL update only in standard environments to avoid SecurityError in sandboxed/blob origins
    try {
      const isStandardEnv = window.location.protocol === 'http:' || window.location.protocol === 'https:';
      const isBlobEnv = window.location.protocol === 'blob:';

      if (isStandardEnv && !isBlobEnv) {
        const searchParams = new URLSearchParams(window.location.search);
        if (to === 'landing') {
          searchParams.delete('protocol');
          searchParams.delete('view');
        } else if (to === 'privacy' || to === 'terms') {
          searchParams.set('protocol', to);
          searchParams.delete('view');
        } else {
          searchParams.set('view', to);
          searchParams.delete('protocol');
        }
        
        const queryString = searchParams.toString();
        const newUrl = queryString ? '?' + queryString : window.location.pathname;
        
        // Final sanity check on origin to avoid cross-origin History push attempts
        window.history.pushState({}, '', newUrl);
      }
    } catch (e) {
      // Silently consume. The app state is correctly managed via 'setView' above.
    }
  };

  const handleLoginSuccess = (user: string) => {
    setIsAdmin(true);
    setAdminUser(user);
    navigate('dashboard');
  };

  if (view === 'privacy' || view === 'terms') {
    return (
      <div className="min-h-screen bg-[#020202] text-white">
        <Header isAdmin={isAdmin} onLogout={() => setIsAdmin(false)} onLoginSuccess={handleLoginSuccess} />
        <LegalPage type={view} onBack={() => navigate('landing')} />
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  if (view === 'dashboard' && isAdmin) {
    return (
      <div className="min-h-screen bg-[#020202] text-white">
        <Header isAdmin={isAdmin} onLogout={() => setIsAdmin(false)} onLoginSuccess={handleLoginSuccess} />
        <div className="pt-40 pb-20 px-6">
          <AdminDashboard onClose={() => navigate('landing')} />
        </div>
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010101] selection:bg-cyan-500/40">
      <Header isAdmin={isAdmin} onLogout={() => setIsAdmin(false)} onLoginSuccess={handleLoginSuccess} />
      
      <main>
        <Hero />
        <ProblemSolution />
        <MissionVision />

        <section id="ecosystem" className="py-32 relative bg-[#010101] border-y border-white/[0.03]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 reveal reveal-up">
               <div className="max-w-2xl">
                 <div className="flex items-center gap-3 mb-6">
                   <Fingerprint className="w-4 h-4 text-cyan-500" />
                   <span className="mono text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Infrastructure Audit</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic leading-none uppercase">
                   Enterprise <span className="text-cyan-500">Ecosystem.</span>
                 </h2>
                 <p className="mt-8 text-zinc-500 text-lg font-medium leading-relaxed max-w-xl">
                   Deploying modular automation nodes designed for high-availability business environments.
                 </p>
               </div>
               <div className="mt-8 md:mt-0 glass p-5 rounded-2xl border-white/5 flex items-center gap-5 reveal reveal-right">
                  <div className="flex flex-col text-right">
                    <span className="mono text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Stability Rate</span>
                    <span className="mono text-xs text-green-500 font-black tracking-widest uppercase">99.998% Uptime</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-green-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-500 animate-pulse" />
                  </div>
               </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {icon: Layers, title: 'Adaptive Framework', status: 'OPTIMAL', text: 'Proprietary management layers designed for seamless enterprise scaling.', anim: 'reveal-up'},
                {icon: Database, title: 'Neural Orchestration', status: 'SYNCED', text: 'Real-time multi-node synchronization with predictive resource balancing.', anim: 'reveal-up'},
                {icon: Ticket, title: 'Autonomous Intelligence', status: 'ONLINE', text: 'Cognitive resolution engines processing support and sales logic instantly.', anim: 'reveal-up'},
                {icon: Shield, title: 'Hardened Security', status: 'PROTECTED', text: 'AES-256 military-grade encryption protocols securing global data-at-rest.', anim: 'reveal-up'},
                {icon: Rocket, title: 'Strategic Execution', status: 'DEPLOYED', text: 'Rapid implementation cycles leveraging modular deployment blueprints.', anim: 'reveal-up'},
                {icon: Cpu, title: 'System Observability', status: 'MONITORED', text: 'Advanced telemetry providing sub-second system performance insights.', anim: 'reveal-up'},
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className={`reveal ${feature.anim} stagger-${(i%3)+1} spotlight-card bg-[#050505] p-12 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden`}
                >
                   <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/[0.03] group-hover:border-cyan-500/20 transition-colors"></div>
                   
                   <div className="flex justify-between items-start mb-12">
                      <div className="bg-[#0A0A0A] w-16 h-16 rounded-2xl flex items-center justify-center text-zinc-500 border border-white/5 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-xl">
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <div className="text-right">
                        <p className="mono text-[8px] text-gray-600 font-bold uppercase tracking-widest mb-1">Status</p>
                        <p className="mono text-[10px] text-cyan-500 font-black uppercase tracking-widest">{feature.status}</p>
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
      </main>

      <Footer onNavigate={navigate} />

      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-[9999]">
        <button onClick={() => window.open(`https://wa.me/91${PHONE_NUMBER}`, '_blank')} className="w-14 h-14 bg-[#25D366] text-white rounded-2xl shadow-2xl flex items-center justify-center border border-white/10 hover:scale-110 transition-transform">
          <MessageCircle className="h-7 w-7" />
        </button>
        <a href={`tel:${PHONE_NUMBER}`} className="w-14 h-14 bg-white text-black rounded-2xl shadow-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform">
          <Phone className="h-6 w-6" />
        </a>
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className={`w-14 h-14 glass text-white rounded-2xl shadow-2xl hover:bg-cyan-600 transition-all flex items-center justify-center border border-white/10 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <ChevronUp className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default App;
