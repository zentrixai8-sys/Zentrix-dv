
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie, Sliders, Shield } from 'lucide-react';
import { EMAIL, COMPANY_NAME } from '../constants';
import { openCookieModal } from './CookieConsentModal';

const LegalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm font-bold mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="text-3xl sm:text-4xl font-black mb-8 text-black">ZENTRIXS Legal Protocols: Privacy, Cookies &amp; Terms</h1>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-14 shadow-sm font-sans text-gray-800 leading-relaxed space-y-16">
          
          {/* Cookie Preferences Quick Action Banner */}
          <div className="p-6 rounded-2xl bg-cyan-50 border border-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Manage Cookie Preferences</h2>
                <p className="text-xs text-gray-600">Customize or revoke cookie permissions anytime.</p>
              </div>
            </div>
            <button
              onClick={openCookieModal}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Change Settings</span>
            </button>
          </div>

          {/* Privacy Policy Section */}
          <div id="privacy">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-black">ZENTRIXS Privacy Policy</h2>
            <p className="mb-8"><strong>Last Updated: 2026</strong></p>

            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-bold mb-2 text-black">1. Introduction</h3>
                <p>ZENTRIXS values your privacy and is committed to protecting your personal and business data.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2 text-black">2. Information We Collect</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name, phone number, email address</li>
                  <li>Business information</li>
                  <li>Messages sent via WhatsApp API</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2 text-black">3. How We Use Data</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>To provide software and automation services</li>
                  <li>To communicate via WhatsApp API</li>
                  <li>To improve our services</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2 text-black">4. Data Security</h3>
                <p>We use AES-256 encryption and secure servers to protect your data.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2 text-black">5. Data Sharing</h3>
                <p>We do not sell or share your data. Data is only used for service delivery.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2 text-black">6. WhatsApp API Usage</h3>
                <p>We use official Meta (Facebook) WhatsApp Business API for communication.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2 text-black">7. User Rights</h3>
                <p>You can request access, update, or deletion of your data anytime.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2 text-black">8. Contact Us</h3>
                <p>Email: <a href={`mailto:${EMAIL}`} className="text-blue-600 underline">{EMAIL}</a></p>
              </section>
            </div>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* Cookie Policy Section */}
          <div id="cookies">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-black">ZENTRIXS Cookies Policy</h2>
            <p className="mb-8"><strong>Last Updated: 2026</strong></p>

            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-bold mb-2 text-black">1. What Are Cookies?</h3>
                <p>Cookies and local browser storage are small data files placed on your device to ensure secure authentication, remember preferences, and analyze platform performance.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2 text-black">2. Categories of Cookies We Use</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Strictly Necessary:</strong> Essential for user session security, CSRF protection, and API routing.</li>
                  <li><strong>Performance &amp; Analytics:</strong> Anonymous metrics to understand loading speeds, system errors, and visitor flow.</li>
                  <li><strong>Functional:</strong> Saves your portal theme (Dark/Light mode) and client dashboard filters.</li>
                  <li><strong>Marketing:</strong> Allows us to share service updates and WhatsApp AI agent feature demos.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2 text-black">3. How to Manage Cookies</h3>
                <p className="mb-4">You have full control over optional cookies. You can click the button below or in the footer anytime to update your choices:</p>
                <button
                  onClick={openCookieModal}
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open Cookie Preferences</span>
                </button>
              </section>
            </div>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* Terms of Service Section */}
          <div id="terms">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-black">ZENTRIXS Terms of Service</h2>
            <p className="mb-8"><strong>Last Updated: 2026</strong></p>

            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-bold mb-2 text-black">1. Acceptance of Terms</h3>
                <p>By using ZENTRIXS services, you agree to comply with and be bound by these Terms of Service.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">2. Description of Services</h2>
                <p>We provide automation software, web development, and WhatsApp API integration services to help businesses grow.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">3. User Conduct</h2>
                <p>You agree to use our services legally and provide accurate information for system configuration.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">4. Meta Business Policies</h2>
                <p>Usage of WhatsApp features must comply with the official Meta Business Messaging Policy.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">5. Limitation of Liability</h2>
                <p>ZENTRIXS is not liable for business outcomes or changes in third-party API policies (e.g., Meta/Google).</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">6. Termination</h2>
                <p>We reserve the right to suspend or terminate services for any violation of these terms.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">7. Contact Information</h2>
                <p>For support or legal inquiries, email: <a href={`mailto:${EMAIL}`} className="text-blue-600 underline">{EMAIL}</a></p>
              </section>
            </div>
          </div>

          <p className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500">© 2026 ZENTRIXS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
