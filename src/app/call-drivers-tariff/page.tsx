import Faq from "@/components/common/faq";
import TariffPageCotainer from "@/components/pages/callDriversTariff";
import React from "react";

export const metadata = {
  title: "TOP4 Call Drivers Tariff List | Affordable Driver Charges",
  description:
    "Check TOP4 Call Drivers Tariff List for normal cars, luxury cars, outstation trips, valet parking, and monthly plans. Transparent pricing & professional drivers.",
};

export default function TariffPage() {
  return (
    <>
      <TariffPageCotainer />
      <Faq bgColor="bg-white" pathname={"/call-drivers-tariff"} />
    </>
  );
}
