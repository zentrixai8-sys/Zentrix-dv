import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Lock, LogOut } from 'lucide-react';
import { NAV_ITEMS, COMPANY_NAME, LOGO_URL } from '../constants';
import LoginModal from './LoginModal';

interface HeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
  onLoginSuccess: (user: string) => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout, onLoginSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <>
      <nav aria-label="Main Navigation" className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-xl py-3 border-b border-white/5' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label={`${COMPANY_NAME} Home`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-white/10 group-hover:scale-105 transition-transform bg-zinc-900 flex items-center justify-center">
                  <img
                    src={LOGO_URL}
                    alt={`${COMPANY_NAME} - Business Automation & AI Agents Logo`}
                    width="48"
                    height="48"
                    className="w-full h-full object-contain p-2 transition-opacity duration-500"
                    onLoad={(e) => (e.target as HTMLImageElement).classList.add('loaded')}
                    onError={(e) => {
                      (e.target as HTMLImageElement).classList.add('loaded');
                      (e.target as HTMLImageElement).src = "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d47353039331e11a6839.svg";
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-[0.3em] text-white uppercase group-hover:text-blue-400 transition-colors">
                  ZEN<span className="font-extralight text-blue-500">TRIXS</span>
                </span>
                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.5em] mt-[-2px] group-hover:text-gray-300 transition-colors">
                  Automation
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-12">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`transition-all font-bold text-xs tracking-[0.2em] uppercase hover:scale-105 active:scale-95 ${
                    location.pathname === item.href ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex items-center gap-6 border-l border-white/10 pl-12">
                {isAdmin ? (
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-3 text-red-500 hover:text-red-400 text-[10px] font-black tracking-widest uppercase"
                  >
                    <LogOut className="w-4 h-4" /> Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLogin(true)}
                    className="p-3 glass rounded-xl text-blue-500 hover:text-white hover:bg-blue-600 transition-all border-white/10"
                    title="System Login"
                    aria-label="Admin Login"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                )}

                <Link
                  to="/contact"
                  className="px-8 py-3 rounded-xl text-xs font-black tracking-widest text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95 uppercase"
                >
                  Book Demo
                </Link>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-400 p-2 hover:text-white transition-colors"
              aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-black z-[10000] border-b border-white/5 transition-all duration-500 overflow-hidden shadow-2xl ${isOpen ? 'max-h-[100vh] opacity-100 py-10' : 'max-h-0 opacity-0'}`}>
          <div className="px-8 space-y-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block w-full text-left text-3xl font-black text-gray-500 hover:text-blue-500 uppercase tracking-tighter transition-colors"
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setShowLogin(true);
                setIsOpen(false);
              }}
              className="w-full py-4 glass text-blue-500 rounded-2xl font-black uppercase tracking-widest"
            >
              Admin Login
            </button>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-center w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl tracking-widest uppercase shadow-2xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={(user) => {
            onLoginSuccess(user);
            navigate('/dashboard');
            setShowLogin(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
