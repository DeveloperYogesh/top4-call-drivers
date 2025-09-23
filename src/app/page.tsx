import React, { Suspense } from "react";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import HomeContainer from "@/components/pages/home";

export const metadata = generateSEOMetadata({
  title: "No. 1 Driver Service: Hire TOP4 Call Drivers Online",
  description:
    "Hire verified, professional drivers for hassle-free commutes, running errands and safe after-party drops. Book car wash, maintenance, insurance and more services.",
  keywords: [
    "professional drivers",
    "hire driver online",
    "car driver service",
    "driver booking",
    "car wash service",
    "car maintenance",
    "fastag recharge",
    "car insurance",
    "top4 call drivers",
    "verified drivers india",
    "24/7 driver service"
  ],
});

// Generate structured data for the homepage
const organizationData = generateStructuredData('localbusiness', {
  city: 'Tirupur',
  state: 'Tamil Nadu',
  coordinates: {
    lat: 11.1085,
    lng: 77.3411
  }
});

const websiteData = generateStructuredData('website');

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      }>
        <HomeContainer />
      </Suspense>
    </>
  );
}
