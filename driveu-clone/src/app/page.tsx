import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '@/components/ui/HeroSection';
import ServicesSection from '@/components/ui/ServicesSection';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'No. 1 Driver Service: Hire Professional Drivers Online',
  description: 'Hire verified, professional drivers for hassle-free commutes, running errands and safe after-party drops. Book car wash, maintenance, insurance and more services.',
  keywords: [
    'professional drivers',
    'hire driver online',
    'car driver service',
    'driver booking',
    'car wash service',
    'car maintenance',
    'fastag recharge',
    'car insurance',
  ],
});

export default function HomePage() {
  return (
    <Box>
      <HeroSection />
      <ServicesSection />
    </Box>
  );
}

