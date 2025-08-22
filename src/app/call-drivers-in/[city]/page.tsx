// app/call-drivers-in/[city]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPage from '@/components/pages/CityPage';
import { generateCityMetadata, getCityData } from '@/lib/seo';
import { SUPPORTED_CITIES } from '@/utils/constants';
import { JSX } from '@emotion/react/jsx-runtime';

type PageProps = {
  params: Promise<{ city: string }>; // 👈 params is async now
};

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params; // 👈 await params
  const cityData = await Promise.resolve(getCityData(city));

  if (!cityData) {
    return {
      title: 'City Not Found',
      description: 'The requested city page was not found.',
    };
  }
  return generateCityMetadata(cityData);
}

export async function generateStaticParams() {
  return SUPPORTED_CITIES.map((city) => ({ city: city.slug }));
}

export default async function CityPageRoute({ params }: PageProps): Promise<JSX.Element> {
  const { city } = await params; // 👈 await params
  const cityData = await Promise.resolve(getCityData(city));

  if (!cityData) notFound();

  return <CityPage cityData={cityData} />;
}
