import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import BookingForm from '@/components/forms/BookingForm';
import { generateMetadata as generateSEOMetadata, generateStructuredData } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Book Professional Driver - Hire Verified Drivers Online',
  description: 'Book verified professional drivers for hassle-free commutes, running errands and safe after-party drops. Choose your pickup location, destination, and schedule your ride.',
  keywords: [
    'book driver online',
    'hire professional driver',
    'driver booking',
    'car driver service',
    'professional chauffeur',
    'driver on demand',
    'instant driver booking',
    'verified drivers',
    '24/7 driver service'
  ],
  url: '/book-driver',
});

// Generate structured data for the booking service
const structuredData = generateStructuredData('service', {
  name: 'Professional Driver Booking Service',
  description: 'Book verified professional drivers instantly for safe and reliable transportation',
  cities: ['Tirupur', 'Chennai', 'Madurai', 'Trichy', 'Coimbatore']
});

export default function BookDriverPage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        {/* Enhanced loading state for better UX */}
        <Suspense fallback={
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '400px' 
            }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </Box>
        }>
          <BookingForm />
        </Suspense>
      </Box>
    </>
  );
}

