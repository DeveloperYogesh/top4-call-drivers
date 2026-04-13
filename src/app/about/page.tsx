import React from "react";
import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import { APP_CONFIG, SUPPORTED_CITIES, SERVICES } from "@/utils/constants";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us - Professional Driver Services Across Tamil Nadu",
  description:
    "Learn about TOP4 Call Drivers — Tamil Nadu's trusted professional driver service since inception. Verified drivers, 24/7 availability, and transparent pricing across Chennai, Coimbatore, Madurai, Trichy & Tiruppur.",
  keywords: [
    "about top4 call drivers",
    "professional driver company india",
    "acting driver company tamil nadu",
    "driver service company chennai",
    "top4 call drivers about",
  ],
  url: "/about",
  type: "website",
});

export default function AboutPage() {
  const breadcrumbSchema = generateStructuredData("breadcrumb", {
    items: [
      { name: "Home", url: APP_CONFIG.url },
      { name: "About Us", url: `${APP_CONFIG.url}/about` },
    ],
  });

  const organizationSchema = generateStructuredData("organization");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#354B9C] to-blue-800 text-white">
        <div className="custom-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              About TOP4 Call Drivers
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Tamil Nadu&apos;s most trusted professional driver service — connecting you with verified, experienced drivers for safe and comfortable travel.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="custom-container">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At TOP4 Call Drivers, our mission is to provide safe, reliable, and professional driver services that make travel hassle-free. We connect verified drivers with customers who need experienced, trustworthy professionals for city commutes, outstation trips, errands, and after-party drops.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Founded with the vision of revolutionizing personal driver services in Tamil Nadu, we have grown to serve thousands of customers across {SUPPORTED_CITIES.length} major cities with a network of {SUPPORTED_CITIES.reduce((acc, city) => acc + (city.driversCount || 0), 0).toLocaleString()}+ verified drivers.
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-[#354B9C]">{SUPPORTED_CITIES.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Cities Served</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#354B9C]">
                    {SUPPORTED_CITIES.reduce((acc, city) => acc + (city.driversCount || 0), 0).toLocaleString()}+
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Verified Drivers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#354B9C]">{SERVICES.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Services Offered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#354B9C]">24/7</p>
                  <p className="text-sm text-gray-600 mt-1">Availability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50">
        <div className="custom-container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
              Why Choose TOP4 Call Drivers?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified & Trained Drivers</h3>
                <p className="text-gray-600">
                  Every driver on our platform undergoes thorough background verification, license checks, and professional training before being listed.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">
                  No hidden charges, no surge pricing. Our transparent tariff structure ensures you know exactly what you&apos;re paying — before, during, and after your trip.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🕐</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Customer Support</h3>
                <p className="text-gray-600">
                  Our dedicated support team is available round the clock. Call us at {APP_CONFIG.primaryPhoneFormatted} or {APP_CONFIG.secondaryPhoneFormatted} anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="custom-container">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Serving Across Tamil Nadu
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {SUPPORTED_CITIES.map((city) => (
              <a
                key={city.slug}
                href={`/best-acting-drivers-in-${city.slug}`}
                className="bg-white rounded-xl p-4 text-center border border-gray-200 hover:border-[#354B9C] hover:shadow-md transition-all group"
              >
                <p className="text-lg font-semibold text-gray-900 group-hover:text-[#354B9C]">
                  {city.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">{city.driversCount?.toLocaleString()}+ Drivers</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Office Section */}
      <section className="bg-gray-50">
        <div className="custom-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Office
            </h2>
            <address className="not-italic text-gray-600 leading-relaxed mb-6">
              <strong className="text-gray-800 block mb-2">{APP_CONFIG.officeAddress.line1}</strong>
              {APP_CONFIG.officeAddress.line2}<br />
              {APP_CONFIG.officeAddress.line3}<br />
              {APP_CONFIG.officeAddress.line4}
            </address>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="bg-[#354B9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2a3a7a] transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/book-driver"
                className="bg-white text-[#354B9C] border border-[#354B9C] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Book a Driver
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
