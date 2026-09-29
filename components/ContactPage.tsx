import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  Shield,
  Bot
} from 'lucide-react';
import {
  COMPANY_NAME,
  PHONE_NUMBER,
  PHONE_NUMBER_2,
  AI_BOT_NUMBER,
  EMAIL,
  ADDRESS,
  CITY,
  STATE,
  PINCODE
} from '../constants';
import { addDemoBookingToSheet } from '../services/sheetService';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (form.name.length < 2) return 'Please enter your name.';
    if (!/^\d{10}$/.test(form.phone)) return 'Please enter a valid 10-digit phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (form.message.length < 10) return 'Please describe your inquiry in more detail (min 10 characters).';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valError = validate();
    if (valError) {
      setError(valError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await addDemoBookingToSheet(form);
      if (result.success) {
        setSuccess(true);
        setForm({ name: '', phone: '', email: '', message: '' });
      } else {
        setError('Failed to record inquiry. Please call us directly or message on WhatsApp.');
      }
    } catch {
      setError('Connection timeout. Please call or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-10 text-xs font-bold tracking-widest uppercase text-zinc-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            </li>
            <li className="text-zinc-600">/</li>
            <li className="text-blue-500" aria-current="page">Contact</li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Connect with Local Engineers</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Contact <span className="text-blue-500">{COMPANY_NAME}</span> in {CITY}
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed font-normal">
            Whether you need autonomous AI agents, WhatsApp Cloud API automation, custom CRM workflows, or a complete business automation consultation, our {CITY} team is ready to assist.
          </p>
        </header>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 items-start">
          {/* Left Column: Full NAP Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Live WhatsApp Bot Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-950/30 to-zinc-900 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">24/7 AI WhatsApp Assistant</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Inquiries &amp; Live Demos</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-medium">
                Chat with our AI bot or get connected to an on-duty solutions architect within seconds.
              </p>
              <a
                href={`https://wa.me/91${AI_BOT_NUMBER}?text=Hi%20Zentrixs,%20I%20am%20reaching%20out%20from%20your%20website`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                <Bot className="w-4 h-4" /> WhatsApp: +91 {AI_BOT_NUMBER}
              </a>
            </div>

            {/* Complete NAP Card */}
            <div className="bg-[#080808] border border-white/5 rounded-3xl p-8 space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider text-xs text-zinc-500 border-b border-white/5 pb-4">
                Official Business Information (NAP)
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Company Address</h4>
                  <p className="text-white text-sm font-semibold leading-relaxed">
                    {COMPANY_NAME}<br />
                    {ADDRESS}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {CITY}, {STATE} &bull; PIN: {PINCODE}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Direct Call (Support &amp; Sales)</h4>
                  <a href={`tel:${PHONE_NUMBER}`} className="text-white text-base font-bold font-mono hover:text-blue-400 transition-colors block">
                    +91 {PHONE_NUMBER}
                  </a>
                  {PHONE_NUMBER_2 && (
                    <a href={`tel:${PHONE_NUMBER_2}`} className="text-zinc-400 text-sm font-bold font-mono hover:text-blue-400 transition-colors block mt-1">
                      Alt: +91 {PHONE_NUMBER_2}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Electronic Mail</h4>
                  <a href={`mailto:${EMAIL}`} className="text-white text-sm font-semibold hover:text-blue-400 transition-colors break-all">
                    {EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Operating Hours</h4>
                  <p className="text-zinc-300 text-sm font-medium">
                    Monday &ndash; Saturday: 9:00 AM &ndash; 8:00 PM IST<br />
                    <span className="text-xs text-zinc-500">24/7 Emergency AMC Response for Contract Clients</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-[#080808] border border-white/5 rounded-3xl p-8 sm:p-12 relative shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">Request Technical Scoping Call</h3>
            <p className="text-zinc-400 text-sm mb-8">
              Fill out the form below. A senior engineer will review your project and get back to you within 2 business hours.
            </p>

            {success ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Request Received</h4>
                <p className="text-zinc-400 text-sm max-w-md">
                  Thank you! Our technical team in {CITY} has received your inquiry and will contact you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-8 text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-widest"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:border-blue-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:border-blue-500 outline-none transition-all text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    Business Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    Project Requirements / Services Needed *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your business automation requirements, AI chatbot needs, WhatsApp workflows, or custom software goals..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                  ></textarea>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Scoping Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Google Map */}
        <section aria-labelledby="location-map" className="rounded-3xl overflow-hidden border border-white/10 bg-[#080808]">
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 id="location-map" className="text-lg font-bold text-white">
                Find {COMPANY_NAME} on Google Maps
              </h2>
              <p className="text-zinc-400 text-xs mt-1">
                Ward no. 38, Bhainsthan Road, Near Nutan Rice Mill, {CITY}, {STATE} 492009
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Raipur,+Chhattisgarh+492009"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-400 hover:underline uppercase tracking-widest self-start sm:self-auto"
            >
              Open in Google Maps &rarr;
            </a>
          </div>

          <div className="aspect-[16/9] sm:aspect-[21/9] w-full">
            <iframe
              title={`Google Map Location of ${COMPANY_NAME} ${CITY}`}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118993.42878411219!2d81.56417770857738!3d21.251384351608677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dda23be28229%3A0x163ee1104ff9e7d!2sRaipur%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactPage;
