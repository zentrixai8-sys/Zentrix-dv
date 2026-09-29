
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  postedAt: string;
  description: string;
  category: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceContentSection {
  heading: string;
  paragraphs: string[];
}

export interface Service {
  slug: string;
  title: string;
  shortTitle?: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  icon: string;
  details: string;
  specs: string[];
  implementation: string;
  overview: string[];
  keyFeatures: { title: string; desc: string }[];
  industries: string[];
  workflow: { step: string; title: string; desc: string }[];
  faqs: FAQItem[];
}

export interface NavItem {
  label: string;
  href: string;
}

