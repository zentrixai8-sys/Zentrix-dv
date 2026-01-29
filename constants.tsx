
import { Service, NavItem } from './types';

export const COMPANY_NAME = "ZENTRIX";
export const TAGLINE = "AUTOMATION OS";
export const PHONE_NUMBER = "7089935002";
export const PHONE_NUMBER_2 = "7999206708";
export const EMAIL = "zentrix.ai8@gmail.com";
export const ADDRESS = "Raipur, Chhattisgarh, India";
export const LOGO_URL = "https://i.ibb.co/vCP2fg5R/Zentrix-Logo-with-Interlocking-Monogram.png";

export const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', href: 'home' },
  { label: 'SERVICES', href: 'services' },
  { label: 'PROCESS', href: 'directives' },
  { label: 'FEATURES', href: 'ecosystem' },
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
    title: 'Business Website Development',
    description: 'High-conversion websites designed to establish authority and capture leads effectively.',
    icon: 'Globe',
    details: 'Professional websites that look premium and work fast. Show off your products and services to the world.',
    specs: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Lead Forms'],
    implementation: 'Built a portfolio site for a leading Raipur consultancy, increasing inquiries by 40%.'
  },
  {
    title: 'CRM + Lead Management',
    description: 'Centralized systems to track, manage, and convert customer leads automatically.',
    icon: 'Users',
    details: 'Never lose a customer lead again. Track every call and message in one place.',
    specs: ['Auto Data Capture', 'Follow-up Reminders', 'Customer History', 'Team Access'],
    implementation: 'Deployed CRM for a real estate firm to manage 1000+ monthly leads.'
  },
  {
    title: 'Billing & Inventory Software',
    description: 'Streamlined billing and stock management for retail and wholesale businesses.',
    icon: 'FileText',
    details: 'Create invoices in seconds and track your stock automatically. No more manual errors.',
    specs: ['GST Invoicing', 'Stock Alerts', 'Daily Reports', 'Barcode Support'],
    implementation: 'Automated billing for a retail chain, reducing checkout time by 60%.'
  },
  {
    title: 'WhatsApp Automation',
    description: 'Advanced automated messaging to engage customers 24/7 on their favorite app.',
    icon: 'MessageCircle',
    details: 'Auto-reply to sales inquiries and support questions on WhatsApp instantly.',
    specs: ['Auto-Replies', 'Bulk Messages', 'Chatbot Integration', 'Order Updates'],
    implementation: 'Implemented for a clinic to handle appointment bookings via WhatsApp.'
  },
  {
    title: 'AI Business Chatbot',
    description: 'Intelligent AI agents that handle customer support and sales queries around the clock.',
    icon: 'Bot',
    details: 'An AI staff member that never sleeps. Answers questions and sells your services 24/7.',
    specs: ['24/7 Availability', 'Human-like Chat', 'Multi-language', 'Instant Answers'],
    implementation: 'Reduced support tickets by 80% for an e-commerce brand.'
  }
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: "₹9,999",
    features: [
      "Business Website",
      "WhatsApp Integration",
      "Lead Capture Form",
      "Basic SEO",
      "1 Year Hosting" // Added implied value
    ],
    recommended: false
  },
  {
    name: "Automation",
    price: "₹24,999",
    features: [
      "Everything in Starter",
      "Custom CRM Panel",
      "Billing Software",
      "WhatsApp Automation",
      "Inventory Management"
    ],
    recommended: true
  },
  {
    name: "AI Pro",
    price: "₹49,999",
    features: [
      "Everything in Automation",
      "AI Business Chatbot",
      "Advanced Analytics",
      "Priority Support",
      "Custom AI Training"
    ],
    recommended: false
  }
];

export const GEMINI_API_KEY = "AIzaSyBW0IahVQkst5CU3Jsr6Xkp-gTE2_avW7Q";
