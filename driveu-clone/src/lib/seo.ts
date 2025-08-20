import { Metadata } from 'next';
import { APP_CONFIG, SUPPORTED_CITIES } from '@/utils/constants';
import { CityData } from '@/types';

export function getCityData(citySlug: string): CityData | null {
  return SUPPORTED_CITIES.find(city => city.slug === citySlug) || null;
}

export function generateCityMetadata(cityData: CityData): Metadata {
  const title = `Hire Professional Drivers in ${cityData.name}`;
  const description = cityData.description;
  const url = `/call-drivers-in-${cityData.slug}`;

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
  type?: 'website' | 'article' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
}

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
    'driveu',
    'india',
  ];

  const allKeywords = [...defaultKeywords, ...keywords];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
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
      type,
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
      creator: '@driveuindia',
      site: '@driveuindia',
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
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
  };

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [author],
      section,
      tags,
    };
  }

  return metadata;
}

// Generate structured data for different page types
export function generateStructuredData(type: string, data: any = {}) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_CONFIG.name,
    description: APP_CONFIG.description,
    url: APP_CONFIG.url,
    logo: `${APP_CONFIG.url}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: APP_CONFIG.supportPhone,
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.facebook.com/TOP4 Call DriversIndia',
      'https://www.instagram.com/driveuindia',
      'https://twitter.com/driveuindia',
      'https://www.linkedin.com/company/driveu',
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
        areaServed: data.cities || ['Bangalore', 'Chennai', 'Delhi', 'Mumbai', 'Hyderabad'],
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
          addressRegion: data.state || 'Karnataka',
          addressLocality: data.city || 'Bangalore',
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
        itemListElement: data.items?.map((item: any, index: number) => ({
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
        mainEntity: data.faqs?.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })) || [],
      };

    default:
      return baseData;
  }
}

// City-specific SEO data
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
    url: `/call-drivers-in-${city.toLowerCase()}`,
    type: 'service',
  });
}

// Service-specific SEO data
export function generateServiceMetadata(serviceName: string, description: string) {
  const serviceTitle = `${serviceName} - Professional Car Services`;
  const serviceKeywords = [
    serviceName.toLowerCase(),
    'car service',
    'professional service',
    'driveu service',
    'car maintenance',
    'vehicle service',
  ];

  return generateMetadata({
    title: serviceTitle,
    description,
    keywords: serviceKeywords,
    type: 'service',
  });
}

