import { Service, NavItem } from './types';

export const COMPANY_NAME = "ZENTRIXS";
export const TAGLINE = "AUTOMATION";
export const PHONE_NUMBER = "7999206708";
export const PHONE_NUMBER_2 = "9183335002";
export const AI_BOT_NUMBER = "9183335002";
export const EMAIL = "zentrix.ai8@gmail.com";
export const ADDRESS = "Ward no. 38, Bhainsthan Road, Near Nutan Rice Mill, Raipur, Chhattisgarh 492009";
export const CITY = "Raipur";
export const STATE = "Chhattisgarh";
export const PINCODE = "492009";
export const COUNTRY = "India";
export const GEO_COORDINATES = {
  latitude: 21.2514,
  longitude: 81.6296
};
export const SITE_URL = "https://www.zentrixs.in";
export const LOGO_URL = "/logo.png";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/zentrix.ai8/",
  facebook: "https://www.facebook.com/share/1Dau1vwEvh/",
  whatsapp: `https://wa.me/91${PHONE_NUMBER}`,
  youtube: "https://youtube.com/@zentrixsraipur?si=Fz8TuDBQNC2pjIGM",
  linkedin: "https://www.linkedin.com/company/zentrixs/",
  twitter: "#"
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'SERVICES', href: '/services' },
  { label: 'BLOG', href: '/blog' },
  { label: 'CONTACT', href: '/contact' },
];

export const TESTIMONIALS = [
  {
    name: "Akshay Bardia",
    role: "Director",
    company: "Bardia Enterprises",
    logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=100&h=100&fit=crop",
    text: "ZENTRIXS changed our business completely. Everything from our lead capture to billing and customer follow-up is now automated and lightning fast.",
    rating: 5
  },
  {
    name: "Dilip Kodwani",
    role: "Manager",
    company: "Acemark Solutions",
    logo: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=100&h=100&fit=crop",
    text: "Best business automation and AI agent company in Raipur. Their WhatsApp bot and CRM save our sales team hours of manual follow-ups every day.",
    rating: 5
  },
  {
    name: "Sandeep Verma",
    role: "Founder",
    company: "Verma Retail & Logistics",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    text: "The custom AI agent handles hundreds of incoming customer inquiries on our website and WhatsApp 24/7 without missing a single lead.",
    rating: 5
  }
];

