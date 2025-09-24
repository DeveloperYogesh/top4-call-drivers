import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces } from '@/lib/google-places';
import { Location } from '@/types';

function normalizeLocations(list: Location[]) {
  return list.map(loc => ({
    id: loc.id,
    name: loc.name,
    city: loc.city ?? '',
    state: loc.state ?? '',
    // leave raw Lat/Lng undefined if not availabl
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Query parameter is required' 
      },
      { status: 400 }
    );
  }

  try {
    const predictions = await searchPlaces(query);
    
    // Transform Google Places predictions to our Location format
    const locations: Location[] = predictions.map((prediction: any, index: number) => ({
      id: prediction.place_id || `place_${index}`,
      name: prediction.description || prediction.structured_formatting?.main_text || '',
      city: prediction.structured_formatting?.secondary_text?.split(',')[0]?.trim() || '',
      state: prediction.structured_formatting?.secondary_text?.split(',')[1]?.trim() || '',
      coordinates: undefined, // Will be populated when place details are fetched
    }));

    return NextResponse.json({ status: 'success', data: locations });
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to search for locations' 
      },
      { status: 500 }
    );
  }
}
