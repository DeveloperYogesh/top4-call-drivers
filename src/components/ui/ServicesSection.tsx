import {
  DirectionsCar,
  LocalCarWash,
  Toll,
  CleaningServices,
  Build,
  Security,
} from "@mui/icons-material";
import Link from "next/link";
import { SERVICES, ROUTES } from "@/utils/constants";

// Define icon map for services
const iconMap = {
  DirectionsCar,
  LocalCarWash,
  Toll,
  CleaningServices,
  Build,
  Security,
};

type IconMap = typeof iconMap;     // inferred type
type IconKey = keyof IconMap;      // "DirectionsCar" | "LocalCarWash" | ...

export default function ServicesSection() {
  return (
    <div className="bg-white">
      <div className="custom-container">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive car services and professional drivers at your fingertips
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.icon as IconKey] || DirectionsCar;

            return (
              <div key={service.id}>
                <div className="h-full flex flex-col relative overflow-hidden bg-white rounded-lg my-border">
                  {/* Service Icon */}
                  <div className="p-3 flex justify-center bg-gradient-to-r from-blue-200/20 to-blue-600/10">
                    <div className="service-icon w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center transition-all duration-300">
                      <IconComponent className="text-[40px] text-white" />
                    </div>
                  </div>

                  <div className="flex-grow p-3">
                    <h3 className="text-xl font-semibold !mt-0 !mb-2 text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-2">
                      {service.available ? (
                        <Link
                          href={
                            service.id === "professional-drivers"
                              ? ROUTES.BOOK_DRIVER
                              : `${ROUTES.SERVICES}/${service.id}`
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-[#354B9C] px-4 py-2 text-sm font-semibold text-[#354B9C] transition hover:bg-[#354B9C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#354B9C]"
                        >
                          {service.id === "professional-drivers"
                            ? "Book Now"
                            : "Learn More"}
                          <span aria-hidden="true">→</span>
                        </Link>
                      ) : (
                        <span className="inline-flex rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-semibold text-gray-400">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Availability Badge */}
                  {service.available && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-0.5 rounded-lg text-xs font-semibold">
                      Available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <section>
          <div className="text-center custom-container">
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">
              Simplify Car Ownership
            </h3>
            <p className="text-base text-gray-600 mb-4 max-w-2xl mx-auto">
              Download the TOP4 Call Drivers app on iOS / Android phones for a seamless car ownership experience. Track all your bookings and get rewarded for every transaction.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href={ROUTES.DOWNLOAD}
                className="inline-flex items-center justify-center rounded-full bg-[#354B9C] px-6 py-3 text-lg font-semibold text-white transition hover:bg-[#2b3d83] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b3d83]"
              >
                Download App
              </Link>
              <Link
                href={ROUTES.SERVICES}
                className="inline-flex items-center justify-center rounded-full border border-[#354B9C] px-6 py-3 text-lg font-semibold text-[#354B9C] transition hover:bg-[#354B9C]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#354B9C]"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
