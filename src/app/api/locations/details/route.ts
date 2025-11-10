import { NextRequest, NextResponse } from 'next/server';
import { getPlaceDetails } from '@/lib/google-places';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
      return NextResponse.json(
        { status: 'error', message: 'placeId parameter is required' },
        { status: 400 }
      );
    }

    const placeDetails = await getPlaceDetails(placeId);

    if (!placeDetails) {
      return NextResponse.json(
        { status: 'error', message: 'Place details not found' },
        { status: 404 }
      );
    }

    // Extract coordinates from Google Places API response
    const lat = placeDetails.geometry?.location?.lat;
    const lng = placeDetails.geometry?.location?.lng;

    // Extract city and state from address components
    let city: string | undefined;
    let state: string | undefined;

    if (placeDetails.address_components) {
      for (const component of placeDetails.address_components) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
        if (!city && component.types.includes('sublocality')) {
          city = component.long_name;
        }
      }
    }

    return NextResponse.json({
      status: 'success',
      data: {
        id: placeDetails.place_id || placeId,
        name: placeDetails.formatted_address || placeDetails.name || placeId,
        address: placeDetails.formatted_address || placeDetails.name,
        city,
        state,
        lat,
        lng,
      },
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch place details' },
      { status: 500 }
    );
  }
}

