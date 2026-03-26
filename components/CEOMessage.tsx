import React from 'react';
import { Quote, MessageCircle } from 'lucide-react';

const CEOMessage: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-[#010101] px-6 lg:px-8 relative z-10 w-full overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#00E599]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-20 reveal reveal-up">
        <div className="bg-[#050505] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-start group hover:border-white/20 transition-colors duration-500">
          
          {/* Subtle inside gradient reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>
          
          {/* Decorative Quote Icon Block */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#00E599] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,229,153,0.2)]">
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-black fill-current" />
            </div>
          </div>

          {/* Message Content */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">💬</span>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Message from the CEO</h3>
            </div>

            <blockquote className="text-zinc-300 text-lg md:text-xl lg:text-2xl leading-relaxed italic font-light mb-10">
              "At Zentrixs, we're not just selling software—we're building systems that solve genuine, on-ground business problems. Every system we design is <span className="text-[#00E599] font-medium not-italic">lightning-fast, intuitive, and customized</span>, ensuring business owners truly enjoy the journey towards automation and growth."
            </blockquote>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-[#1A1F2E] overflow-hidden flex items-center justify-center">
                {/* Fallback avatar if no image is available */}
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-black flex items-center justify-center text-white font-bold text-xl">
                  GS
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">Mr Gulshan Sahu</span>
                <span className="text-zinc-500 text-sm">CEO & Founder, Zentrixs</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CEOMessage;
