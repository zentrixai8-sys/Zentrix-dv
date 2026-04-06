
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EMAIL } from '../constants';

const LegalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm font-bold mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-16 shadow-sm font-sans text-gray-800 leading-relaxed space-y-20">
          
          {/* Privacy Policy Section */}
          <div id="privacy">
            <h1 className="text-3xl font-bold mb-2 text-black">ZENTRIXS Privacy Policy</h1>
            <p className="mb-8"><strong>Last Updated: 2026</strong></p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-bold mb-2 text-black">1. Introduction</h2>
                <p>ZENTRIXS values your privacy and is committed to protecting your personal and business data.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">2. Information We Collect</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name, phone number, email address</li>
                  <li>Business information</li>
                  <li>Messages sent via WhatsApp API</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">3. How We Use Data</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>To provide software and automation services</li>
                  <li>To communicate via WhatsApp API</li>
                  <li>To improve our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">4. Data Security</h2>
                <p>We use AES-256 encryption and secure servers to protect your data.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">5. Data Sharing</h2>
                <p>We do not sell or share your data. Data is only used for service delivery.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">6. WhatsApp API Usage</h2>
                <p>We use official Meta (Facebook) WhatsApp Business API for communication.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">7. User Rights</h2>
                <p>You can request access, update, or deletion of your data anytime.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 text-black">8. Contact Us</h2>
                <p>Email: <a href={`mailto:${EMAIL}`} className="text-blue-600 underline">{EMAIL}</a></p>
              </section>
            </div>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* Terms of Service Section */}
          <div id="terms">
            <h1 className="text-3xl font-bold mb-2 text-black">ZENTRIXS Terms of Service</h1>
            <p className="mb-8"><strong>Last Updated: 2026</strong></p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-bold mb-2 text-black">1. Acceptance of Terms</h2>
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
