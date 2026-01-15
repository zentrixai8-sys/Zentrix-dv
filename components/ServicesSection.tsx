
import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { SERVICES } from '../constants';
import { Service } from '../types';

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  const IconComponent = (Icons as any)[service.icon] || Icons.Zap;
  
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-[reveal-up_0.5s_ease-out]">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <Icons.X className="w-6 h-6" />
        </button>

        <div className="p-12">
          <div className="bg-[#111] w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border border-white/5">
            <IconComponent className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">
            {service.title}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium">
            {service.details}
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-10">
            {service.specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-500 font-bold uppercase tracking-widest">
                <Icons.Check className="w-4 h-4 text-blue-500" />
                {spec}
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              onClose();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 transition-all active:scale-95"
          >
            Start Integration
          </button>
        </div>
      </div>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="services" className="py-32 bg-[#020202] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-24 reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20 mb-6">
            <Icons.Cpu className="w-3 h-3 text-blue-500" />
            <span className="text-blue-500 font-black tracking-[0.4em] text-[9px] uppercase">Service Architecture</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 italic uppercase">
            Deploy <span className="text-zinc-800">Nodes.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Zap;
            return (
              <div 
                key={index}
                onClick={() => setSelectedService(service)}
                className={`reveal reveal-up stagger-${(index % 3) + 1} bg-[#080808] p-10 rounded-[3rem] border border-white/5 transition-all duration-500 cursor-pointer group flex flex-col h-full hover:border-blue-500/20 shadow-2xl relative overflow-hidden`}
              >
                {/* Top Terminal Icon - Matches Screenshot */}
                <div className="bg-[#0f0f0f] w-20 h-20 rounded-[1.8rem] flex items-center justify-center mb-16 border border-white/5 group-hover:bg-[#151515] transition-colors">
                  <IconComponent className="w-8 h-8 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <div className="flex-grow">
                  <h4 className="text-3xl font-black text-white mb-10 tracking-tighter uppercase italic leading-[1.1] max-w-[200px]">
                    {service.title}
                  </h4>
                  <p className="text-zinc-600 text-[11px] leading-relaxed font-bold uppercase tracking-[0.15em] mb-10">
                    {service.description}
                  </p>
                </div>
                
                <div className="pt-8 border-t border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.6)] animate-pulse"></div>
                    <span className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase group-hover:text-blue-400 transition-colors">EXPAND NODE</span>
                  </div>
                  <Icons.Plus className="w-5 h-5 text-zinc-700 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </section>
  );
};

export default ServicesSection;
