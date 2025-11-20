import Faq from "@/components/common/faq";
import { CityData } from "@/types";
import { APP_CONFIG } from "@/utils/constants";
import { generateStructuredData } from "@/lib/seo";
import AreasCoveredSection from "./areasCoveredSection";
import BenefitsSection from "./benefitsSection";
import CtaSection from "./ctaSection";
import FeaturesSection from "./featuresSection";
import HeroSection from "./heroSection";
import TariffTableContentSection from "./tariffTableContentSection";

interface CustomerCityPageProps {
  cityData: CityData;
}

export default function CustomerCityPage({ cityData }: CustomerCityPageProps) {
  const pagePath = `/best-acting-drivers-in-${cityData.slug}`;
  const pageUrl = `${APP_CONFIG.url}${pagePath}`;
  const serviceSchema = generateStructuredData("service", {
    name: `Professional Drivers in ${cityData.name}`,
    description: cityData.description,
    cities: [cityData.name],
    state: cityData.state,
  });
  const breadcrumbSchema = generateStructuredData("breadcrumb", {
    items: [
      { name: "Home", url: APP_CONFIG.url },
      { name: `Drivers in ${cityData.name}`, url: pageUrl },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HeroSection cityData={cityData} />
      <TariffTableContentSection pathname={pagePath} />
      <FeaturesSection cityData={cityData} />
      <AreasCoveredSection cityData={cityData} />
      <BenefitsSection cityData={cityData} />
      <CtaSection cityData={cityData} />
      <Faq bgColor="bg-white" pathname={pagePath} />
    </>
  );
}