export const SERVICES: Service[] = [
  {
    slug: 'ai-business-chatbot',
    title: 'AI Business Agents & Autonomous Chatbots',
    shortTitle: 'AI Agents & Chatbots',
    h1: 'AI Business Agents & Autonomous Chatbots in Raipur',
    metaTitle: 'AI Agents in Raipur | Zentrixs',
    metaDescription: 'Deploy 24/7 autonomous AI business agents & conversational LLMs in Raipur by Zentrixs. Automate inquiries, lead qualification & CRM sync. Book a demo.',
    description: 'Autonomous AI agents trained on your proprietary business knowledge to sell, support, and qualify leads 24/7 in Hindi and English.',
    icon: 'Bot',
    details: 'Deploy an intelligent virtual employee that never sleeps, never forgets details, and handles thousands of customer inquiries across web and WhatsApp simultaneously.',
    specs: ['Bilingual LLM Brain (Hindi & English)', '24/7 Autonomous Lead Qualification', 'Direct CRM & Sheet Database Sync', 'Context-Aware Human Escalation'],
    implementation: 'Deployed an autonomous generative AI sales agent for a leading Raipur institute, answering 85% of student queries instantly and boosting admissions by 35%.',
    overview: [
      'Customer expectations for instant, personalized replies have never been higher. When prospective clients reach out with questions about your pricing, catalogs, services, or warranty policies, waiting hours for a human reply means losing deals to competitors. Zentrixs engineers custom autonomous AI agents and generative conversational bots designed specifically for businesses in Raipur, Chhattisgarh, and across India.',
      'Unlike rigid legacy chatbots that follow fragile predetermined rules, our AI business agents are powered by advanced Large Language Models (LLMs) trained specifically on your product manuals, price lists, service contracts, and company policies. They converse naturally in English, Hindi, and conversational Hinglish, intelligently qualify incoming leads, record details into your CRM, and schedule consultations directly into your calendar.'
    ],
    keyFeatures: [
      { title: 'Trained Strictly on Your Business Data', desc: 'The AI searches your company knowledge base in real-time, delivering accurate, reliable answers without hallucinations or guesses.' },
      { title: 'Fluent Bilingual Support (Hindi & English)', desc: 'Communicate effortlessly with local customers in Chhattisgarh in pure Hindi, fluent English, or colloquial Hinglish.' },
      { title: 'Autonomous Lead Qualification Filters', desc: 'The AI collects customer requirements, budget, timeline, and phone numbers before routing hot prospects directly to your sales team.' },
      { title: 'Omnichannel Web & WhatsApp Deployment', desc: 'Deploy a unified AI agent across your official website, WhatsApp Business API, and internal company databases simultaneously.' }
    ],
    industries: [
      'Real Estate Developers & Property Brokers in Raipur',
      'Educational Institutes, Colleges & Coaching Centers',
      'Hospitals, Diagnostic Laboratories & Healthcare Clinics',
      'Wholesale Distributors, FMCG & B2B Trading Hubs',
      'Automobile Dealerships & Service Centers'
    ],
    workflow: [
      { step: '01', title: 'Knowledge Base Curation', desc: 'We ingest your product catalogs, pricing sheets, FAQs, and service guidelines.' },
      { step: '02', title: 'Persona & Guardrails Calibration', desc: 'Configure brand tone, language style, qualification criteria, and response formatting.' },
      { step: '03', title: 'CRM & API Webhook Sync', desc: 'Connect the AI agent directly to your lead database, WhatsApp number, and calendar.' },
      { step: '04', title: 'Benchmark Testing & Launch', desc: 'Rigorous testing across hundreds of customer scenarios to guarantee accuracy and speed.' }
    ],
    faqs: [
      {
        question: 'How is an AI Agent different from a regular rule-based chatbot?',
        answer: 'Old rule-based chatbots only understand rigid buttons or exact keywords and break when a user types freely. An AI Agent powered by LLMs understands conversational intent, handles typos, answers multi-part complex questions naturally, and can perform tasks like booking appointments and updating databases.'
      },
      {
        question: 'Can the AI Agent speak both Hindi and English?',
        answer: 'Yes! Our AI agents natively understand and reply in English, Hindi, and colloquial Hinglish, ensuring local Raipur and Chhattisgarh customers feel completely comfortable.'
      },
      {
        question: 'What happens if a customer asks a question the AI does not know?',
        answer: 'The AI gracefully acknowledges its limitation, captures the customer contact number, and instantly notifies your human sales executive with a prioritized alert.'
      },
      {
        question: 'Can the AI Agent book appointments directly in Google Calendar or our CRM?',
        answer: 'Yes. The AI agent can check your team availability in real-time, offer suitable dates/time slots to the prospect, and confirm the booking automatically.'
      }
    ]
  },
  {
    slug: 'whatsapp-automation',
    title: 'WhatsApp Automation & Conversational Bots',
    shortTitle: 'WhatsApp Automation',
    h1: 'WhatsApp Automation & Conversational Bots in Raipur',
    metaTitle: 'WhatsApp Automation in Raipur | Zentrixs',
    metaDescription: 'Scale customer communication 24/7 with official WhatsApp Cloud API automation in Raipur by Zentrixs. Instant auto-replies & broadcast workflows. Try demo.',
    description: 'Advanced WhatsApp Business Cloud API workflows, interactive button menus, automated order notifications, and bulk broadcasting.',
    icon: 'MessageCircle',
    details: 'Engage customers on India\'s favorite messaging app with automated replies, PDF catalog delivery, payment collection links, and shared team inboxes.',
    specs: ['Official Meta Cloud API Verified', 'Instant 24/7 Auto-Responses', 'Bulk Broadcast Campaigns', 'Catalog & Payment Links'],
    implementation: 'Automated inquiry handling and appointment booking via WhatsApp for a Raipur diagnostic center, processing 400+ inquiries daily with zero delay.',
    overview: [
      'In India, over 95% of consumers and business buyers prefer communicating via WhatsApp rather than email or phone calls. If your business takes hours to reply to WhatsApp inquiries, potential customers will simply reach out to your competitors. Zentrixs deploys official Meta WhatsApp Business Cloud API automation and smart conversational bots for businesses across Raipur and Chhattisgarh.',
      'We set up verified green tick profiles, interactive button menus, product catalog sharing, automated quotation dispatch, payment link triggers, and seamless live-agent handover. Send broadcast promotions to thousands of opted-in customers with verified 98% open rates.'
    ],
    keyFeatures: [
      { title: 'Official Meta WhatsApp Business Cloud API', desc: 'Secure, verified official infrastructure that protects your company number from bans and limits.' },
      { title: 'Instant Interactive Auto-Replies (24/7)', desc: 'Deliver instant service menus, price lists, brochures, and answers at 2 AM with zero human delay.' },
      { title: 'Targeted Bulk Promotional Broadcasts', desc: 'Send rich media banners, festival greetings, and flash discounts directly to verified customer lists.' },
      { title: 'Multi-Agent Shared Team Inbox', desc: 'Enable your entire customer service team to reply from a single business WhatsApp number with chat assignment.' }
    ],
    industries: [
      'Clinics, Doctors & Diagnostic Centers in Raipur',
      'Real Estate Brokers, Builders & Property Consultants',
      'Event Planners, Caterers & Banquet Venues',
      'Automobile Service Centers & Dealerships',
      'Restaurants, Cafes & Cloud Kitchens'
    ],
    workflow: [
      { step: '01', title: 'Official API Onboarding', desc: 'Verify your Meta Business Manager and register your official phone number with Meta.' },
      { step: '02', title: 'Conversation Flow Design', desc: 'Build interactive decision trees, welcome greetings, FAQ responses, and product catalogs.' },
      { step: '03', title: 'Database & Website Webhook Sync', desc: 'Connect website forms and billing triggers to fire automated WhatsApp messages.' },
      { step: '04', title: 'Testing & Launch', desc: 'Verify message delivery speed, button responsiveness, agent escalation, and launch.' }
    ],
    faqs: [
      {
        question: 'Will our business phone number get banned by WhatsApp for automation?',
        answer: 'Never. Unlike risky unofficial third-party scrapers that violate WhatsApp policies, Zentrixs exclusively implements the official Meta WhatsApp Cloud API with authorized message templates, guaranteeing 100% account safety and reliability.'
      },
      {
        question: 'Can multiple employees answer chats from the same WhatsApp number simultaneously?',
        answer: 'Yes! Our multi-agent shared inbox allows your entire sales and support team in Raipur to log in simultaneously from their individual laptops or phones, assign chats, and reply to customers effortlessly.'
      },
      {
        question: 'Can the WhatsApp bot send PDF catalogs and payment links?',
        answer: 'Yes. The automation can dynamically deliver PDF brochures, product images, location Google Maps pins, and clickable UPI/Razorpay payment links based on customer selections.'
      },
      {
        question: 'How quickly can we go live with WhatsApp automation in Raipur?',
        answer: 'We can configure and deploy standard WhatsApp automation workflows within 48 to 72 hours following Meta Business Manager verification.'
      }
    ]
  },
  {
    slug: 'crm-lead-management',
    title: 'Custom CRM & Automated Lead Pipelines',
    shortTitle: 'CRM & Lead Automation',
    h1: 'Custom CRM & Automated Lead Pipelines in Raipur',
    metaTitle: 'Custom CRM Software in Raipur | Zentrixs',
    metaDescription: 'Automate lead capture, WhatsApp reminders, and deal pipelines in Raipur with custom CRM software by Zentrixs. Stop losing leads. Get a live demo.',
    description: 'Centralized systems to automatically capture, organize, assign, and convert customer leads across your sales team without human leakage.',
    icon: 'Users',
    details: 'Never lose a prospective customer again. Track phone calls, Facebook/Google ad leads, WhatsApp chats, and sales rep follow-ups in one secure dashboard.',
    specs: ['Automated Lead Ingestion', 'Follow-up WhatsApp Triggers', 'Team Call Log Tracking', 'Real-time Analytics Pipeline'],
    implementation: 'Deployed custom CRM for a Raipur real estate development agency managing 1,200+ monthly buyer leads without losing a single contact.',
    overview: [
      'Relying on scattered Excel sheets, paper registers, or WhatsApp chat histories guarantees that valuable customer inquiries slip through the cracks. Zentrixs builds custom CRM and automated lead pipeline systems tailored to the specific business workflows of companies in Raipur and Chhattisgarh.',
      'Our CRM solutions instantly capture leads from your website forms, incoming phone calls, WhatsApp messages, IndiaMART, Justdial, and social media ads. Leads are automatically assigned to sales agents with timed follow-up reminders, status stages, and management reporting dashboards.'
    ],
    keyFeatures: [
      { title: 'Omnichannel Lead Capture', desc: 'Automatically funnel inquiries from websites, WhatsApp, Meta Ads, and directories into a single unified dashboard.' },
      { title: 'Automated WhatsApp & SMS Follow-ups', desc: 'Instantly send personalized welcome brochures and reminder messages to leads without sales rep delay.' },
      { title: 'Sales Agent Pipeline & Call Tracking', desc: 'Monitor deal stages, call logs, quotation history, and sales representative activity in real-time.' },
      { title: 'Executive Analytics & Conversion Reports', desc: 'Understand which marketing channels yield the highest ROI with clear conversion graphs and metrics.' }
    ],
    industries: [
      'Real Estate Developers & Property Brokers in Raipur',
      'Automobile Showrooms & Commercial Vehicle Dealers',
      'Education Consultancies & Coaching Institutes',
      'B2B Wholesale Traders & Industrial Equipment Suppliers',
      'Interior Designers, Architects & Construction Firms'
    ],
    workflow: [
      { step: '01', title: 'Sales Pipeline Mapping', desc: 'Map your unique inquiry-to-closing journey, sales stages, team roles, and follow-up rules.' },
      { step: '02', title: 'Custom CRM Architecture', desc: 'Build tailored database schemas, custom fields, role permissions, and notification triggers.' },
      { step: '03', title: 'Lead Ingestion Integration', desc: 'Connect website forms, phone APIs, Meta Ads, and WhatsApp to the centralized database.' },
      { step: '04', title: 'Team Onboarding & Rollout', desc: 'Train your sales staff, test notification automations, and launch with ongoing technical support.' }
    ],
    faqs: [
      {
        question: 'Why choose a custom CRM over expensive generic tools like Salesforce or HubSpot?',
        answer: 'Generic platforms charge exorbitant monthly per-user dollar subscriptions, carry excessive complexity your staff will never use, and do not natively connect with local Indian workflows like WhatsApp Business API. Zentrixs builds streamlined, lightning-fast CRMs tailored 100% to your business with zero unnecessary per-user fees.'
      },
      {
        question: 'Can the CRM notify our sales reps immediately when a new inquiry comes in?',
        answer: 'Yes! As soon as a customer submits a lead form or sends a WhatsApp inquiry, the assigned sales rep receives an instant WhatsApp alert and notification with the lead contact info.'
      },
      {
        question: 'Is our customer database secure from unauthorized employee copying?',
        answer: 'Yes. We implement strict role-based access control (RBAC), meaning sales reps can only view their own assigned leads, and export options can be restricted exclusively to business owners.'
      },
      {
        question: 'Can we access the CRM from our mobile phones?',
        answer: 'Absolutely. Our CRMs are responsive web apps that function seamlessly on smartphones, tablets, laptops, and desktop computers.'
      }
    ]
  },
  {
    slug: 'billing-inventory-software',
    title: 'Billing & Inventory Automation Software',
    shortTitle: 'Billing & Inventory',
    h1: 'Billing & Inventory Automation Software in Raipur',
    metaTitle: 'Billing Software in Raipur | Zentrixs',
    metaDescription: 'GST billing & automated stock tracking software in Raipur for retail and wholesale. Fast barcode checkout & cloud inventory reports by Zentrixs. Call now.',
    description: 'Streamlined GST-compliant billing, real-time stock tracking, barcode scanning, and automated profit analytics for retail and wholesale businesses.',
    icon: 'FileText',
    details: 'Generate beautiful GST invoices in seconds, scan barcodes, monitor real-time stock levels, receive low inventory alerts, and reconcile accounts effortlessly.',
    specs: ['Fast GST Invoicing & Reports', 'Barcode & Thermal Printing', 'Low Stock & Expiry Alerts', 'Multi-Store Cloud Sync'],
    implementation: 'Automated billing and multi-counter checkout for a retail chain in Raipur, reducing customer queue times by 60% and eliminating stock discrepancy.',
    overview: [
      'Managing inventory manually or using sluggish, outdated desktop billing software leads to stock leakage, slow customer checkout, and compliance headaches. Zentrixs builds modern, intuitive, GST-ready billing and inventory management software engineered for retail shops, distributors, and wholesale traders across Raipur and Chhattisgarh.',
      'Our software generates thermal receipts or A4 GST invoices in seconds with barcode scanner integration. Real-time inventory deduction prevents stockouts, while automated re-order thresholds, profit-margin analysis, and GSTR-1/3B summary reports give business owners total financial control.'
    ],
    keyFeatures: [
      { title: 'Lightning-Fast GST Invoicing', desc: 'Generate compliant tax invoices in under 5 seconds with automatic HSN, CGST, SGST, and IGST calculations.' },
      { title: 'Barcode Scanning & Thermal Printing', desc: 'Seamless compatibility with USB/Bluetooth barcode guns, thermal receipt printers, and cash drawers.' },
      { title: 'Real-Time Inventory & Stock Alerts', desc: 'Live stock deductions with automated low-stock warnings, batch numbers, and expiry tracking.' },
      { title: 'Daily Sales & Profit Analysis', desc: 'Instant daily sales summaries, cash/UPI reconciliation, customer credit (Udhaar) ledgers, and profit reports.' }
    ],
    industries: [
      'Retail Supermarkets, Grocery Stores & FMCG Outlets in Raipur',
      'Hardware, Electrical & Sanitaryware Wholesalers (Ganj / Pandri)',
      'Garment Showrooms, Boutiques & Footwear Stores',
      'Pharmacies, Medical Stores & Chemical Distributors',
      'Spare Parts, Automobile Accessories & Electronics Retailers'
    ],
    workflow: [
      { step: '01', title: 'Catalog & Item Master Setup', desc: 'Import your product inventory, HSN codes, tax slabs, barcodes, and supplier ledgers.' },
      { step: '02', title: 'Hardware Peripheral Pairing', desc: 'Configure barcode scanners, thermal receipt printers, and digital weighing scales.' },
      { step: '03', title: 'Cashier & Staff Training', desc: 'Train cashiers on quick billing shortcuts, item search, returns, and payment collection.' },
      { step: '04', title: 'Live Deployment & Cloud Backup', desc: 'Deploy with automated daily cloud database backups to prevent any hardware data loss.' }
    ],
    faqs: [
      {
        question: 'Does your software support barcode scanners and 3-inch thermal printers?',
        answer: 'Yes! Our billing software works out-of-the-box with all standard USB and wireless barcode scanners, thermal receipt printers (2-inch and 3-inch), and laser printers.'
      },
      {
        question: 'Can the software run offline if the internet disconnects in our Raipur store?',
        answer: 'Yes. We design our software with local database caching or hybrid offline synchronization, ensuring your checkout counter never stops even during internet downtime.'
      },
      {
        question: 'Does the software manage customer credit (Khata / Udhaar) accounts?',
        answer: 'Yes. You can track customer credit balances, record partial payments, and automatically send polite WhatsApp payment reminder links with your UPI QR code.'
      },
      {
        question: 'Can I view daily sales reports on my mobile phone when I am not at the shop?',
        answer: 'Yes. Business owners have access to a secure live mobile dashboard showing total sales, gross margins, cash in drawer, and top-selling items updated every second.'
      }
    ]
  },
  {
    slug: 'website-and-software-development',
    title: 'Custom Website and Software Development Services',
    shortTitle: 'Website & Software Development',
    h1: 'Website and Software Development Company in Raipur',
    metaTitle: 'Website and Software Development Company | Zentrixs',
    metaDescription: 'Zentrixs is a premier website and software development company in Raipur. Custom software, AI agents, WhatsApp bots, and high-conversion web solutions.',
    description: 'Bespoke website and software development services engineered to automate operations, capture leads, and scale your brand with cutting-edge tech.',
    icon: 'Globe',
    details: 'Custom software and high-speed responsive websites built with modern React, Next.js, and neural AI automation for forward-thinking enterprises.',
    specs: ['Custom Software Architecture', 'Responsive Mobile-First UI', 'Technical On-Page SEO', 'Enterprise Database & API Sync'],
    implementation: 'Engineered a custom software and website portal for a leading corporate brand, boosting digital lead acquisition by 45% within 60 days.',
    overview: [
      'As a premier website and software development company, Zentrixs engineers bespoke digital systems that combine visually striking aesthetics with robust backend reliability. Whether you require custom software and website development, full-stack enterprise portals, or AI-integrated web applications, our engineering team delivers solutions tailored to your operational workflows.',
      'We specialize in modern website designing and software development using clean code standards, ultra-fast pre-rendered static HTML, and mobile-first responsiveness. As an innovative AI software website and app development company, we integrate intelligent automation directly into your websites—connecting live customer interactions to official WhatsApp APIs, custom CRM pipelines, and automated billing software.'
    ],
    keyFeatures: [
      { title: 'Custom UI/UX & Responsive Layouts', desc: 'Bespoke layouts tailored to your unique brand identity with smooth animations and mobile-first responsiveness.' },
      { title: 'Technical SEO & Pre-Rendering', desc: 'Full static generation and raw HTML output so Google crawlers index every heading, paragraph, and meta tag instantly.' },
      { title: 'Instant Lead Capture & WhatsApp Integration', desc: 'Interactive lead booking forms synced directly with your WhatsApp and CRM database in real-time.' },
      { title: 'Blazing Fast Performance (<1s Load Time)', desc: 'Optimized WebP assets, minified bundles, and modern CDN caching to achieve 90+ Google Lighthouse scores.' }
    ],
    industries: [
      'Corporate Consultancies, CA Firms & Legal Practices in Raipur',
      'Real Estate Developers & Construction Companies',
      'Healthcare Clinics, Doctors & Pathology Labs',
      'Industrial Manufacturers & B2B Suppliers',
      'Retail Brands, Hotels, Banquet Halls & Restaurants'
    ],
    workflow: [
      { step: '01', title: 'Discovery & Competitor Analysis', desc: 'Understand your offerings, target audience, local search queries, and competitor gaps.' },
      { step: '02', title: 'Wireframing & Visual Design', desc: 'High-fidelity UI mockups with custom dark/light aesthetic matching modern web standards.' },
      { step: '03', title: 'Clean Code Engineering', desc: 'Frontend development with clean semantic markup, accessibility standards, and SEO architecture.' },
      { step: '04', title: 'Testing, Deployment & GSC Setup', desc: 'Cross-browser validation, speed optimization, Google Search Console indexing, and launch.' }
    ],
    faqs: [
      {
        question: 'Will my website rank on Google for local Raipur searches?',
        answer: 'Yes! Every website engineered by Zentrixs is built with technical SEO at its foundation: single H1 tags, semantic heading hierarchy, schema markup (LocalBusiness, Organization), pre-rendered static HTML, and localized Raipur keywords.'
      },
      {
        question: 'Can I easily update text, phone numbers, and images on the website later?',
        answer: 'Yes. We provide an intuitive administrative dashboard or Google Sheets synchronized backend that allows you or your staff to update contact information, testimonials, and banners without writing a single line of code.'
      },
      {
        question: 'How long does it take to design and launch a custom business website?',
        answer: 'Our standard turnkey timeline for custom business websites ranges from 7 to 14 business days, including content integration, mobile testing, and domain/SSL setup.'
      },
      {
        question: 'Do you provide hosting, domain setup, and business email accounts?',
        answer: 'Yes. We offer end-to-end hosting setup with ultra-fast cloud servers, free SSL certificates, automated daily backups, and professional domain email addresses (e.g. contact@yourcompany.com).'
      }
    ]
  },
  {
    slug: 'ai-voice-agents',
    title: 'AI Voice Calling & Virtual Receptionist Agents',
    shortTitle: 'AI Voice Agents',
    h1: 'AI Voice Calling & Virtual Receptionist Agents in Raipur',
    metaTitle: 'AI Voice Agents in Raipur | Zentrixs',
    metaDescription: 'Deploy human-like bilingual AI voice agents for automated inbound call answering & outbound customer follow-ups in Raipur by Zentrixs. Try live demo.',
    description: 'Human-like conversational AI voice assistants that answer incoming customer calls, qualify leads, and perform automated follow-ups.',
    icon: 'PhoneCall',
    details: 'Never miss an inbound sales call again. Deploy an automated AI receptionist that picks up calls instantly in fluent Hindi and English, answers queries, and records leads.',
    specs: ['Ultra-Low Latency Voice Synthesizer', 'Bilingual Hindi & English Speech', 'Automatic Inbound Call Answering', 'Instant Lead Log to CRM & WhatsApp'],
    implementation: 'Deployed an AI phone receptionist for a Raipur real estate developer, answering 100% of after-hours calls and capturing 60+ qualified buyer leads weekly.',
    overview: [
      'Missing customer phone calls during peak hours or after business hours results in lost revenue. Zentrixs builds next-generation AI voice calling agents and automated virtual receptionists designed to handle high call volumes with human-like warmth, zero latency, and flawless accuracy.',
      'Our voice agents understand conversational nuances in both English and Hindi. They answer customer questions about your products and services, collect appointment bookings, transfer urgent calls to human managers, and execute automated outbound follow-up calls to warm prospects.'
    ],
    keyFeatures: [
      { title: 'Natural Bilingual Speech Synthesis', desc: 'Speaks with natural cadence, tone, and inflection in both Hindi and English with under 500ms latency.' },
      { title: '24/7 Inbound Receptionist', desc: 'Answers multiple incoming phone calls simultaneously so customers never encounter a busy signal or voicemail.' },
      { title: 'Automated Outbound Follow-Ups', desc: 'Automatically call website leads within 2 minutes of form submission to confirm interest and schedule meetings.' },
      { title: 'Real-Time Call Transcripts & Summaries', desc: 'Every call is recorded, transcribed, and summarized directly into your CRM and WhatsApp with actionable tags.' }
    ],
    industries: [
      'Real Estate Agencies & Builders in Raipur',
      'Hospitals, Diagnostic Centers & Clinics',
      'Automobile Service Centers & Dealerships',
      'Event Management, Venues & Banquets',
      'Financial Advisors & Insurance Agencies'
    ],
    workflow: [
      { step: '01', title: 'Call Script & Knowledge Mapping', desc: 'Define common caller questions, qualifying criteria, and call transfer rules.' },
      { step: '02', title: 'Voice & Language Training', desc: 'Select natural voice personas and calibrate Hindi/English pronunciation for Raipur callers.' },
      { step: '03', title: 'Telephony & Virtual Number Setup', desc: 'Connect to your cloud telephony PBX, virtual phone numbers, and CRM database.' },
      { step: '04', title: 'Live Testing & Deployment', desc: 'Run simulated test calls, optimize response latency, and go live.' }
    ],
    faqs: [
      {
        question: 'Does the voice agent sound like a robotic IVR or a real human?',
        answer: 'Our AI voice agents use state-of-the-art neural speech synthesis that sounds remarkably natural and human-like, complete with natural pauses, warm tones, and active listening capabilities.'
      },
      {
        question: 'Can the AI voice agent understand Hindi with a local accent?',
        answer: 'Yes! Our voice models are calibrated specifically for Indian accents, fluently understanding colloquial Hindi, English, and Hinglish.'
      },
      {
        question: 'Can the voice agent transfer calls to a real human employee if needed?',
        answer: 'Yes. If a caller requests a human manager or if the inquiry requires specialized clearance, the AI agent seamlessly transfers the call to your staff in real-time.'
      },
      {
        question: 'How do we receive details about the calls handled by the AI?',
        answer: 'Instantly after each call ends, an automated summary with the caller phone number, requirements, and full audio transcript is delivered to your WhatsApp and CRM.'
      }
    ]
  }
];

export const PRICING_PLANS = [
  {
    name: "Starter Automation",
    price: "₹9,999",
    features: [
      "Custom Business Website",
      "WhatsApp Lead Form Integration",
      "Basic SEO & Schema Markup",
      "Google Business Profile Sync",
      "1 Year Cloud Hosting & SSL"
    ],
    recommended: false
  },
  {
    name: "AI Agents & WhatsApp Automation",
    price: "₹24,999",
    features: [
      "Everything in Starter",
      "24/7 AI Business Chatbot",
      "Official WhatsApp Cloud API",
      "Custom CRM Lead Panel",
      "Billing & Inventory System"
    ],
    recommended: true
  },
  {
    name: "Enterprise Business Automation",
    price: "₹49,999",
    features: [
      "Everything in AI Agents",
      "Autonomous AI Voice Agent",
      "Custom ERP & Database Sync",
      "Bilingual Speech Training",
      "Priority 24/7 Technical Support"
    ],
    recommended: false
  }
];

export const GEMINI_API_KEY = "AIzaSyBW0IahVQkst5CU3Jsr6Xkp-gTE2_avW7Q";
