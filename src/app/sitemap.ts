import { MetadataRoute } from 'next';
import { APP_CONFIG, SUPPORTED_CITIES, SERVICES } from '@/utils/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = APP_CONFIG.url;
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/book-driver`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/call-drivers-tariff`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ];

  // Service pages (only valid service IDs that have actual routes)
  const servicePages: MetadataRoute.Sitemap = SERVICES.map(service => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // City-specific customer pages
  const cityPages: MetadataRoute.Sitemap = SUPPORTED_CITIES.map(city => ({
    url: `${baseUrl}/best-acting-drivers-in-${city.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // City-specific driver job pages
  const jobPages: MetadataRoute.Sitemap = SUPPORTED_CITIES.map(city => ({
    url: `${baseUrl}/car-driver-job-in-${city.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Blog posts - fetch from Contentful if available
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const contentful = (await import('@/components/config/contentful')).default;
    const response = await contentful.getEntries({
      content_type: 'blog',
      select: ['fields.slug', 'sys.updatedAt'],
      limit: 100,
    });
    blogPages = (response.items || []).map((item: any) => ({
      url: `${baseUrl}/blog/${item.fields?.slug}`,
      lastModified: new Date(item.sys.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // Contentful not configured or unreachable — skip blog posts
  }

  return [
    ...staticPages,
    ...servicePages,
    ...cityPages,
    ...jobPages,
    ...blogPages,
  ];
}
