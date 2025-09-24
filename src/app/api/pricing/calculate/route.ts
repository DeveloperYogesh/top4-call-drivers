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

    // Calculate fare
    const fareDetails = await calculateFare({
      pickupPlace,
      dropPlace,
      vehicleType,
      tripType,
      distance: distance || 0,
      duration: duration || 0,
      travelDate,
      travelTime
    });

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

