
import React from 'react';
import { ArrowLeft, Shield, FileText, Lock, Globe } from 'lucide-react';
import { COMPANY_NAME, EMAIL, TAGLINE } from '../constants';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Quantum Grid */}
      <div className="absolute inset-0 quantum-grid opacity-20 z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
        </button>

        <div className="glass border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-3xl bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-500">
              {isPrivacy ? <Shield className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                {isPrivacy ? 'Privacy' : 'Terms'} <span className="font-thin text-gray-500">Node.</span>
              </h1>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.4em] mt-3">Protocol Version 2.5.0</p>
            </div>
          </div>

          <div className="space-y-10 text-gray-400 text-sm md:text-base leading-relaxed font-medium">
            <section className="space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-500" /> Executive Summary
              </h3>
              <p className="border-l-2 border-blue-500 pl-6 py-2 bg-blue-500/5 italic">
                This document defines the operational parameters of the {COMPANY_NAME} ecosystem. By engaging with our nodes, you agree to the protocols outlined herein.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                <Lock className="w-4 h-4 text-blue-500" /> Data Integrity & Privacy
              </h3>
              <p>
                {isPrivacy 
                  ? "Your enterprise data is encrypted using AES-256 protocols. ZENTRIX does not commercialize user data. All system links and AI training data are localized to your secure business environment." 
                  : "Usage of ZENTRIX services requires adherence to our fair-use policy. Systems are monitored for optimal uptime and security compliance to prevent unauthorized node access."}
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-500" /> Engagement Protocols
              </h3>
              <p>
                Services provided by ZENTRIX (Custom Software, AI Automation, Cloud Nodes) are governed by specific project-level Master Service Agreements. This global protocol serves as the base layer for all interactions.
              </p>
              <ul className="list-disc pl-6 space-y-2 opacity-80">
                <li>Secure API endpoint management.</li>
                <li>Zero-knowledge architecture for sensitive credentials.</li>
                <li>Automated threat detection and resolution.</li>
              </ul>
            </section>

            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Direct Contact Node:</p>
                <a href={`mailto:${EMAIL}`} className="text-blue-500 font-black tracking-widest text-sm uppercase hover:text-blue-400 transition-colors">
                  {EMAIL}
                </a>
              </div>
              <div className="text-[10px] text-gray-700 font-black uppercase tracking-widest text-right">
                © {new Date().getFullYear()} {COMPANY_NAME} CORE.<br />
                All Nodes Secured.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
