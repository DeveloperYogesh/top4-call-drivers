import React from 'react';
import HeroSection from '@/components/ui/HeroSection';
import ServicesSection from '@/components/ui/ServicesSection';
import WhyTop4Section from './whyTop4Section';
import TestimonialsSection from './testimonialsSection';
import HatchbackSection from './hatchbackSection';
import ContactSection from './contactSection';
import ExploreSection from './exploreSection';


export default function HomeContainer() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <ExploreSection />
      <WhyTop4Section />
      <HatchbackSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}

