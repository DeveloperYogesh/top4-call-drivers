import { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/utils/constants';

const privateRoutes = [
  '/api/',
  '/admin/',
  '/dashboard/',
  '/_next/',
  '/private/',
  '/temp/',
  '/login',
  '/signup',
  '/profile',
  '/history',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privateRoutes,
      },
    ],
    sitemap: `${APP_CONFIG.url}/sitemap.xml`,
    host: APP_CONFIG.url,
  };
}
