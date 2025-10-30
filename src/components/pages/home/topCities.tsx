import Image from "next/image";
import React from "react";

type City = {
  id: string;
  name: string;
  description: string;
  imgSrc: string;
};

const cities: City[] = [
  {
    id: "chennai",
    name: "Chennai",
    description:
      "Top4 Call Drivers brings you call driver service in Chennai right at your fingertips.",
    imgSrc: "/images/cities/tamilnadu-chennai-acting-drivers-top4-call-drivers.webp",
  },
  {
    id: "trichy",
    name: "Trichy",
    description:
      "Top4 Call Drivers brings you call driver service in Trichy right at your fingertips.",
    imgSrc: "/images/cities/tamilnadu-trichy-acting-drivers-top4-call-drivers.webp",
  },
  {
    id: "coimbatore",
    name: "Coimbatore",
    description:
      "Top4 Call Drivers brings you call driver service in Coimbatore right at your fingertips.",
    imgSrc: "/images/cities/tamilnadu-coimbatore-acting-drivers-top4-call-drivers.webp",
  },
  {
    id: "tiruppur",
    name: "Tiruppur",
    description:
      "Top4 Call Drivers brings you call driver service in Tiruppur right at your fingertips.",
    imgSrc: "/images/cities/tiruppur-acting-drivers-top4-call-drivers.webp",
  },
  {
    id: "madurai",
    name: "Madurai",
    description:
      "Top4 Call Drivers brings you call driver service in Madurai right at your fingertips.",
    imgSrc: "/images/cities/tamilnadu-madurai-meenakshi-temple.webp",
  },
];

export default function CallDrivers() {
  return (
    <section className="bg-gray-50">
      <div className="custom-container ">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Hire TOP4 Call Drivers
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            We provide Call driver services both in city limits and to
            outstations. We serve round the clock services with responsible
            drivers.
          </p>
        </div>

        {/* Top row - 3 cards */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {cities.map((city) => (
            <div
              key={city.id}
              className="flex items-center bg-white rounded-full p-2 max-w-sm border-1 border-gray-200 hover:border-blue-600 group"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border-1 border-gray-100">
                  <Image
                    src={city.imgSrc}
                    alt={city.name}
                    width={90}
                    height={90}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="text-left">
                <h3 className="!m-0 group-hover:text-blue-600 cursor-pointer">
                  <a href={`/best-acting-drivers-in-${city.id}`} title={`TOP4 Call Driver Services in ${city.name}`}>{city.name}</a>
                </h3>
                <p className="text-sm text-gray-600 mt-1">{city.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
