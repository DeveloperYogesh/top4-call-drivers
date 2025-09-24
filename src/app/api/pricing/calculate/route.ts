import { NextRequest, NextResponse } from 'next/server';
import { calculateFare } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pickupPlace,
      dropPlace,
      vehicleType,
      tripType,
      distance,
      duration,
      travelDate,
      travelTime
    } = body;

    // Validate required fields
    if (!pickupPlace || !dropPlace || !vehicleType || !tripType) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing required fields for fare calculation' 
        },
        { status: 400 }
      );
    }

    // Calculate fare using database util signature: (tripType, vehicleType, distance, hours, cityId?)
    const distanceKm = typeof distance === 'number' ? distance : 0;
    const hours = typeof duration === 'number' ? duration : 0;
    const fareDetails = await calculateFare(tripType, vehicleType, distanceKm, hours);

    return NextResponse.json({
      status: 'success',
      message: 'Fare calculated successfully',
      data: fareDetails
    });

  } catch (error) {
    console.error('Calculate fare error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to calculate fare' 
      },
      { status: 500 }
    );
  }
}

