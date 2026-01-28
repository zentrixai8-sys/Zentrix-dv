
import React, { useState, useEffect } from 'react';
import { Linkedin, Twitter, Mail, Phone, Instagram, Facebook, ArrowRight, Globe } from 'lucide-react';
import { COMPANY_NAME, TAGLINE, PHONE_NUMBER, PHONE_NUMBER_2, EMAIL, LOGO_URL } from '../constants';
import { fetchSettingsFromSheet } from '../services/sheetService';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [socialLinks, setSocialLinks] = useState({
    facebook: '#',
    instagram: '#',
    linkedin: '#',
    twitter: '#',
    whatsapp: '#'
  });

  useEffect(() => {
    const loadSocial = async () => {
      const settings = await fetchSettingsFromSheet();
      if (settings) {
        setSocialLinks({
          facebook: settings.facebook || '#',
          instagram: settings.instagram || '#',
          linkedin: settings.linkedin || '#',
          twitter: settings.twitter || '#',
          whatsapp: settings.whatsapp || '#'
        });
      }
    };
    loadSocial();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If element not found (e.g., on another page), go home first
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const socialIcons = [
    { Icon: Twitter, url: socialLinks.twitter },
    { Icon: Facebook, url: socialLinks.facebook },
    { Icon: Instagram, url: socialLinks.instagram },
    { Icon: Linkedin, url: socialLinks.linkedin },
    { Icon: Globe, url: socialLinks.whatsapp },
  ];

  return (
    <footer className="bg-[#020205] text-white pt-32 pb-16 relative overflow-hidden border-t border-white/[0.05]">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '80px 80px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">

          <div className="space-y-8">
            <div className="flex items-center gap-4 group cursor-pointer w-fit" onClick={() => navigate('/')}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-lg opacity-20"></div>
                <div className="relative w-14 h-14 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 flex items-center justify-center">
                  <img
                    src={LOGO_URL}
                    alt={COMPANY_NAME}
                    className="w-10 h-10 object-contain transition-opacity duration-500"
                    onLoad={(e) => (e.target as HTMLImageElement).classList.add('loaded')}
                    onError={(e) => (e.target as HTMLImageElement).classList.add('loaded')}
                  />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black tracking-[0.2em] block leading-none text-white uppercase italic">ZEN<span className="text-blue-500">TRIX</span></span>
                <span className="text-[9px] text-blue-500/60 uppercase tracking-[0.4em] font-black mt-2 block">{TAGLINE}</span>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-semibold uppercase tracking-tight">
              Hyper-automated ecosystem protocols for the modern enterprise. Scale without human bottlenecks at {COMPANY_NAME}.
            </p>

            <div className="flex gap-4">
              {socialIcons.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/[0.02] hover:bg-blue-600 border border-white/5 rounded-2xl flex items-center justify-center transition-all group"
                >
                  <social.Icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:pl-16">
            <h4 className="text-white font-black text-xs mb-10 tracking-[0.3em] uppercase opacity-50">Navigation</h4>
            <ul className="space-y-5">
              {['Services', 'Contact'].map((item) => (
                <li key={item}>
                  <button onClick={() => scrollToSection(item.toLowerCase())} className="text-gray-500 hover:text-white text-sm font-black transition-all hover:translate-x-2 flex items-center gap-2 group uppercase tracking-widest">
                    <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                    {item}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('/privacy')} className="text-gray-500 hover:text-white text-sm font-black transition-all hover:translate-x-2 flex items-center gap-2 group uppercase tracking-widest">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="text-gray-500 hover:text-white text-sm font-black transition-all hover:translate-x-2 flex items-center gap-2 group uppercase tracking-widest">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs mb-10 tracking-[0.3em] uppercase opacity-50">Admin</h4>
            <ul className="space-y-5">
              <li>
                <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-white text-sm font-black transition-all hover:translate-x-2 flex items-center gap-2 group uppercase tracking-widest">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-10">
            <h4 className="text-white font-black text-xs mb-10 tracking-[0.3em] uppercase opacity-50">Access Point</h4>
            <div className="space-y-6">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-4 group cursor-pointer bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all">
                <Phone className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-black text-white tracking-widest uppercase">{PHONE_NUMBER}</span>
              </a>
              <a href={`tel:${PHONE_NUMBER_2}`} className="flex items-center gap-4 group cursor-pointer bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all">
                <Phone className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-black text-white tracking-widest uppercase">{PHONE_NUMBER_2}</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-4 group cursor-pointer bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-violet-500/50 transition-all">
                <Mail className="w-5 h-5 text-violet-500" />
                <span className="text-sm font-black text-white tracking-widest uppercase">Connect Node</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] text-center md:text-left">
            <p>© {new Date().getFullYear()} <span className="text-white">ZENTRIX CORE</span>. SECURED PROTOCOL.</p>
            <p className="mt-2 opacity-50 tracking-[0.3em]">DESIGNED & DEVELOPED BY <span className="text-blue-500">DEEPAK SAHU</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Global Ops: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
