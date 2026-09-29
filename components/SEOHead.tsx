import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoMetadataForRoute } from '../seoConfig';

const SEOHead: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = getSeoMetadataForRoute(location.pathname);
    document.title = meta.title;

    // Update meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', meta.description);

    // Update canonical link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', meta.canonical);

    // Update Open Graph tags
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', meta.title);
    setOgTag('og:description', meta.description);
    setOgTag('og:url', meta.canonical);
    setOgTag('og:type', meta.ogType);
    setOgTag('og:image', meta.ogImage);

    // Update Twitter card tags
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', meta.title);
    setTwitterTag('twitter:description', meta.description);
    setTwitterTag('twitter:image', meta.ogImage);

    // Update JSON-LD structured data scripts
    const existingScripts = document.querySelectorAll('script[data-seo-jsonld]');
    existingScripts.forEach(el => el.remove());

    meta.schemas.forEach((schema, i) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', `schema-${i}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [location.pathname]);

  return null;
};

export default SEOHead;
