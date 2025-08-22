"use client";

import { CityData } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import {
  CheckCircle,
  DirectionsCar,
  LocationOn,
  MonetizationOn,
  Schedule,
  Verified,
} from "@mui/icons-material";
import { Button, Chip, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";

interface DriverJobPageProps {
  cityData: CityData;
}

const driverBenefits = [
  {
    icon: <MonetizationOn color="primary" />,
    title: "Competitive Earnings",
    description: "Earn up to ₹30,000/month with performance bonuses",
  },
  {
    icon: <Schedule color="primary" />,
    title: "Flexible Hours",
    description: "Choose your own schedule and work when it suits you",
  },
  {
    icon: <Verified color="primary" />,
    title: "Training & Support",
    description: "Get comprehensive training and 24/7 driver support",
  },
  {
    icon: <DirectionsCar color="primary" />,
    title: "Work in High-Demand Areas",
    description: "Drive in [city]'s busiest neighborhoods",
  },
];

const requirements = [
  "Valid driver's license",
  "Minimum 21 years of age",
  "1+ years of driving experience",
  "Clean background check",
  "Smartphone for app access",
];

const testimonials = [
  {
    quote: "TOP4 gave me the flexibility to work around my family time. The pay is great too!",
    author: "Ravi K., Driver in Chennai",
  },
  {
    quote: "The support team is always there when I need them. Highly recommend joining!",
    author: "Priya S., Driver in Bangalore",
  },
];

/**
 * DriverJobPage component
 *
 * @param {CityData} cityData - City data including name, areas, and more
 * @returns {JSX.Element} Driver job page component
 *
 * This page is rendered for driver job opportunities in a specific city (e.g., /car-driver-job-in-chennai)
 */
export default function DriverJobPage({ cityData }: DriverJobPageProps) {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-green-700 text-white py-8 md:py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3">
              <div className="bg-white/20 text-white py-2 px-4 rounded-full w-fit mx-auto">
                <p className="text-xs uppercase text-white">
                  Driver Jobs in {cityData.name}
                </p>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              Join TOP4 as a Driver in {cityData.name}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Earn a great income, work on your schedule, and join a trusted team of drivers in {cityData.name}. Start today!
            </p>

            <Button
              component={Link}
              href="/apply-driver"
              variant="contained"
              size="large"
              className="bg-white text-green-800 px-6 py-3 text-lg font-semibold hover:bg-white/90"
              aria-label={`Apply for driver job in ${cityData.name}`}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Why Drive with Us Section */}
      <div className="custom-container">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
            Why Drive with TOP4 in {cityData.name}?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join a platform that values your time, skills, and success.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          {driverBenefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 text-center bg-white rounded-lg my-border hover:shadow-md"
            >
              <div className="mb-2">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings Potential Section */}
      <div className="bg-gray-100">
        <div className="custom-container">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              Earnings Potential in {cityData.name}
            </h2>
            <p className="text-lg text-gray-600 max-w- atlikas-2xl mx-auto">
              Earn up to {formatCurrency(30000)}/month with TOP4
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Competitive Pay Structure
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Base earnings per trip: {formatCurrency(cityData.basePrice)}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Performance bonuses: Up to ₹5,000/month
            </p>
            <p className="text-sm text-gray-600">
              High-demand hours: Earn 20% extra
            </p>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="custom-container">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
            Driver Requirements
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to join? Here’s what you need to get started.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {requirements.map((req, index) => (
            <div
              key={index}
              className="p-4 text-center bg-white rounded-lg my-border"
            >
              <p className="font-medium">{req}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Areas Covered Section */}
      <div className="bg-green-700">
        <div className="custom-container">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
              High-Demand Areas in {cityData.name}
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              We need drivers in these key areas of {cityData.name}.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {cityData.areas.map((area, index) => (
              <div
                key={index}
                className="p-4 text-center text-white rounded-lg my-border hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-1">
                  <LocationOn className="text-lg" />
                  <p className="font-medium">{area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="custom-container">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
            What Our Drivers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from drivers who love working with TOP4.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md text-center"
            >
              <p className="text-sm text-gray-600 mb-2">"{testimonial.quote}"</p>
              <p className="font-semibold text-gray-900">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700 text-white py-8 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Ready to Drive with TOP4 in {cityData.name}?
          </h2>

          <p className="text-lg mb-4 opacity-90">
            Join our team of professional drivers and start earning today.
          </p>

          <Button
            component={Link}
            href="/apply-driver"
            variant="contained"
            size="large"
            className="bg-white text-green-800 px-8 py-4 text-lg font-semibold hover:bg-white/90"
            aria-label={`Apply for driver job in ${cityData.name}`}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}