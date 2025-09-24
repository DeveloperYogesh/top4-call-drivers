import { NextRequest, NextResponse } from 'next/server';
import { getAllVehicleTypes, getAllTripTypes } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const vehicleTypes = await getAllVehicleTypes();
    const tripTypes = await getAllTripTypes();
    
    return NextResponse.json({
      status: 'success',
      message: 'Vehicle data retrieved successfully',
      data: {
        vehicleTypes,
        tripTypes
      }
    });

  } catch (error) {
    console.error('Get vehicles error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve vehicle data' 
      },
      { status: 500 }
    );
  }
}