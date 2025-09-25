import { CityData } from "@/types";
import {
    Phone
} from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";

interface CtaSectionProps {
  cityData: CityData;
}

export default function CtaSection({ cityData }: CtaSectionProps) {

  return (
    <section>
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
    </section>
  );
}
