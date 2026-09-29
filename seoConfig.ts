import {
  COMPANY_NAME,
  PHONE_NUMBER,
  EMAIL,
  ADDRESS,
  CITY,
  STATE,
  PINCODE,
  GEO_COORDINATES,
  SITE_URL,
  LOGO_URL,
  SOCIAL_LINKS,
  SERVICES
} from './constants';
import { Service, FAQItem } from './types';

export interface RouteSeoConfig {
  title: string;
  description: string;
  canonical: string;
  ogType: 'website' | 'article';
  ogImage: string;
  schemas: object[];
}

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: COMPANY_NAME,
  alternateName: 'Zentrixs Automation',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
    caption: `${COMPANY_NAME} Logo`
  },
  description: 'Enterprise business automation, autonomous AI agents, WhatsApp Cloud API bots, custom CRM, and billing software in Raipur, Chhattisgarh.',
  telephone: `+91-${PHONE_NUMBER}`,
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ward no. 38, Bhainsthan Road, Near Nutan Rice Mill',
    addressLocality: CITY,
    addressRegion: STATE,
    postalCode: PINCODE,
    addressCountry: 'IN'
  },
  sameAs: [
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.youtube,
    SOCIAL_LINKS.linkedin
  ].filter(link => link && link !== '#')
});

export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#localbusiness`,
  name: COMPANY_NAME,
  image: LOGO_URL,
  url: SITE_URL,
  telephone: `+91-${PHONE_NUMBER}`,
  email: EMAIL,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ward no. 38, Bhainsthan Road, Near Nutan Rice Mill',
    addressLocality: CITY,
    addressRegion: STATE,
    postalCode: PINCODE,
    addressCountry: 'IN'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: GEO_COORDINATES.latitude,
    longitude: GEO_COORDINATES.longitude
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00'
    }
  ],
  areaServed: [
    { '@type': 'City', name: 'Raipur' },
    { '@type': 'City', name: 'Bhilai' },
    { '@type': 'City', name: 'Durg' },
    { '@type': 'City', name: 'Bilaspur' },
    { '@type': 'AdministrativeArea', name: 'Chhattisgarh' }
  ],
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, UPI, Bank Transfer'
});

