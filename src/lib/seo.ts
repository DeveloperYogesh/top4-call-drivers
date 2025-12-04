// seo.ts
import { cache } from 'react';
import { Metadata } from 'next';
import { APP_CONFIG, SOCIAL_LINKS, SUPPORTED_CITIES } from '@/utils/constants';
import { CityData } from '@/types';

export const getCityData = cache((citySlug: string): CityData | null => {
  return SUPPORTED_CITIES.find((city) => city.slug === citySlug) || null;
});

export function generateCityMetadata(cityData: CityData): Metadata {
  const title = cityData.metaTitle || `Best Acting Drivers in ${cityData.name} - TOP4 Call Drivers`;
  const description = cityData.metaDescription || cityData.description;
  const url = `/best-acting-drivers-in-${cityData.slug}`;

  // Next.js metadata "type" must be 'website' | 'article' — use 'website' for service pages.
  return generateMetadata({
    title,
    description,
    keywords: cityData.keywords,
    url,
    type: 'website',
  });
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  // Next.js Metadata supports 'website' | 'article' for openGraph type
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Generates Next.js Metadata object.
 * Note: For service-specific structured data (schema.org Service),
 * continue to use generateStructuredData('service', ... ) and inject JSON-LD in the page.
 */
export function generateMetadata({
  title,
  description = APP_CONFIG.description,
  keywords = [],
  image = '/images/og-image.jpg',
  url = APP_CONFIG.url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = APP_CONFIG.author,
  section,
  tags = [],
  noIndex = false,
  canonical,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${APP_CONFIG.name}` : `${APP_CONFIG.name} - ${APP_CONFIG.description}`;
  const fullUrl = url.startsWith('http') ? url : `${APP_CONFIG.url}${url}`;
  const imageUrl = image.startsWith('http') ? image : `${APP_CONFIG.url}${image}`;

  const defaultKeywords = [
    'driver service',
    'professional drivers',
    'car drivers',
    'hire driver',
    'driver booking',
    'car wash',
    'car maintenance',
    'car insurance',
    'fastag recharge',
    APP_CONFIG.name.toLowerCase(),
    'india',
  ];

  const allKeywords = [...defaultKeywords, ...keywords];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: author }],
    creator: author,
    publisher: APP_CONFIG.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(APP_CONFIG.url),
    alternates: {
      canonical: canonical || fullUrl,
    },
    openGraph: {
      // Next.js openGraph type: 'website' | 'article'
      type: type,
      locale: 'en_IN',
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: APP_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || APP_CONFIG.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      // use your brand handle if you have one
      creator: '@top4calldrivers',
      site: '@top4calldrivers',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // replace these with your real verification codes
      google: '9W1_ISWbLi5d_DxXc6Y0quUMCoXYRHgxqp2NlrhHQk4',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
  };

  // Add article-specific metadata details when requested
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      // The standard OpenGraph article fields
      // Note: Next.js's OpenGraph typing may not include all of these keys explicitly,
      // but they are commonly used in meta tags. Adjust to your needs.
      publishedTime,
      modifiedTime,
      // authors in OpenGraph article typically used as 'article:author' meta tags, here kept for convenience
      authors: [author],
      section,
      tags,
    } as any;
  }

  return metadata;
}

/**
 * Generate structured data (JSON-LD) for embedding in pages.
 * This returns plain objects; serialize with JSON.stringify when injecting into <script type="application/ld+json">.
 *
 * Important: baseData is deliberately neutral (no @context or @type), so per-schema fields won't be overwritten by spreads.
 */
export function generateStructuredData(type: string, data: any = {}) {
  const baseData = {
    name: APP_CONFIG.name,
    description: APP_CONFIG.description,
    url: APP_CONFIG.url,
    logo: `${APP_CONFIG.url}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: APP_CONFIG.supportPhone,
      contactType: 'Customer Service',
      // include local language(s) for your region
      availableLanguage: ['English', 'Tamil'],
    },
    sameAs: [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.youtube,
    ],
  };

  switch (type) {
    case 'service':
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: data.name || 'Professional Driver Service',
        description: data.description || 'Hire verified, professional drivers for hassle-free commutes',
        provider: baseData,
        areaServed: data.cities || ['Tiruppur', 'Chennai', 'Madurai', 'Trichy', 'Coimbatore'],
        serviceType: 'Driver Service',
        category: 'Transportation',
      };

    case 'localbusiness':
      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        ...baseData,
        '@id': `${APP_CONFIG.url}#organization`,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
          // default to Tamil Nadu for your supported cities
          addressRegion: data.state || 'Tamil Nadu',
          addressLocality: data.city || 'Tiruppur',
        },
        geo: data.coordinates && {
          '@type': 'GeoCoordinates',
          latitude: data.coordinates.lat,
          longitude: data.coordinates.lng,
        },
        openingHours: 'Mo-Su 00:00-23:59',
        priceRange: '₹₹',
      };

    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: APP_CONFIG.name,
        description: APP_CONFIG.description,
        url: APP_CONFIG.url,
        publisher: baseData,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${APP_CONFIG.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement:
          data.items?.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })) || [],
      };

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity:
          data.faqs?.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })) || [],
      };

    case 'review':
      return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Organization',
          name: APP_CONFIG.name,
          image: `${APP_CONFIG.url}/images/logo.png`,
        },
        author: {
          '@type': 'Person',
          name: data.author || 'Anonymous',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: data.rating || 5,
          bestRating: 5,
        },
        reviewBody: data.reviewBody,
      };

    default:
      // default to organization info (include @context)
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        ...baseData,
        logo: {
          '@type': 'ImageObject',
          url: `${APP_CONFIG.url}/images/logo.png`,
          width: 112,
          height: 112,
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No: 26 Jayalakshmipuram, 3rd Street, Nungambakkam',
          addressLocality: 'Chennai',
          postalCode: '600034',
          addressCountry: 'IN',
        },
      };
  }
}

// City-specific SEO data (old helper). Ensure type is 'website' for Next.js openGraph compatibility.
export function generateCityMetadataOld(city: string, state: string) {
  const cityTitle = `Call Drivers in ${city} - Professional Driver Service`;
  const cityDescription = `Hire verified professional drivers in ${city}, ${state}. Book experienced drivers for safe commutes, errands, and after-party drops. Available 24/7 with instant booking.`;
  const cityKeywords = [
    `drivers in ${city.toLowerCase()}`,
    `call driver ${city.toLowerCase()}`,
    `hire driver ${city.toLowerCase()}`,
    `professional drivers ${city.toLowerCase()}`,
    `driver service ${city.toLowerCase()}`,
    `car driver ${city.toLowerCase()}`,
    `${city.toLowerCase()} driver booking`,
    `${state.toLowerCase()} driver service`,
  ];

  return generateMetadata({
    title: cityTitle,
    description: cityDescription,
    keywords: cityKeywords,
    url: `/best-acting-drivers-in-${city.toLowerCase()}`,
    type: 'website',
  });
}

// Service-specific metadata helper — returns Next.js Metadata (OG as website) and you can attach structured data using generateStructuredData('service', {...})
export function generateServiceMetadata(serviceName: string, description: string) {
  const serviceTitle = `${serviceName} - Professional Car Services`;
  const serviceKeywords = [
    serviceName.toLowerCase(),
    'car service',
    'professional service',
    `${APP_CONFIG.name.toLowerCase()} service`,
    'car maintenance',
    'vehicle service',
  ];

  return generateMetadata({
    title: serviceTitle,
    description,
    keywords: serviceKeywords,
    // keep 'website' for openGraph
    type: 'website',
  });
}
