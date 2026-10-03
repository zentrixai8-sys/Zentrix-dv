import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, LogOut, ArrowUpRight, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { NAV_ITEMS, COMPANY_NAME, LOGO_URL, AI_BOT_NUMBER, PHONE_NUMBER } from '../constants';
import LoginModal from './LoginModal';

interface HeaderProps {
  isAdmin?: boolean;
  userRole?: 'admin' | 'company' | null;
  onLogout: () => void;
  onLoginSuccess: (user: string, role: 'admin' | 'company') => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, userRole, onLogout, onLoginSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!isAdmin || !!userRole;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when overlay is open & support Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (location.pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About Us', href: '/about' },
    { label: 'Blog & Insights', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    ...(isLoggedIn
      ? [{ label: userRole === 'company' ? 'Company Dashboard' : 'Admin Console', href: '/dashboard' }]
      : [{ label: 'Client Portal Login', href: '#login', isLoginTrigger: true }]),
    { label: 'Book Live Demo', href: '/contact', isCta: true }
  ];

  return (
    <>
      {/* Top Floating Glass Header Bar */}
      <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
        <div 
          className={`max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-7 py-3 rounded-full transition-all duration-500 pointer-events-auto border ${
            scrolled 
              ? 'bg-[#080a0f]/85 border-cyan-500/20 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)]' 
              : 'bg-black/50 border-white/10 backdrop-blur-xl shadow-2xl'
          }`}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3.5 group cursor-pointer"
            aria-label={`${COMPANY_NAME} Home`}
          >
            <div className="relative w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/50 group-hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <img
                src={LOGO_URL}
                alt={COMPANY_NAME}
                className="w-full h-full object-contain p-1.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://i.ibb.co/P2msKBd/Logo.png";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-[0.25em] text-white uppercase group-hover:text-cyan-400 transition-colors">
                ZEN<span className="font-light text-cyan-400">TRIXS</span>
              </span>
              <span className="text-[7px] text-zinc-400 font-mono font-bold uppercase tracking-[0.45em] -mt-1">
                Automation
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-9">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`transition-all font-semibold text-xs tracking-[0.18em] uppercase hover:text-cyan-400 hover:scale-105 active:scale-95 ${
                  location.pathname === item.href ? 'text-cyan-400 font-bold' : 'text-zinc-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Action Icons & Morphing Menu Button */}
          <div className="flex items-center gap-3.5">
            {/* Direct Login / Dashboard Icon on Desktop */}
            <div className="hidden sm:flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="px-3.5 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase hover:bg-cyan-500 hover:text-black transition-all"
                  >
                    {userRole === 'company' ? 'Portal' : 'Admin'}
                  </Link>
                  <button
                    onClick={onLogout}
                    className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Disconnect Session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all shadow-md"
                  title="Client Portal Login"
                  aria-label="Login to Client Portal"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Book Demo CTA Button */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase text-black bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>Book Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Motion Overlay Menu Button (Two-Phase Morph Hamburger) */}
            <button
              type="button"
              onClick={() => setIsOpen(prev => !prev)}
              aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isOpen}
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            >
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-300">
                {isOpen ? 'Close' : 'Menu'}
              </span>
              
              {/* Morphing Lines Container */}
              <div className="w-5 h-4 flex flex-col justify-between items-end relative">
                <span 
                  className={`h-0.5 bg-cyan-400 rounded-full transition-all duration-300 ${
                    isOpen ? 'w-5 translate-y-[7px] rotate-45' : 'w-5'
                  }`} 
                />
                <span 
                  className={`h-0.5 bg-cyan-400 rounded-full transition-all duration-300 ${
                    isOpen ? 'w-5 -translate-y-[7px] -rotate-45' : 'w-3.5'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN MOTION OVERLAY MENU */}
      <div 
        className={`fixed inset-0 z-40 bg-[#07090e]/95 backdrop-blur-2xl transition-all duration-700 flex flex-col justify-between p-6 sm:p-12 md:p-16 ${
          isOpen 
            ? 'opacity-100 pointer-events-auto scale-100' 
            : 'opacity-0 pointer-events-none scale-95'
        }`}
        style={{
          clipPath: isOpen ? 'circle(150% at calc(100% - 60px) 40px)' : 'circle(0% at calc(100% - 60px) 40px)'
        }}
      >
        {/* Ambient Top Spotlight */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top spacer for header bar */}
        <div className="h-16 shrink-0" />

        {/* Main Navigation Links with Stagger, Numbers & Hover Shift Dimming */}
        <nav className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full my-auto">
          <ul className="space-y-3 sm:space-y-4">
            {menuItems.map((item, index) => {
              const isHovered = hoveredIndex === index;
              const isDimmed = hoveredIndex !== null && !isHovered;

              return (
                <li
                  key={item.label}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="transition-all duration-300"
                  style={{
                    transform: isHovered ? 'translateX(18px)' : 'translateX(0)',
                    opacity: isDimmed ? 0.3 : 1
                  }}
                >
                  {item.isLoginTrigger ? (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setShowLogin(true);
                      }}
                      className="inline-flex items-baseline gap-4 text-left group cursor-pointer text-white"
                    >
                      <span className="font-mono text-xs sm:text-sm text-cyan-400 font-bold tabular-nums">
                        0{index + 1}
                      </span>
                      <span className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                        {item.label}
                      </span>
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className="inline-flex items-baseline gap-4 group cursor-pointer text-white"
                    >
                      <span className="font-mono text-xs sm:text-sm text-cyan-400 font-bold tabular-nums">
                        0{index + 1}
                      </span>
                      <span className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight transition-colors ${
                        item.isCta 
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:brightness-125' 
                          : 'group-hover:text-cyan-300'
                      }`}>
                        {item.label}
                      </span>
                      {item.isCta && (
                        <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Secondary Links & Contact Ribbon */}
        <div className="relative z-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto w-full text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-6">
            <a
              href={`https://wa.me/91${AI_BOT_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp AI (+91 {AI_BOT_NUMBER})</span>
            </a>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="hidden md:flex items-center gap-2 hover:text-cyan-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Call Direct</span>
            </a>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              onClick={() => setIsOpen(false)}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-zinc-500">&copy; 2026 Zentrixs Automation</span>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={(user, role) => {
            onLoginSuccess(user, role);
            navigate('/dashboard');
            setShowLogin(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
