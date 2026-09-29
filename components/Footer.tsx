import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowRight, Bot, MapPin } from 'lucide-react';
import {
  COMPANY_NAME,
  TAGLINE,
  PHONE_NUMBER,
  PHONE_NUMBER_2,
  AI_BOT_NUMBER,
  EMAIL,
  ADDRESS,
  CITY,
  STATE,
  PINCODE,
  LOGO_URL,
  SOCIAL_LINKS,
  SERVICES
} from '../constants';
import { fetchSettingsFromSheet } from '../services/sheetService';

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const YouTubeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
  </svg>
);

const Footer: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState({
    instagram: SOCIAL_LINKS.instagram,
    facebook: SOCIAL_LINKS.facebook,
    whatsapp: `https://wa.me/91${PHONE_NUMBER}`,
    youtube: SOCIAL_LINKS.youtube || '#',
    linkedin: SOCIAL_LINKS.linkedin,
    twitter: SOCIAL_LINKS.twitter
  });

  useEffect(() => {
    const loadSocial = async () => {
      const settings = await fetchSettingsFromSheet();
      if (settings) {
        setSocialLinks({
          instagram: settings.instagram || SOCIAL_LINKS.instagram,
          facebook: settings.facebook || SOCIAL_LINKS.facebook,
          whatsapp: settings.whatsapp || `https://wa.me/91${PHONE_NUMBER}`,
          youtube: settings.youtube || SOCIAL_LINKS.youtube || '#',
          linkedin: settings.linkedin || SOCIAL_LINKS.linkedin,
          twitter: settings.twitter || SOCIAL_LINKS.twitter
        });
      }
    };
    loadSocial();
  }, []);

  const socialIcons = [
    { Icon: InstagramIcon, url: socialLinks.instagram, label: 'Instagram', hoverClass: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:border-pink-500/50' },
    { Icon: FacebookIcon, url: socialLinks.facebook, label: 'Facebook', hoverClass: 'hover:bg-[#1877F2] hover:border-[#1877F2]/50' },
    { Icon: WhatsAppIcon, url: socialLinks.whatsapp, label: `WhatsApp (${PHONE_NUMBER})`, hoverClass: 'hover:bg-[#25D366] hover:border-[#25D366]/50 shadow-[0_0_15px_rgba(37,211,102,0.2)]' },
    { Icon: YouTubeIcon, url: socialLinks.youtube, label: 'YouTube (@zentrixsraipur)', hoverClass: 'hover:bg-[#FF0000] hover:border-[#FF0000]/50' },
    { Icon: LinkedInIcon, url: socialLinks.linkedin, label: 'LinkedIn', hoverClass: 'hover:bg-[#0A66C2] hover:border-[#0A66C2]/50' },
    { Icon: TwitterIcon, url: socialLinks.twitter, label: 'Twitter / X', hoverClass: 'hover:bg-sky-500 hover:border-sky-500/50' },
  ];

  return (
    <footer className="bg-[#020205] text-white pt-24 pb-16 relative overflow-hidden border-t border-white/[0.05]">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '80px 80px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 mb-20">

          {/* Col 1: Brand & Bio & NAP (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-4 group w-fit" aria-label={`${COMPANY_NAME} Home`}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-lg opacity-20"></div>
                <div className="relative w-14 h-14 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 flex items-center justify-center">
                  <img
                    src={LOGO_URL}
                    alt={`${COMPANY_NAME} Logo`}
                    width="40"
                    height="40"
                    loading="lazy"
                    className="w-10 h-10 object-contain transition-opacity duration-500"
                    onLoad={(e) => (e.target as HTMLImageElement).classList.add('loaded')}
                    onError={(e) => (e.target as HTMLImageElement).classList.add('loaded')}
                  />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black tracking-[0.2em] block leading-none text-white uppercase italic">
                  ZEN<span className="text-blue-500">TRIXS</span>
                </span>
                <span className="text-[9px] text-blue-500/80 uppercase tracking-[0.4em] font-black mt-2 block">
                  {TAGLINE}
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-medium">
              Business automation, autonomous AI agents, WhatsApp Cloud API bots, custom CRM, and billing software in {CITY}, {STATE}.
            </p>

            {/* Identical NAP in footer */}
            <div className="pt-2 space-y-2.5 text-xs text-zinc-400 border-t border-white/5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block font-semibold">{COMPANY_NAME}</strong>
                  {ADDRESS}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`tel:${PHONE_NUMBER}`} className="hover:text-white font-mono font-bold">
                  +91 {PHONE_NUMBER}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`mailto:${EMAIL}`} className="hover:text-white">
                  {EMAIL}
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {socialIcons.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className={`w-10 h-10 bg-white/[0.04] ${social.hoverClass} border border-white/10 rounded-xl flex items-center justify-center transition-all duration-300 group hover:scale-105 active:scale-95`}
                >
                  <social.Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Company Navigation (Span 2) */}
          <div className="lg:col-span-2 lg:pl-4">
            <h4 className="text-white font-black text-xs mb-8 tracking-[0.25em] uppercase opacity-60">Company</h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Blog &amp; Insights
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy &amp; Terms
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-500 hover:text-zinc-300 transition-colors text-xs flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Links (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-black text-xs mb-8 tracking-[0.25em] uppercase opacity-60">Services in {CITY}</h4>
            <ul className="space-y-3 text-xs font-semibold">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-2.5 h-2.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    <span className="truncate">{s.shortTitle || s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Contact & WhatsApp (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-black text-xs mb-8 tracking-[0.25em] uppercase opacity-60">Immediate Access</h4>

            <a
              href={`https://wa.me/91${AI_BOT_NUMBER}?text=Hi%20Zentrixs,%20I%20need%20IT%20services%20in%20${CITY}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3.5 bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] group"
            >
              <Bot className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
              <div>
                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  24/7 WhatsApp AI Bot
                </div>
                <span className="text-xs font-black text-white font-mono tracking-wider block mt-0.5">
                  +91 {AI_BOT_NUMBER}
                </span>
              </div>
            </a>

            <a
              href={`tel:${PHONE_NUMBER}`}
              className="flex items-center gap-3.5 bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-blue-500/40 transition-all group"
            >
              <Phone className="w-5 h-5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Directly</div>
                <span className="text-xs font-black text-white font-mono tracking-wider block mt-0.5">
                  +91 {PHONE_NUMBER}
                </span>
              </div>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-3.5 bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-violet-500/40 transition-all group"
            >
              <Mail className="w-5 h-5 text-violet-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="min-w-0">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Node</div>
                <span className="text-xs font-bold text-white truncate block mt-0.5">
                  {EMAIL}
                </span>
              </div>
            </a>
          </div>

        </div>

        <div className="pt-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-medium">
          <p>&copy; {new Date().getFullYear()} <strong className="text-white font-semibold">{COMPANY_NAME} CORE</strong>. All rights reserved. Registered in {CITY}, {STATE}, India.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Systems Online &bull; Raipur Support Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
