import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import Hero from './components/Hero';
import OffersSection from './components/OffersSection';
import ProblemSolution from './components/ProblemSolution';
import MissionVision from './components/MissionVision';
import ServicesSection from './components/ServicesSection';
import AgentFlow from './components/AgentFlow';
import { ClientLogosSection, ClientFeedbackSection } from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import SuperAdminConsole from './components/SuperAdminConsole';
import { getAuthSession, clearAuthSession } from './services/taskService';
import LegalPage from './components/LegalPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import ServicesPage from './components/ServicesPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import BlogPage from './components/BlogPage';
import TechStackSection from './components/TechStackSection';
import CEOMessage from './components/CEOMessage';
import SEOHead from './components/SEOHead';
import EcosystemSection from './components/EcosystemSection';
import CookieConsentModal from './components/CookieConsentModal';
import { PHONE_NUMBER, AI_BOT_NUMBER } from './constants';
import { MessageCircle, Phone, ChevronUp } from 'lucide-react';

// Wrapper to handle scroll-to-top on route change
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Landing Page Component
export const LandingPage = () => {
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
      <ClientLogosSection />
      <TechStackSection />
      <EcosystemSection />
      <OffersSection />
      <ProblemSolution />
      <MissionVision />
      <ServicesSection />
      <AgentFlow />
      <ClientFeedbackSection />
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
            aria-label="Chat with Zentrix AI Assistant on WhatsApp"
          >
            <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[8px] font-black text-black items-center justify-center">AI</span>
            </span>
          </button>
        </div>

        <a
          href={`tel:${PHONE_NUMBER}`}
          className="w-12 h-12 md:w-14 md:h-14 bg-white text-black rounded-2xl shadow-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform"
          title={`Call: ${PHONE_NUMBER}`}
          aria-label={`Call Zentrixs at ${PHONE_NUMBER}`}
        >
          <Phone className="h-5 w-5 md:h-6 md:w-6" />
        </a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`w-12 h-12 md:w-14 md:h-14 glass text-white rounded-2xl shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center border border-white/10 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll to Top"
        >
          <ChevronUp className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </>
  );
};

// Reusable AppContent for both Client (BrowserRouter) and Server (MemoryRouter)
export const AppContent: React.FC = () => {
  const [authRole, setAuthRole] = useState<'admin' | 'company' | null>(() => {
    const session = getAuthSession();
    return session ? (session.role === 'admin' ? 'admin' : 'company') : null;
  });
  const [, setCurrentUser] = useState<string>(() => {
    const session = getAuthSession();
    return session?.user || '';
  });

  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoute = location.pathname === '/dashboard';

  const handleLoginSuccess = (user: string, role: 'admin' | 'company') => {
    setAuthRole(role);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthRole(null);
    setCurrentUser('');
  };

  return (
    <div className="min-h-screen bg-[#010101] selection:bg-blue-600/40 text-white">
      <SEOHead />
      <ScrollToTop />
      {(!isDashboardRoute || !authRole) && (
        <Header
          isAdmin={authRole === 'admin'}
          userRole={authRole}
          onLogout={handleLogout}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/website-and-software-development" element={<ServiceDetailPage slugOverride="website-and-software-development" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/privacy-policy" element={<LegalPage />} />
        <Route
          path="/dashboard"
          element={
            authRole === 'admin' ? (
              <SuperAdminConsole onLogout={handleLogout} />
            ) : authRole === 'company' ? (
              <CompanyDashboard onLogout={handleLogout} />
            ) : (
              <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
                <LoginModal
                  onClose={() => navigate('/')}
                  onSuccess={(user, role) => handleLoginSuccess(user, role)}
                />
              </div>
            )
          }
        />
        <Route
          path="/login"
          element={
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
              <LoginModal
                onClose={() => navigate('/')}
                onSuccess={(user, role) => {
                  handleLoginSuccess(user, role);
                  navigate('/dashboard');
                }}
              />
            </div>
          }
        />
        <Route path="*" element={<LandingPage />} />
      </Routes>

      <CookieConsentModal />
      {!isDashboardRoute && <Footer />}
    </div>
  );
};

// Main App component used in client entry
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
