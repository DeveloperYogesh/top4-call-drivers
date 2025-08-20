import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPage from '@/components/pages/CityPage';
import { generateCityMetadata, getCityData } from '@/lib/seo';
import { SUPPORTED_CITIES } from '@/utils/constants';

interface CityPageProps {
  params: {
    city: string;
  };
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const cityData = getCityData(params.city);
  
  if (!cityData) {
    return {
      title: 'City Not Found',
      description: 'The requested city page was not found.',
    };
  }

  return generateCityMetadata(cityData);
}

export async function generateStaticParams() {
  return SUPPORTED_CITIES.map((city) => ({
    city: city.slug,
  }));
}

export default function CityPageRoute({ params }: CityPageProps) {
  const cityData = getCityData(params.city);

  if (!cityData) {
    notFound();
  }

  return <CityPage cityData={cityData} />;
}

