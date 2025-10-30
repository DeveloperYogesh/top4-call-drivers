import React from 'react';
import HeroSection from '@/components/ui/HeroSection';
import ServicesSection from '@/components/ui/ServicesSection';
import TopCitiesSection from './topCities';
import VideoSection from './videoSection';
import NumbersSection from './numbersSection';


export default function HomeContainer() {
  return (
    <div>
      <HeroSection />
      <TopCitiesSection/>
      <VideoSection/>
      <NumbersSection/>
      <ServicesSection />
    </div>
  );
}

