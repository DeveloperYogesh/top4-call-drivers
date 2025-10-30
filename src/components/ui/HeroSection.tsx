// components/HeroSection.tsx
import { JSX } from "@emotion/react/jsx-runtime";
import BookingForm from "../forms/bookingForm";

export default function HeroSection(): JSX.Element {
  return (
    <section
      id="home-hero"
      aria-label="Hero"
      className="bg-slate-100 -mt-[64px] pt-[64px] xl:-ml-1 flex items-end"
      style={{
        backgroundImage: "url(/images/top4-call-driver-hero-image.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
    >
      <div className="custom-container w-full ">
        <div className="lg:flex items-end justify-between lg:gap-5">
          {/* Content aligned to bottom left */}
          <div>
            <h1 className="font-extrabold leading-tight mb-4 text-white text-4xl">
              <span className="text-sm font-semibold tracking-wider mb-3 text-white">TOP4 CALL DRIVERS</span><br/>
              Your Ride, Our <span className="font-semibold tracking-wider mb-3 text-white">Responsibility</span>
            </h1>
            <p className="text-white !text-lg mb-5 lg:mb-0">Book Verified and Experienced Call Drivers Anytime for a Safe, Comfortable, and Hassle-Free Ride 24/7</p>
          </div>

          {/* Right Content - Booking Form (commented out as in original) */}
          <div className="flex items-center justify-center min-h-[550px] w-full max-w-md">
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