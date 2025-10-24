// components/HeroSection.tsx
import BookingForm from "@/components/forms/BookingForm";
import { JSX } from "@emotion/react/jsx-runtime";

export default function HeroSection(): JSX.Element {
  return (
    <section
      id="home-hero"
      aria-label="Hero"
      className="bg-slate-100 -mt-[64px] pt-[64px] xl:-ml-1 flex items-end"
      style={{
        backgroundImage: "url(/images/top4-call-drivers-hero-img.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
    >
      <div className="custom-container w-full ">
        <div className="lg:flex items-end lg:gap-5">
          {/* Content aligned to bottom left */}
          <div>
            <h1 className="font-extrabold leading-tight mb-4 text-white text-4xl lg:text-5xl">
              <span className="text-sm font-semibold tracking-wider mb-3 text-white">TOP4 CALL DRIVERS</span><br/>
              Your Ride, Our <span className="font-semibold tracking-wider mb-3 text-white">Responsibility</span>
            </h1>
          </div>

          {/* Right Content - Booking Form (commented out as in original) */}
          <div className="flex place-items-end justify-end">
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