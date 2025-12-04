import React from 'react';
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { APP_CONFIG, SOCIAL_LINKS } from '@/utils/constants';

// SEO Metadata
export const metadata: Metadata = generateMetadata({
  title: 'Contact Us',
  description: 'Get in touch with TOP4 Call Drivers for professional driver services in Tamil Nadu. Contact us for bookings, inquiries, or support. Available 24/7 to serve you.',
  keywords: [
    'contact top4 call drivers',
    'driver service contact',
    'book driver contact',
    'car driver booking support',
    'professional driver contact tamil nadu',
    'top4 customer care',
    'driver service support',
    'call driver contact number',
  ],
  url: '/contact',
  type: 'website',
});

export default function ContactPage() {
  // Structured Data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_CONFIG.name,
    description: APP_CONFIG.description,
    url: APP_CONFIG.url,
    logo: `${APP_CONFIG.url}/images/logo.png`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: `+91-${APP_CONFIG.primaryPhone}`,
        contactType: 'Customer Service',
        availableLanguage: ['English', 'Tamil'],
        areaServed: 'IN',
      },
      {
        '@type': 'ContactPoint',
        telephone: `+91-${APP_CONFIG.secondaryPhone}`,
        contactType: 'Customer Support',
        availableLanguage: ['English', 'Tamil'],
        areaServed: 'IN',
      },
    ],
    email: APP_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No: 26 Jayalakshmipuram, 3rd Street, Nungambakkam',
      addressLocality: 'Chennai',
      postalCode: '600034',
      addressCountry: 'IN',
    },
    sameAs: [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.youtube,
    ],
  };

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact TOP4 Call Drivers',
    description: 'Get in touch with TOP4 Call Drivers for professional driver services',
    url: `${APP_CONFIG.url}/contact`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: APP_CONFIG.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact Us',
        item: `${APP_CONFIG.url}/contact`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="text-white bg-blue-500">
        <div className="custom-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              We're here to help! Reach out to us for bookings, inquiries, or any assistance you need. Our team is available 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="custom-container -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone Card 1 */}
          <a
            href={`tel:${APP_CONFIG.primaryPhone}`}
            className="group bg-white rounded-2xl p-8 border hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <PhoneIcon className="text-white text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Us</h3>
              <p className="text-2xl font-bold text-green-600 mb-1">{APP_CONFIG.primaryPhoneFormatted}</p>
              <p className="text-sm text-gray-500">Primary Support</p>
            </div>
          </a>

          {/* Phone Card 2 */}
          <a
            href={`tel:${APP_CONFIG.secondaryPhone}`}
            className="group bg-white rounded-2xl p-8 border hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <PhoneIcon className="text-white text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Support Line</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">{APP_CONFIG.secondaryPhoneFormatted}</p>
              <p className="text-sm text-gray-500">Customer Care</p>
            </div>
          </a>

          {/* Email Card */}
          <a
            href={`mailto:${APP_CONFIG.email}`}
            className="group bg-white rounded-2xl p-8 border hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <EmailIcon className="text-white text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Us</h3>
              <p className="text-lg font-bold text-purple-600 mb-1 break-all">{APP_CONFIG.email}</p>
              <p className="text-sm text-gray-500">Quick Response</p>
            </div>
          </a>

          {/* Operating Hours Card */}
          <div className="group bg-white rounded-2xl p-8 border hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <AccessTimeIcon className="text-white text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">We're Open</h3>
              <p className="text-2xl font-bold text-orange-600 mb-1">24/7</p>
              <p className="text-sm text-gray-500">Always Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Office Location Section */}
      <section className="custom-container">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-6">
            <div className="min-w-lg">
              <div>
                <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center">
                  <LocationOnIcon className="text-white text-2xl" />
                </div>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Our Office</h2>
                <address className="not-italic text-gray-600 leading-relaxed mb-4">
                  <strong className="text-gray-800 block mb-2">{APP_CONFIG.officeAddress.line1}</strong>
                  {APP_CONFIG.officeAddress.line2}<br />
                  {APP_CONFIG.officeAddress.line3}<br />
                  {APP_CONFIG.officeAddress.line4}
                </address>
                <a
                  href={APP_CONFIG.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <LocationOnIcon className="text-lg" />
                  Top4 Call Drivers Google Maps
                </a>
              </div>
            </div>
            
            {/* Google Maps Embed */}
            <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-gray-200">
              <iframe
                src={APP_CONFIG.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TOP4 Call Drivers Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="custom-container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Connect With Us</h2>
          <p className="text-gray-600 mb-8">
            Follow us on social media for updates, offers, and more!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Facebook */}
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white hover:bg-blue-50 text-gray-800 px-5 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transform hover:-translate-y-1 transition-all duration-300"
              aria-label="Visit our Facebook page"
            >
              <FacebookIcon className="text-2xl text-blue-600" />
              <span className="font-medium">Facebook</span>
            </a>

            {/* Instagram */}
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white hover:bg-pink-50 text-gray-800 px-5 py-3 rounded-lg border border-gray-200 hover:border-pink-500 hover:shadow-sm transform hover:-translate-y-1 transition-all duration-300"
              aria-label="Visit our Instagram profile"
            >
              <InstagramIcon className="text-2xl text-pink-600" />
              <span className="font-medium">Instagram</span>
            </a>

            {/* Twitter */}
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white hover:bg-sky-50 text-gray-800 px-5 py-3 rounded-lg border border-gray-200 hover:border-sky-500 hover:shadow-sm transform hover:-translate-y-1 transition-all duration-300"
              aria-label="Visit our Twitter profile"
            >
              <TwitterIcon className="text-2xl text-sky-500" />
              <span className="font-medium">Twitter</span>
            </a>

            {/* LinkedIn */}
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white hover:bg-blue-50 text-gray-800 px-5 py-3 rounded-lg border border-gray-200 hover:border-blue-700 hover:shadow-sm transform hover:-translate-y-1 transition-all duration-300"
              aria-label="Visit our LinkedIn page"
            >
              <LinkedInIcon className="text-2xl text-blue-700" />
              <span className="font-medium">LinkedIn</span>
            </a>

            {/* YouTube */}
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white hover:bg-red-50 text-gray-800 px-5 py-3 rounded-lg border border-gray-200 hover:border-red-600 hover:shadow-sm transform hover:-translate-y-1 transition-all duration-300"
              aria-label="Visit our YouTube channel"
            >
              <YouTubeIcon className="text-2xl text-red-600" />
              <span className="font-medium">YouTube</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="custom-container">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-500 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Book a Driver?</h2>
            <p className="text-base md:text-lg text-blue-50 mb-6 max-w-2xl mx-auto">
              Experience professional driver services with TOP4. Safe, reliable, and available across Tamil Nadu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/book-driver"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Book Now
              </a>
              <a
                href={`tel:${APP_CONFIG.primaryPhone}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 border border-blue-400"
              >
                Call {APP_CONFIG.primaryPhoneFormatted}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
