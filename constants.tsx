
import { Service, NavItem } from './types';

export const COMPANY_NAME = "ZENTRIX";
export const TAGLINE = "AUTOMATION OS";
export const PHONE_NUMBER = "7089935002";
export const PHONE_NUMBER_2 = "7999206708";
export const EMAIL = "zentrix.ai8@gmail.com";
export const ADDRESS = "Raipur, Chhattisgarh, India";
export const LOGO_URL = "https://i.ibb.co/vCP2fg5R/Zentrix-Logo-with-Interlocking-Monogram.png";

export const NAV_ITEMS: NavItem[] = [
  { label: 'SERVICES', href: 'services' },
  { label: 'DIRECTIVES', href: 'directives' },
  { label: 'ECOSYSTEM', href: 'ecosystem' },
  { label: 'CONTACT', href: 'contact' },
];

export const TESTIMONIALS = [
  {
    name: "Akshay Bardia",
    role: "Director",
    company: "Bardia Enterprises",
    logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=100&h=100&fit=crop",
    text: "ZENTRIX changed our business completely. Everything is now automatic and fast.",
    rating: 5
  },
  {
    name: "Dilip Kodwani",
    role: "Manager",
    company: "Acemark Solutions",
    logo: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=100&h=100&fit=crop",
    text: "Best automation service in Raipur. Their WhatsApp bot saves us hours every day.",
    rating: 5
  }
];

export const SERVICES: Service[] = [
  {
    title: 'Custom Software Development',
    description: 'Bespoke enterprise platforms engineered for high performance and seamless business logic execution.',
    icon: 'Terminal',
    details: 'We build fast software for your business. Easy to use, secure, and made specifically for your needs.',
    specs: ['Fast Loading', 'Secure Data', 'Easy Mobile Access', 'Custom Features'],
    implementation: 'Made a complete management system for a big logistics company in Raipur.'
  },
  {
    title: 'AI WhatsApp Automation',
    description: 'Advanced LLM-powered agents that handle customer support and sales queries 24/7 on WhatsApp.',
    icon: 'Cpu',
    details: 'Auto-reply to your customers on WhatsApp. Our AI handles sales, support, and bookings 24/7.',
    specs: ['24/7 Response', 'Smart Chatting', 'Multi-language', 'Instant Setup'],
    implementation: 'Helped a local shop handle 500+ customer chats daily without staff.'
  },
  {
    title: 'Cloud Infrastructure',
    description: 'High-speed cloud nodes and server management for robust, zero-downtime business operations.',
    icon: 'Network',
    details: 'Fast and reliable servers. We keep your business online 24/7 with 100% security.',
    specs: ['No Downtime', 'Auto Backup', 'Super Fast', 'Encrypted'],
    implementation: 'Moved an old server system to a new cloud setup, making it 5x faster.'
  }
];
