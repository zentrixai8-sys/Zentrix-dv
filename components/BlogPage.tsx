import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Bot,
  MessageCircle,
  Users,
  FileText,
  PhoneCall,
  ChevronRight
} from 'lucide-react';
import { COMPANY_NAME, CITY, PHONE_NUMBER } from '../constants';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  relatedService: { title: string; url: string };
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'autonomous-ai-agents-sales-support-raipur',
    title: `How Autonomous AI Agents are Transforming Customer Sales & Support in ${CITY}`,
    excerpt: `Discover how Raipur companies are deploying bilingual LLM-powered AI business agents that answer customer questions, qualify leads, and book sales meetings 24/7.`,
    date: 'September 2026',
    author: 'Deepak Sahu',
    readTime: '6 min read',
    category: 'AI Agents',
    relatedService: {
      title: 'AI Business Agents & Autonomous Chatbots',
      url: '/services/ai-business-chatbot'
    },
    content: [
      `When prospective buyers in ${CITY} reach out at 9 PM on your website or WhatsApp asking about pricing, models, or service availability, waiting until 10 AM the next day to reply guarantees that 50% of those leads will buy from a competitor instead.`,
      `Autonomous AI agents change the equation completely. Unlike rigid legacy chatbots with static buttons, modern generative AI agents understand context and nuances in both English and Hindi. They search your company knowledge base in real-time, explain product differences, address objections, and capture the prospect's verified contact details.`,
      `Raipur real estate firms, coaching academies, and clinics deploying Zentrixs AI agents consistently report capturing 40% more qualified customer leads without hiring additional clerical staff.`
    ]
  },
  {
    id: 'post-2',
    slug: 'whatsapp-automation-vs-manual-messaging',
    title: `WhatsApp Automation vs Manual Messaging: How to Handle 1,000+ Inquiries Daily`,
    excerpt: `Learn how official Meta WhatsApp Business Cloud API workflows help growing enterprises automate catalog delivery, order confirmations, and bulk promotional broadcasts.`,
    date: 'September 2026',
    author: 'Deepak Sahu',
    readTime: '5 min read',
    category: 'WhatsApp',
    relatedService: {
      title: 'WhatsApp Automation & Conversational Bots',
      url: '/services/whatsapp-automation'
    },
    content: [
      `WhatsApp is India's default communication channel. However, relying on a single employee typing replies on a physical mobile phone leads to slow response times, missed messages, and customer frustration.`,
      `Official Meta WhatsApp Business Cloud API automation allows multiple team members to reply from the same business number simultaneously. Automated interactive menus allow users to self-serve by browsing PDF catalogs, checking order statuses, and accessing UPI payment links in seconds.`,
      `With verified 98% message open rates, automated WhatsApp broadcasts yield up to 5x higher engagement compared to traditional SMS or email campaigns.`
    ]
  },
  {
    id: 'post-3',
    slug: 'custom-crm-vs-spreadsheets',
    title: `Custom CRM vs Spreadsheets: Why Excel is Costing Your Sales Team Deals`,
    excerpt: `Managing prospective buyer leads in Excel sheets causes 30% of warm leads to be forgotten. Explore how automated lead management transforms sales conversion.`,
    date: 'September 2026',
    author: 'Deepak Sahu',
    readTime: '5 min read',
    category: 'CRM Software',
    relatedService: {
      title: 'Custom CRM & Automated Lead Pipelines',
      url: '/services/crm-lead-management'
    },
    content: [
      `Spreadsheets were designed for accounting numbers, not dynamic sales relationship management. When sales reps maintain personal Excel sheets, duplicate calls happen, follow-up dates are missed, and when an employee resigns, your valuable customer contacts leave with them.`,
      `A custom centralized CRM funnels all inbound website forms, phone inquiries, and WhatsApp leads into a single live dashboard. Timed reminders notify sales agents when follow-ups are due, and managers can monitor deal stages in real-time.`,
      `Companies transitioning from manual registers to a centralized CRM in ${CITY} consistently report a 25% to 40% improvement in lead-to-deal conversion rates.`
    ]
  },
  {
    id: 'post-4',
    slug: 'ai-voice-calling-virtual-receptionist-guide',
    title: `The Power of AI Voice Calling Agents: Automated Inbound & Outbound Phone Support`,
    excerpt: `Explore how neural bilingual voice agents answer incoming calls with zero latency and execute automated follow-up phone calls to warm prospects.`,
    date: 'September 2026',
    author: 'Deepak Sahu',
    readTime: '6 min read',
    category: 'Voice AI',
    relatedService: {
      title: 'AI Voice Calling & Virtual Receptionist Agents',
      url: '/services/ai-voice-agents'
    },
    content: [
      `Busy customer support desks and sales lines often force callers to wait on hold or hit busy tones. Zentrixs builds next-generation AI voice calling agents that pick up phone calls in less than two rings with natural, human-like voice synthesis.`,
      `Our voice agents fluently understand conversational English, Hindi, and colloquial Hinglish. They answer questions regarding your office location, pricing, and consultation timings, while transferring priority calls to human managers in real-time.`,
      `Furthermore, automated outbound voice bots can call newly submitted web leads within 2 minutes of inquiry, dramatically increasing contact rates before the lead cools down.`
    ]
  },
  {
    id: 'post-5',
    slug: 'gst-billing-inventory-software-automation',
    title: `How Automated GST Billing & Inventory Software Cuts Checkout Lines by 60%`,
    excerpt: `Discover how modern barcode billing, live stock alerts, and automated customer credit (Khata) tracking eliminate discrepancies for retail and wholesale merchants.`,
    date: 'September 2026',
    author: 'Deepak Sahu',
    readTime: '5 min read',
    category: 'Billing Software',
    relatedService: {
      title: 'Billing & Inventory Automation Software',
      url: '/services/billing-inventory-software'
    },
    content: [
      `Slow checkout counters and manual stock tracking cause customer frustration and stock discrepancy. Modern retail and wholesale businesses in ${CITY} require fast barcode-driven GST invoicing that prints 3-inch thermal receipts in under 5 seconds.`,
      `Automated inventory software deducts stock live on every sale, triggering low-stock re-order alerts before you run out of fast-selling items. Cloud data sync ensures business owners can monitor gross margins and store revenues live from their smartphones anywhere in the world.`,
      `With automated customer credit (Udhaar) tracking and polite WhatsApp payment reminders, merchants reduce payment collection delays by over 50%.`
    ]
  }
];

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

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
            <li className="text-blue-500" aria-current="page">Blog</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Automation &amp; AI Strategy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            AI Business Agents &amp; Automation Insights in <span className="text-blue-500">{CITY}</span>
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed font-normal">
            Practical guides and architectural best practices authored by {COMPANY_NAME}&apos;s senior AI engineers for business owners in Chhattisgarh.
          </p>
        </header>

        {/* Modal / Expanded Reader View */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <article className="bg-[#0a0a0a] border border-white/10 rounded-3xl max-w-3xl w-full p-8 sm:p-12 my-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors text-lg"
                aria-label="Close article"
              >
                &times;
              </button>

              <div className="flex items-center gap-3 text-xs text-blue-400 font-bold uppercase tracking-widest mb-4">
                <span>{selectedPost.category}</span>
                <span>&bull;</span>
                <span>{selectedPost.readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-zinc-500 mb-8 pb-6 border-b border-white/5">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {selectedPost.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {selectedPost.date}</span>
              </div>

              <div className="space-y-5 text-zinc-300 text-base leading-relaxed mb-8">
                {selectedPost.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Related Service Link */}
              <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1">
                    Related Automation Solution
                  </span>
                  <h4 className="text-white font-bold text-sm">
                    {selectedPost.relatedService.title}
                  </h4>
                </div>
                <Link
                  to={selectedPost.relatedService.url}
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-all self-start sm:self-auto shrink-0"
                >
                  Explore Service <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          </div>
        )}

        {/* Blog Post Cards Grid */}
        <section aria-labelledby="articles-list" className="mb-24">
          <h2 id="articles-list" className="sr-only">Published Guides &amp; Case Studies</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map(post => (
              <article
                key={post.id}
                className="bg-[#080808] border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider mb-4">
                    <span className="text-blue-400">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-normal">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  {/* Related service badge */}
                  <Link
                    to={post.relatedService.url}
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-blue-400 transition-colors font-medium"
                  >
                    <span>Related:</span>
                    <strong className="text-zinc-300 hover:underline">{post.relatedService.title}</strong>
                  </Link>

                  <button
                    onClick={() => setSelectedPost(post)}
                    className="w-full py-3 bg-white/[0.03] hover:bg-blue-600 hover:text-white text-zinc-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5"
                  >
                    Read Full Guide <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="blog-cta" className="p-10 lg:p-14 rounded-3xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-black border border-blue-500/20 text-center">
          <h2 id="blog-cta" className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to Automate Your Business Operations?
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto mb-8">
            Speak directly with our senior AI automation consultants. We will provide a free 15-minute live demonstration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all"
            >
              Book Free Demo Call
            </Link>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="px-8 py-4 glass text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all"
            >
              Call: +91 {PHONE_NUMBER}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default BlogPage;
