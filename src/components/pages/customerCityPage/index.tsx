import { CityData } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import {
  CheckCircle,
  DirectionsCar,
  LocationOn,
  Phone,
  Schedule,
  Security,
  Star,
} from "@mui/icons-material";
import { Button, Chip} from "@mui/material";
import Link from "next/link";

interface CustomerCityPageProps {
  cityData: CityData;
}

const features = [
  {
    icon: <Security color="primary" />,
    title: "Verified Drivers",
    description: "All drivers are background verified and licensed",
  },
  {
    icon: <Schedule color="primary" />,
    title: "24/7 Availability",
    description: "Book drivers anytime, anywhere in the city",
  },
  {
    icon: <Star color="primary" />,
    title: "Rated Drivers",
    description: "Choose from highly rated professional drivers",
  },
  {
    icon: <DirectionsCar color="primary" />,
    title: "All Vehicle Types",
    description: "Support for manual, automatic, and all car sizes",
  },
];

const benefits = [
  "No surge pricing - transparent rates",
  "Professional and courteous drivers",
  "Real-time tracking and updates",
  "Flexible booking options",
  "Damage protection available",
  "Multiple payment options",
];


/**
 * CustomerCityPage component
 *
 * @param {CityData} cityData - City data including name, areas, drivers count, base price, and more
 * @returns {JSX.Element} Customer city page component
 *
 * This page is rendered when a user navigates to a city-specific route e.g. /call-drivers-in-chennai
 * The page displays city-specific information, features, benefits, and a call-to-action to book a driver
 */

export default function CustomerCityPage({ cityData }: CustomerCityPageProps) {

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#354B9C] to-blue-800 text-white py-8 md:py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3">
              <div className="bg-white/20 text-white py-2 px-4 rounded-full w-fit mx-auto">
                <p className="text-xs! uppercase text-white">
                  Available in {cityData.name}
                </p>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              Hire TOP4 Call Drivers in {cityData.name}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Book verified, professional drivers for safe and comfortable rides
              across {cityData.name}. Available 24/7 with transparent pricing
              starting from {formatCurrency(cityData.basePrice)}.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 my-6">
              <Button
                component={Link}
                href="/book-driver"
                variant="contained"
                size="large"
                className="bg-white text-[#354B9C] px-6 py-3 text-lg font-semibold hover:bg-white/90"
                startIcon={<Phone />}
              >
                Book Driver Now
              </Button>

              <Button
                variant="outlined"
                size="large"
                className="!border-white !text-white px-6 py-3 text-lg hover:!bg-white/10"
              >
                View Pricing
              </Button>
            </div>

            <div className="w-fit mx-auto">
              <div className="p-4 2xl:p-6 text-center bg-white/95 backdrop-blur-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 !my-0">
                  Quick Stats for {cityData.name}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <h3 className="text-[#354B9C]">{cityData.driversCount}+</h3>
                    <p className="text-sm text-gray-600">Verified Drivers</p>
                  </div>

                  <div>
                    <h3 className="text-[#354B9C]">{cityData.areasCount}+</h3>
                    <p className="text-sm text-gray-600">Areas Covered</p>
                  </div>

                  <div>
                    <h3 className="text-[#354B9C]">4.8★</h3>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>

                  <div>
                    <h3 className="text-[#354B9C]">24/7</h3>
                    <p className="text-sm text-gray-600">Availability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="custom-container">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
            Why Choose TOP4 Call Drivers in {cityData.name}?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the best driver hiring service with our professional and
            reliable drivers
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 text-center bg-white rounded-lg my-border hover:shadow-md"
            >
              <div className="mb-2">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Areas Covered Section */}
      <div className="bg-[#354B9C]">
        <div className="custom-container">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
              Areas We Cover in {cityData.name}
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Our professional drivers are available across all major areas in{" "}
              {cityData.name}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {cityData.areas.map((area, index) => (
              <div
                key={index}
                className="p-4 text-center text-white rounded-lg cursor-pointer my-border hover:bg-white/10 transition-all duration-300"
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

      {/* Benefits Section */}
      <div className="custom-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 mb-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Pricing in {cityData.name}
            </h3>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Starting from</p>
              <h3 className="font-bold text-[#354B9C] mb-1">
                {formatCurrency(cityData.basePrice)}
              </h3>
              <p className="text-sm text-gray-600">per trip (base fare)</p>
            </div>

            <div className="mb-3">
              <p className="font-semibold mb-2">Popular vehicle types:</p>
              <div className="flex flex-wrap gap-2">
                <Chip label="Hatchback" variant="outlined" />
                <Chip label="Sedan" variant="outlined" />
                <Chip label="SUV" variant="outlined" />
              </div>
            </div>

            <p className="text-sm text-gray-600">
              * Final fare may vary based on distance, time, and vehicle type
            </p>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
              Benefits of Hiring Drivers in {cityData.name}
            </h2>

            <div className="mb-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <CheckCircle color="primary" />
                  <p className="text-base">{benefit}</p>
                </div>
              ))}
            </div>

            <Button
              component={Link}
              href="/book-driver"
              variant="contained"
              size="large"
              className="px-6 py-3 text-lg font-semibold"
            >
              Book Your Driver Now
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#354B9C] text-white py-8 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Ready to Book a Driver in {cityData.name}?
          </h2>

          <p className="text-lg mb-4 opacity-90">
            Join thousands of satisfied customers who trust TOP4 Call Drivers
            for their transportation needs
          </p>

          <Button
            component={Link}
            href="/book-driver"
            variant="contained"
            size="large"
            className="bg-white text-[#354B9C] px-8 py-4 text-lg font-semibold hover:bg-white/90"
            startIcon={<Phone />}
          >
            Book Driver Now
          </Button>
        </div>
      </div>
    </div>
  );
}
