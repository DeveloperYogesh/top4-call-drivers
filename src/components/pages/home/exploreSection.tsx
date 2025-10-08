import React from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';

export default function ExploreSection() {
  return (
    <section className="bg-blue-100 py-12">
      <div className="custom-container text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Explore Your City Effortlessly With Top4</h2>
        <p className="text-lg text-gray-600 mb-6">Save up to 20% when you book in advance!</p>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/explore"
          className="px-6 py-3 rounded-lg font-semibold"
        >
          Get More Details
        </Button>
      </div>
    </section>
  );
}