export const getServiceSchema = (service: Service) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.title,
  serviceType: service.shortTitle || service.title,
  provider: {
    '@type': 'LocalBusiness',
    name: COMPANY_NAME,
    url: SITE_URL,
    telephone: `+91-${PHONE_NUMBER}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CITY,
      addressRegion: STATE,
      addressCountry: 'IN'
    }
  },
  areaServed: {
    '@type': 'City',
    name: CITY
  },
  description: service.metaDescription,
  url: `${SITE_URL}/services/${service.slug}`
});

export const getFAQPageSchema = (faqs: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
  }))
});

export const getSeoMetadataForRoute = (route: string): RouteSeoConfig => {
  const cleanRoute = route.replace(/\/$/, '') || '/';

  // Home Page
  if (cleanRoute === '/' || cleanRoute === '/home') {
    return {
      title: 'Business Automation & AI Agents in Raipur | Zentrixs',
      description: 'Zentrixs builds autonomous AI agents, WhatsApp automation, custom CRM & business automation systems in Raipur. Automate sales & support 24/7. Book a demo today.',
      canonical: `${SITE_URL}/`,
      ogType: 'website',
      ogImage: LOGO_URL,
      schemas: [
        getOrganizationSchema(),
        getLocalBusinessSchema(),
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: COMPANY_NAME,
          url: SITE_URL,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/services?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }
      ]
    };
  }

  // About Page
  if (cleanRoute === '/about') {
    return {
      title: 'About Zentrixs | Business Automation & AI Agents Raipur',
      description: 'Learn about Zentrixs, Raipur premier business automation & AI agent company. We build custom CRM, WhatsApp bots, and AI agents to scale your enterprise.',
      canonical: `${SITE_URL}/about`,
      ogType: 'website',
      ogImage: LOGO_URL,
      schemas: [
        getOrganizationSchema(),
        getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' }
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Zentrixs',
          description: 'Learn about Zentrixs, an AI agent engineering and enterprise business automation firm based in Raipur, Chhattisgarh.',
          url: `${SITE_URL}/about`
        }
      ]
    };
  }

  // Services Overview Page
  if (cleanRoute === '/services') {
    return {
      title: 'AI Agents & Business Automation Services | Zentrixs',
      description: 'Explore Zentrixs business automation services in Raipur: autonomous AI agents, WhatsApp bots, custom CRM, billing software & AI voice agents. Scale 24/7.',
      canonical: `${SITE_URL}/services`,
      ogType: 'website',
      ogImage: LOGO_URL,
      schemas: [
        getOrganizationSchema(),
        getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' }
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Business Automation & AI Agent Services in Raipur',
          description: 'Comprehensive directory of autonomous AI agents, WhatsApp bots, custom CRM, and enterprise automation software offered by Zentrixs in Raipur, Chhattisgarh.',
          url: `${SITE_URL}/services`
        }
      ]
    };
  }

  // Contact Page
  if (cleanRoute === '/contact') {
    return {
      title: 'Contact Zentrixs | Business Automation in Raipur',
      description: 'Contact Zentrixs Raipur for custom AI agents, WhatsApp automation, CRM & billing software. Office at Ward 38, Bhainsthan Rd. Call +91 7999206708 or chat WhatsApp.',
      canonical: `${SITE_URL}/contact`,
      ogType: 'website',
      ogImage: LOGO_URL,
      schemas: [
        getOrganizationSchema(),
        getLocalBusinessSchema(),
        getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' }
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Zentrixs',
          url: `${SITE_URL}/contact`
        }
      ]
    };
  }

  // Blog Page
  if (cleanRoute === '/blog') {
    return {
      title: 'AI & Business Automation Insights | Zentrixs Raipur',
      description: 'Read expert guides on AI business agents, WhatsApp automation, custom CRM pipelines, and automated billing software in Raipur by Zentrixs engineers.',
      canonical: `${SITE_URL}/blog`,
      ogType: 'website',
      ogImage: LOGO_URL,
      schemas: [
        getOrganizationSchema(),
        getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' }
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Zentrixs AI & Automation Insights',
          description: 'Guides on deploying AI agents, WhatsApp automation, custom CRM software, and scaling business workflows in Raipur and India.',
          url: `${SITE_URL}/blog`
        }
      ]
    };
  }

  // Privacy Policy & Terms
  if (cleanRoute === '/privacy-policy') {
    return {
      title: 'Privacy Policy & Terms of Service | Zentrixs Raipur',
      description: 'Review the privacy policy and terms of service for Zentrixs business automation and AI agent solutions in Raipur, Chhattisgarh. Learn how we safeguard your data.',
      canonical: `${SITE_URL}/privacy-policy`,
      ogType: 'website',
      ogImage: LOGO_URL,
      schemas: [
        getOrganizationSchema(),
        getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy-policy' }
        ])
      ]
    };
  }

  // Service Detail Pages
  if (cleanRoute.startsWith('/services/')) {
    const slug = cleanRoute.replace('/services/', '');
    const service = SERVICES.find(s => s.slug === slug);
    if (service) {
      return {
        title: service.metaTitle,
        description: service.metaDescription,
        canonical: `${SITE_URL}/services/${service.slug}`,
        ogType: 'article',
        ogImage: LOGO_URL,
        schemas: [
          getOrganizationSchema(),
          getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Services', url: '/services' },
            { name: service.shortTitle || service.title, url: `/services/${service.slug}` }
          ]),
          getServiceSchema(service),
          ...(service.faqs && service.faqs.length > 0 ? [getFAQPageSchema(service.faqs)] : [])
        ]
      };
    }
  }

  // Default fallback
  return {
    title: 'Business Automation & AI Agents in Raipur | Zentrixs',
    description: 'Zentrixs builds autonomous AI agents, WhatsApp automation, custom CRM & business automation systems in Raipur. Automate sales & support 24/7. Book a demo today.',
    canonical: `${SITE_URL}${cleanRoute}`,
    ogType: 'website',
    ogImage: LOGO_URL,
    schemas: [getOrganizationSchema()]
  };
};

export const ALL_ROUTES: string[] = [
  '/',
  '/about',
  '/services',
  ...SERVICES.map(s => `/services/${s.slug}`),
  '/contact',
  '/blog',
  '/privacy-policy'
];
