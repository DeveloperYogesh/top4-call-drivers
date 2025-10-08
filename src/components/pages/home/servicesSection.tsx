import React from 'react';
import { Button } from '@mui/material';
import {
  DirectionsCar,
  LocalCarWash,
  Toll,
  CleaningServices,
  Build,
  Security,
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';
import { SERVICES, ROUTES } from '@/utils/constants';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  DirectionsCar,
  LocalCarWash,
  Toll,
  CleaningServices,
  Build,
  Security,
};

export default function ServicesSection() {
  return (
    <div className="bg-white py-12">
      <div className="custom-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive car services and professional drivers at your fingertips</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {SERVICES.map((service: Service) => {
            const IconComponent = iconMap[service.icon] || DirectionsCar;
            return (
              <div key={service.id} className="h-full">
                <div className="h-full flex flex-col relative overflow-hidden bg-white rounded-lg border">
                  <div className="p-3 flex justify-center bg-gradient-to-r from-blue-200/20 to-blue-600/10">
                    <div className="service-icon w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                      <IconComponent className="text-[40px] text-white" />
                    </div>
                  </div>
                  <div className="flex-grow p-3">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                    <div className="mt-2">
                      {service.available ? (
                        <Button
                          variant="outlined"
                          endIcon={<ArrowForward />}
                          component={Link}
                          href={ROUTES.SERVICES}
                          className="rounded-lg font-semibold"
                        >
                          {service.id === 'professional-drivers' ? 'Book Now' : 'Learn More'}
                        </Button>
                      ) : (
                        <Button variant="text" disabled className="rounded-lg font-semibold">
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                  {service.available && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-0.5 rounded-lg text-xs font-semibold">
                      Available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <section className="text-center mt-12">
          <h3 className="text-2xl font-semibold mb-3 text-gray-900">Simplify Car Ownership</h3>
          <p className="text-base text-gray-600 mb-4 max-w-2xl mx-auto">
            Download the TOP4 Call Drivers app on iOS / Android phones for a seamless car ownership experience.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              variant="contained"
              size="large"
              component={Link}
              href={ROUTES.DOWNLOAD}
              className="px-6 py-3 rounded-lg font-semibold"
            >
              Download App
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href={ROUTES.SERVICES}
              className="px-6 py-3 rounded-lg font-semibold"
            >
              View All Services
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}