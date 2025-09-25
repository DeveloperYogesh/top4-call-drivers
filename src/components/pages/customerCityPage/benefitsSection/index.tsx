import { CityData } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import { CheckCircle } from "@mui/icons-material";
import { Button, Chip } from "@mui/material";
import Link from "next/link";

interface BenefitsSectionProps {
  cityData: CityData;
}

export default function BenefitsSection({ cityData }: BenefitsSectionProps) {
  const benefits = [
    "No surge pricing - transparent rates",
    "Professional and courteous drivers",
    "Real-time tracking and updates",
    "Flexible booking options",
    "Damage protection available",
    "Multiple payment options",
  ];

  return (
    <section>
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
    </section>
  );
}
