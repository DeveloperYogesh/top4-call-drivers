import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateCityMetadata, getCityData } from "@/lib/seo";
import { SUPPORTED_CITIES } from "@/utils/constants";
import { JSX } from "@emotion/react/jsx-runtime";
import DriverJobPage from "@/components/pages/driverJobPage";

type PageProps = {
  params: Promise<{ city: string }>;
};

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const cityData = await Promise.resolve(getCityData(city));

  if (!cityData) {
    return {
      title: "Driver Jobs Not Available",
      description: "Driver job opportunities are not available in this city.",
    };
  }

  return {
    title: `Driver Jobs in ${cityData.name} | TOP4 Call Drivers`,
    description: `Join TOP4 as a professional driver in ${cityData.name}. Earn competitive pay, enjoy flexible hours, and get full support. Apply now!`,
    keywords: [`driver jobs ${cityData.name}`, `car driver hiring ${cityData.name}`, `TOP4 driver jobs`],
    openGraph: {
      title: `Driver Jobs in ${cityData.name}`,
      description: `Become a driver with TOP4 in ${cityData.name}. Flexible schedule, great earnings, and more!`,
      type: "website",
      url: `https://yourdomain.com/car-driver-job-in/${cityData.slug}`,
    },
    // Add JobPosting schema
    alternates: {
      canonical: `https://yourdomain.com/car-driver-job-in/${cityData.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return SUPPORTED_CITIES.map((city) => ({ city: city.slug }));
}

export default async function DriverJobPageRoute({ params }: PageProps): Promise<JSX.Element> {
  const { city } = await params;
  const cityData = await Promise.resolve(getCityData(city));

  if (!cityData) notFound();

  return <DriverJobPage cityData={cityData} />;
}