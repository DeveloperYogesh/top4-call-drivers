// app/call-drivers-in/[city]/page.tsx   <-- note .tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPage from '@/components/pages/CityPage';
import { generateCityMetadata, getCityData } from '@/lib/seo';
import { SUPPORTED_CITIES } from '@/utils/constants';
import { JSX } from '@emotion/react/jsx-runtime';

type PageProps = {
  params: { city: string };
};

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cityData = await Promise.resolve(getCityData(params.city));
  if (!cityData) {
    return {
      title: 'City Not Found',
      description: 'The requested city page was not found.',
    };
  }
  return generateCityMetadata(cityData);
}

export async function generateStaticParams() {
  return SUPPORTED_CITIES.map((city) => ({ city: city.slug })) satisfies Array<{ city: string }>;
}

export default async function CityPageRoute({ params }: PageProps): Promise<JSX.Element> {
  const slug = params.city;
  const cityData = await Promise.resolve(getCityData(slug));

  if (!cityData) notFound();

  return <CityPage cityData={cityData} />;
}
