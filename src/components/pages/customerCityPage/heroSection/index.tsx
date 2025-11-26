import { CityData } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import Link from "next/link";

interface HeroSectionProps {
  cityData: CityData;
}

const PhoneIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

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

            <div className="my-6 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/book-driver"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-lg font-semibold text-[#354B9C] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <PhoneIcon />
                Book Driver Now
              </Link>

              <Link
                href="/call-drivers-tariff"
                className="inline-flex items-center justify-center rounded-full border border-white px-6 py-3 text-lg font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Check Tariff
              </Link>
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
