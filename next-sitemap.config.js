/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://driveu-clone.replit.dev',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/admin/*', '/login', '/signup', '/profile'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  
  // Generate additional sitemaps for different content types
  additionalPaths: async (config) => {
    const result = [];
    
    // Add dynamic city pages
    const cities = ['tirupur', 'chennai', 'trichy', 'madurai', 'coimbatore'];
    cities.forEach(city => {
      result.push({
        loc: `/best-acting-drivers-in-${city}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: `/car-driver-job-in-${city}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    });
    
    // Add service pages
    const services = ['car-wash', 'car-maintenance', 'driver-service', 'car-insurance'];
    services.forEach(service => {
      result.push({
        loc: `/services/${service}`,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      });
    });
    
    return result;
  },
  
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/api/', '/admin/', '/login', '/signup', '/profile'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://driveu-clone.replit.dev'}/sitemap.xml`,
    ],
  },
};