import Image from "next/image";
import React from "react";
import TextReveal from "./textRevealing";

type City = {
  name: string;
  description: string;
  number: string;
};

const cities: City[] = [
  {
    name: "Active Users",
    description:
      "Trusted by over 20,000 users who rely on Top4 Call Drivers for safe and convenient rides every day.",
    number: "20K",
  },
  {
    name: "Years in Business",
    description:
      "With over two decades of experience, Top4 Call Drivers delivers reliable and professional driver services",
    number: "20",
  },
  {
    name: "Connected Drivers",
    description:
      "A growing network of skilled and verified drivers ready to serve you anytime, anywhere",
    number: "5",
  },
  {
    name: "Happy Trips",
    description:
      "More than 90,000 successful trips completed with satisfied customers across multiple cities",
    number: "90K",
  },
];

export default function NumbersSection() {
  return (
    <section className="bg-gray-50">
      <div className="custom-container">
        <div className="text-center">
          <TextReveal />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 mt-6">
          {cities.map((item, i) => (
            <div key={i}>
              <div className="text-center max-w-xs">
                <h3 className="!text-5xl font-bold text-[#354B9C]">
                  {item.number}
                  <span className="text-3xl">+</span>
                </h3>
                <h3 className="!m-0 group-hover:text-blue-600">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
