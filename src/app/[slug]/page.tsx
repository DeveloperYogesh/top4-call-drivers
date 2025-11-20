import { Metadata } from "next";
import { notFound } from "next/navigation";
import DriverJobPage from "@/components/pages/driverJobPage";
import { generateCityMetadata, getCityData } from "@/lib/seo";
import { SUPPORTED_CITIES } from "@/utils/constants";
import CustomerCityPage from "@/components/pages/customerCityPage";

// Use inline typing for params to avoid alias conflicts with Next.js generated types

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) return {}; // Handle empty slug case

  if (slug.startsWith("best-acting-drivers-in-")) {
    const city = slug.replace("best-acting-drivers-in-", "");
    const cityData = await Promise.resolve(getCityData(city));
    if (!cityData) {
      return {
        title: "City Not Found",
        description: "The requested city page was not found.",
      };
    }
    return generateCityMetadata(cityData);
  } else if (slug.startsWith("car-driver-job-in-")) {
    const city = slug.replace("car-driver-job-in-", "");
    const cityData = await Promise.resolve(getCityData(city));
    if (!cityData) {
      return {
        title: "Driver Jobs Not Available",
        description: "Driver job opportunities are not available in this city.",
      };
    }
    return {
      title: `Car Driver Jobs in ${cityData.name} | TOP4 Call Drivers`,
      description: `Join TOP4 as a professional driver in ${cityData.name}. Earn competitive pay, enjoy flexible hours, and get full support. Apply now!`,
      alternates: {
        canonical: `https://top4calldrivers.com/${slug}`,
      },
    };
  }
  return {};
}

export async function generateStaticParams() {
  return SUPPORTED_CITIES.flatMap((city) => [
    { slug: `best-acting-drivers-in-${city.slug}` },
    { slug: `car-driver-job-in-${city.slug}` },
  ]);
}

export default async function SlugPageRoute({ params }: any) {
  const { slug } = await params;

  if (!slug) notFound(); // Next.js should always provide a slug for dynamic routes

  if (slug.startsWith("best-acting-drivers-in-")) {
    const city = slug.replace("best-acting-drivers-in-", "");
    const cityData = await Promise.resolve(getCityData(city));
    if (!cityData) notFound();
    return <CustomerCityPage cityData={cityData} />;
  } else if (slug.startsWith("car-driver-job-in-")) {
    const city = slug.replace("car-driver-job-in-", "");
    const cityData = await Promise.resolve(getCityData(city));
    if (!cityData) notFound();
    return <DriverJobPage cityData={cityData} />;
  }
  notFound();
}