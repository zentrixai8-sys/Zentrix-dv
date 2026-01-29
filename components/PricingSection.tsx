
import React from 'react';
import { PRICING_PLANS } from '../constants';
import { Check, Shield, Zap, Box, Bot } from 'lucide-react';

const PricingSection: React.FC = () => {
    return (
        <section id="pricing" className="py-32 bg-[#020202] relative border-t border-white/5">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center mb-24 reveal reveal-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/20 mb-6">
                        <Zap className="w-3 h-3 text-green-500" />
                        <span className="text-green-500 font-black tracking-[0.4em] text-[9px] uppercase">Transparent Pricing</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 italic uppercase">
                        Choose Your <span className="text-blue-500">Upgrade.</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-medium tracking-widest uppercase max-w-xl">
                        Scalable automation packages designed for growing businesses.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {PRICING_PLANS.map((plan, index) => {
                        const isPopular = plan.recommended;
                        return (
                            <div
                                key={index}
                                className={`reveal reveal-up stagger-${index + 1} relative group ${isPopular ? 'scale-105 z-10' : ''}`}
                            >
                                {/* Popular Badge */}
                                {isPopular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(37,99,235,0.5)] z-20 border border-white/10">
                                        Most Popular
                                    </div>
                                )}

                                <div className={`
                  relative bg-[#080808] p-10 rounded-[2.5rem] border transition-all duration-300 overflow-hidden
                  ${isPopular
                                        ? 'border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.1)]'
                                        : 'border-white/5 hover:border-white/10'
                                    }
                `}>
                                    {/* Background Glow */}
                                    {isPopular && (
                                        <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
                                    )}

                                    <div className="mb-8">
                                        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-white tracking-tighter italic">{plan.price}</span>
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">/ one-time</span>
                                        </div>
                                    </div>

                                    <div className="space-y-5 mb-10">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isPopular ? 'bg-blue-600/20' : 'bg-white/5'}`}>
                                                    <Check className={`w-3 h-3 ${isPopular ? 'text-blue-500' : 'text-gray-500'}`} />
                                                </div>
                                                <span className="text-sm text-gray-400 font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                        className={`
                      w-full py-5 rounded-xl text-xs font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group/btn
                      ${isPopular
                                                ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-500'
                                                : 'bg-white/5 text-white border border-white/5 hover:bg-white/10'
                                            }
                    `}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Get Started <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
