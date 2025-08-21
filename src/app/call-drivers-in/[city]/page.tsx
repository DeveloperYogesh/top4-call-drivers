import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPage from '@/components/pages/CityPage';
import { generateCityMetadata, getCityData } from '@/lib/seo';
import { SUPPORTED_CITIES } from '@/utils/constants';

type Params = {
  params: {
    city: string;
  };
};

/**
 * If you want strict static generation for only the supported cities,
 * set dynamicParams = false. If you want fallback behavior, remove/adjust it.
 */
export const dynamicParams = false;

/**
 * ISR: regenerate the page at most once per hour.
 * Adjust seconds (3600) to your needs or remove to default static behavior.
 */
export const revalidate = 3600;

/**
 * generateMetadata runs at build-time / per-request depending on dynamic settings.
 * We keep it synchronous-friendly but allow for async sources by returning Promise<Metadata>.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cityData = await Promise.resolve(getCityData(params.city));
  if (!cityData) {
    return {
      title: 'City Not Found',
      description: 'The requested city page was not found.',
    };
  }
  return generateCityMetadata(cityData);
}

/**
 * Pre-generate routes for all supported cities.
 * Using `satisfies` helps TypeScript verify the return shape.
 */
export async function generateStaticParams() {
  return SUPPORTED_CITIES.map((city) => ({ city: city.slug })) satisfies Array<{ city: string }>;
}

/**
 * Page route component.
 * We call getCityData once and use `notFound()` when missing.
 */
export default async function CityPageRoute({ params }: Params) {
  // Normalize slug if your SUPPORTED_CITIES uses lowercased slugs:
  const slug = params.city;

  // Support both sync and async getCityData implementations:
  const cityData = await Promise.resolve(getCityData(slug));

  if (!cityData) {
    notFound();
  }

  return <CityPage cityData={cityData} />;
}
