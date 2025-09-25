import { CityData } from "@/types";
import AreasCoveredSection from "./areasCoveredSection";
import BenefitsSection from "./benefitsSection";
import CtaSection from "./ctaSection";
import FeaturesSection from "./featuresSection";
import HeroSection from "./heroSection";
import TariffTableContentSection from "./tariffTableContentSection";
import Faq from "@/components/common/faq";

interface CustomerCityPageProps {
  cityData: CityData;
}
export default function CustomerCityPage({ cityData }: CustomerCityPageProps) {

  console.log("cityData", cityData);
  

  return (
    <>
      <HeroSection cityData={cityData} />
      <TariffTableContentSection pathname={`/best-acting-drivers-in-${cityData.slug}`} />
      <FeaturesSection cityData={cityData} />
      <AreasCoveredSection cityData={cityData} />
      <BenefitsSection cityData={cityData} />
      <CtaSection cityData={cityData} />
      <Faq bgColor="bg-white" pathname={`/best-acting-drivers-in-${cityData.slug}`} />
    </>
  );
}
