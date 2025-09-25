import { CityData } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import {
  Phone
} from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";

interface HeroSectionProps {
  cityData: CityData;
}

export default function HeroSection({ cityData }: HeroSectionProps) {

  return (
    <section>
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
    </section>
  );
}
