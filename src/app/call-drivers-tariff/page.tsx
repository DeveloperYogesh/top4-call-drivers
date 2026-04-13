import Faq from "@/components/common/faq";
import TariffPageCotainer from "@/components/pages/callDriversTariff";
import React from "react";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "TOP4 Call Drivers Tariff List | Affordable Driver Charges",
  description:
    "Check TOP4 Call Drivers Tariff List for normal cars, luxury cars, outstation trips, valet parking, and monthly plans. Transparent pricing & professional drivers.",
  keywords: [
    "call driver tariff",
    "acting driver charges",
    "driver service rates",
    "top4 driver pricing",
    "call driver charges chennai",
    "acting driver charges tiruppur",
    "driver booking cost",
  ],
  url: "/call-drivers-tariff",
  type: "website",
});

export default function TariffPage() {
  return (
    <>
      <TariffPageCotainer />
      <Faq bgColor="bg-white" pathname={"/call-drivers-tariff"} />
    </>
  );
}
