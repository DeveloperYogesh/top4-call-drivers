import React from "react";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import HomeContainer from "@/components/pages/home";

export const metadata = generateSEOMetadata({
  title: "No. 1 Driver Service: Hire TOP4 Call Drivers Online",
  description:
    "Hire verified, professional drivers for hassle-free commutes, running errands and safe after-party drops. Book car wash, maintenance, insurance and more services.",
  keywords: [
    "professional drivers",
    "hire driver online",
    "car driver service",
    "driver booking",
    "car wash service",
    "car maintenance",
    "fastag recharge",
    "car insurance",
  ],
});

export default function HomePage() {
  return <HomeContainer />;
}
