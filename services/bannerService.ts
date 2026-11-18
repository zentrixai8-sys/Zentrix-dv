export interface BannerItem {
  id: string;
  isFullImage?: boolean; // When true, the uploaded banner graphic fills the entire card edge-to-edge
  tag?: string;
  title: string;
  highlight?: string;
  subtitle: string;
  cta?: string;
  link?: string;
  image: string;
  gradient?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'zentrixs_promotional_banners_v1';

export const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'banner-mobile-app',
    tag: 'NATIVE SPEED',
    title: 'Mobile App Architecture',
    highlight: 'Android & iOS',
    subtitle: 'React Native & Flutter with offline sync & live push telemetry.',
    cta: 'Explore Apps',
    link: '/services/website-and-software-development',
    gradient: 'from-[#030914] via-[#071933] to-[#0A2540]',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'banner-ecommerce',
    tag: '40% OFF THIS MONTH',
    title: 'E-Commerce Superstores',
    highlight: 'Automated Checkout',
    subtitle: 'Shopify & Custom MERN with Meta WhatsApp direct cart recovery.',
    cta: 'View Stores',
    link: '/services/billing-inventory-software',
    gradient: 'from-[#02130D] via-[#062419] to-[#0A3826]',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=700&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'banner-landing',
    tag: 'SUB-SECOND SPEED',
    title: 'High-Impact Landing Pages',
    highlight: '3D WebGL Motion',
    subtitle: 'Ultra-fast conversion funnels built to multiply lead bookings.',
    cta: 'Build Landing',
    link: '/services/business-website-development',
    gradient: 'from-[#170802] via-[#2F1106] to-[#451808]',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'banner-own-software',
    tag: '100% OWNERSHIP',
    title: 'Own Custom ERP & CRM',
    highlight: 'Zero Monthly SaaS Fee',
    subtitle: 'Tailored enterprise software running completely on your servers.',
    cta: 'Build Software',
    link: '/services/crm-lead-management',
    gradient: 'from-[#0E041A] via-[#1C0A30] to-[#2B0E4A]',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'banner-digital-marketing',
    tag: 'GROWTH ENGINE',
    title: 'AI Digital Marketing & Ads',
    highlight: 'Meta & Google Autopilot',
    subtitle: 'Dynamic ad generation, automated retargeting and qualified leads.',
    cta: 'Scale Leads',
    link: '/services/whatsapp-automation',
    gradient: 'from-[#17030B] via-[#2E0716] to-[#420A20]',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=700&q=80',
    createdAt: new Date().toISOString()
  }
];

export const getBanners = (): BannerItem[] => {
  if (typeof window === 'undefined') return DEFAULT_BANNERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BANNERS));
      return DEFAULT_BANNERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_BANNERS;
  } catch (_) {
    return DEFAULT_BANNERS;
  }
};

export const saveBanners = (banners: BannerItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    window.dispatchEvent(new CustomEvent('zentrixs:banners-updated', { detail: banners }));
  } catch (e) {
    console.error('Failed to save banners:', e);
  }
};

export const addBanner = (item: Omit<BannerItem, 'id' | 'createdAt'>): BannerItem => {
  const list = getBanners();
  const newItem: BannerItem = {
    ...item,
    id: `banner-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newItem, ...list];
  saveBanners(updated);
  return newItem;
};

export const updateBanner = (id: string, updates: Partial<BannerItem>): boolean => {
  const list = getBanners();
  const idx = list.findIndex(b => b.id === id);
  if (idx === -1) return false;
  list[idx] = { ...list[idx], ...updates };
  saveBanners(list);
  return true;
};

export const deleteBanner = (id: string): boolean => {
  const list = getBanners();
  const filtered = list.filter(b => b.id !== id);
  saveBanners(filtered);
  return true;
};

export const resetBannersToDefault = (): BannerItem[] => {
  saveBanners(DEFAULT_BANNERS);
  return DEFAULT_BANNERS;
};
