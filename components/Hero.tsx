import React from 'react';
import { ArrowRight, PlayCircle, Zap, ShieldCheck, Activity, Users, Clock, ArrowDownToLine, Box, Cpu, Bot, TrendingUp } from 'lucide-react';
import { PHONE_NUMBER, SOCIAL_LINKS } from '../constants';
import AutoImageSequence from './AutoImageSequence';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[#020202]">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Auto-Playing AI Robot Video */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl reveal reveal-right bg-black">
            {/* Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10"></div>
            
            <AutoImageSequence
              src="/video-frames/"
              frameCount={192}
              fps={30}
              className="w-full h-full scale-[1.05]"
            />

            {/* Cyan glowing overlay around borders */}
            <div className="absolute inset-0 border border-cyan-500/20 rounded-3xl pointer-events-none z-20 shadow-[inset_0_0_50px_rgba(6,182,212,0.1)]"></div>

            {/* Crawlable Video element for SEO / Screen Readers */}
            <video
              className="sr-only"
              controls
              playsInline
              preload="none"
              poster="/images/website-and-software-development.webp"
              aria-label="Website and software development video demonstration"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
                type="video/mp4"
              />
            </video>

          </div>

          {/* Right Side: Hero Content */}
          <div className="flex flex-col items-start reveal reveal-left">
            {/* Top Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-8">
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-zinc-300 font-medium">AI-Powered Automation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold text-white leading-[1.1] mb-6 tracking-tight">
              ZENTRIXS <br />
              <span className="text-blue-500">Automation</span>
            </h1>

            {/* Ultra-Premium Subtitle focused on Custom Software, Autopilot Mode & Business Automation */}
            <p className="text-zinc-400 text-lg md:text-xl font-normal leading-[1.65] max-w-xl mb-10 tracking-[-0.015em]">
              We engineer <span className="text-white font-medium">custom software</span> that runs your company on <span className="text-white font-medium">autopilot mode</span>—true <span className="text-white font-medium">Business Automation</span> built to capture leads, execute operations, and scale 24/7 without manual effort.
            </p>

            {/* SEO Backend Crawlable Block (Hidden from visible UI, indexed by Googlebot & SERP OK) */}
            <div className="sr-only">
              <h2>Custom Software and Business Automation Company in Raipur</h2>
              <p>
                Zentrixs engineers custom software to run companies on autopilot mode through end-to-end business automation. Leading website and software development company delivering software and website development, custom software and website development, ai software website and app development company solutions, and software development and website design across India.
              </p>
              <ul>
                <li>Custom Software and Website Development Architecture</li>
                <li>Company on Autopilot Mode with Autonomous AI Agents</li>
                <li>End-to-End Business Automation and CRM Pipelines</li>
                <li>AI Software Website and App Development Company Solutions</li>
                <li>Website Designing and Software Development Standards</li>
                <li>Software and Website Development Services &amp; Cloud Tools</li>
                <li>Premier Website and Software Development Company India</li>
              </ul>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap gap-4 items-center mb-16">
              <a
                href="/contact"
                onClick={(e) => {
                  const contactEl = document.getElementById('contact');
                  if (contactEl) {
                    e.preventDefault();
                    contactEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm tracking-wide transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                BOOK A DEMO <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => window.open(SOCIAL_LINKS.youtube, '_blank')}
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl font-bold text-sm tracking-wide text-zinc-300 transition-all flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.06]"
              >
                <PlayCircle className="w-4 h-4 text-red-500" /> WATCH VIDEO
              </button>
            </div>

            {/* 3 Pillars: Custom Software, Autopilot Mode, Business Automation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {/* Card 1: Custom Software */}
              <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">Custom Software<br/>Engineering</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">Bespoke software tailored to your company's exact operational workflows.</p>
              </div>

              {/* Card 2: Autopilot Mode */}
              <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bot className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">Company on<br/>Autopilot Mode</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">Autonomous AI agents &amp; bots that sell, support &amp; follow up 24/7 without delays.</p>
              </div>

              {/* Card 3: Business Automation */}
              <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">End-to-End<br/>Business Automation</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">Seamless sync across leads, CRM, billing &amp; WhatsApp to scale revenue automatically.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Stats Strip */}
        <div className="mt-12 w-full lg:w-4/5 mx-auto bg-black border border-white/5 rounded-3xl p-6 md:p-8 flex flex-wrap justify-between items-center gap-6 reveal reveal-up shadow-2xl relative z-20">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <Box className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">500+</p>
              <p className="text-zinc-500 text-xs">Automations Delivered</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/5"></div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">98%</p>
              <p className="text-zinc-500 text-xs">Accuracy & Uptime</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/5"></div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <ArrowDownToLine className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">40%</p>
              <p className="text-zinc-500 text-xs">Avg. Cost Reduction</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/5"></div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">24/7</p>
              <p className="text-zinc-500 text-xs">AI Monitoring</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
