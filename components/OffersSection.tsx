import React from 'react';
import LanyardPass from './LanyardPass';

const OffersSection: React.FC = () => {
  return (
    <section id="vip-pass" className="relative w-full min-h-[85vh] md:min-h-[90vh] bg-[#0c0d11] overflow-hidden flex flex-col justify-between border-y border-white/5 select-none">
      {/* Studio Radial Vignette Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 35%, rgba(45, 52, 66, 0.45) 0%, rgba(18, 20, 26, 0.85) 45%, #08090c 100%)'
        }}
      />

      {/* Top Header Labels */}
      <div className="relative z-10 w-full px-6 md:px-12 pt-8 flex items-center justify-between text-[11px] md:text-xs font-mono tracking-[0.25em] text-zinc-400/80 uppercase pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>LANYARD PASS</span>
        </div>
        <div>
          <span>DRAG • THROW • FLIP</span>
        </div>
      </div>

      {/* 3D Lanyard Pass Interactive Canvas (Full Page Width) */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center -mt-6">
        <LanyardPass
          attendeeName="BuiltByZentrixs"
          ticketType="Enterprise AI Architect"
          ticketNumber="A-0842"
          eventName="IN A ZENTRIXS SESSION"
          eventDate="12 Mar 2027"
          barcodeValue="NDS2027A0842"
          strapText="BUILTBYZENTRIXS"
          paper="#121418"
          ink="#F2F1EC"
          accent="#5B6B86"
          strapColor="#1A1A1A"
          strapStyle="flat"
          photoSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
          logoSrc="https://i.ibb.co/P2msKBd/Logo.png"
          size={460}
          className="w-full h-full min-h-[640px] md:min-h-[720px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Bottom Minimal Footer Links */}
      <div className="relative z-10 w-full px-6 md:px-12 pb-8 flex items-center justify-between text-[10px] md:text-[11px] font-mono tracking-widest text-zinc-500 uppercase pointer-events-none">
        <div>
          <span>⚡ ZENTRIXS ENTERPRISE SYSTEM</span>
        </div>
        <div>
          <span>LEVEL 01 • VERIFIED VIP ACCESS</span>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
