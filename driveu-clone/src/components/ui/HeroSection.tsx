// components/HeroSection.tsx
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { JSX } from '@emotion/react/jsx-runtime';
import BookingForm from '@/components/forms/BookingForm';

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M12 2l7 3v5c0 5-3.8 9.8-7 11-3.2-1.2-7-6-7-11V5l7-3z" fill="currentColor" />
      </svg>
    ),
    text: 'Motor insurance is renewed',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M3 13l1.5-4.5C5 7 6 6 8 6h8c2 0 3 1 3.5 2.5L21 13v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM6.5 10.5h11" fill="currentColor" />
      </svg>
    ),
    text: 'Your car wash is booked',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M10 15l-3.5-3.5L8 10l2 2 6-6 1.5 1.5L10 15z" fill="currentColor" />
      </svg>
    ),
    text: 'Your FASTag is recharged',
  },
];

export default function HeroSection(): JSX.Element {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <p className="text-sm font-semibold text-blue-600 tracking-wider mb-3">SIMPLIFY CAR OWNERSHIP</p>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-gray-900">
              Hire professional drivers, and all car services at your fingertips.
            </h1>

            <p className="text-lg text-gray-600 mb-6">Get rewarded for owning a car!</p>

            {/* CTAs - Keep only Download App since booking is now integrated */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href={ROUTES.DOWNLOAD}
                className="inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-lg border-2 border-blue-600 text-blue-600 bg-white hover:bg-gray-50 transition-transform transform hover:-translate-y-0.5"
                aria-label="Download App"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 3v10M8 11l4 4 4-4M21 21H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                Download App
              </Link>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="p-4 text-center bg-white/90 rounded-xl border border-white/30 backdrop-blur-sm hover:-translate-y-1 transform transition-shadow duration-300 shadow-sm"
                >
                  <div className="flex items-center justify-center text-green-500 mb-2">
                    {f.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-700">{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Booking Form */}
          <div className="flex justify-center items-center">
            <BookingForm isEmbedded={true} />
          </div>
        </div>
      </div>

      {/* tiny server-safe styles for the floating animations */}
      <style>{`
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-float-slow { animation: floaty 3.5s ease-in-out infinite; }
        .animate-float-slower { animation: floaty 4.2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}