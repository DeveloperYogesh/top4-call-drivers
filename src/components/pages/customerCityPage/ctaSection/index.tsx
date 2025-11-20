import { CityData } from "@/types";
import Link from "next/link";

interface CtaSectionProps {
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

          <Link
            href="/book-driver"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#354B9C] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <PhoneIcon />
            Book Driver Now
          </Link>
        </div>
      </div>
    </section>
  );
}
