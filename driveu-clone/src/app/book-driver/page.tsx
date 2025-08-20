import React from 'react';
import { Box } from '@mui/material';
import BookingForm from '@/components/forms/BookingForm';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

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
  ],
  url: '/book-driver',
});

export default function BookDriverPage() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <BookingForm />
    </Box>
  );
}

