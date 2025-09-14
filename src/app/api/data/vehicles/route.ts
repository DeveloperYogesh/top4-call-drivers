import { NextRequest, NextResponse } from 'next/server';

// Static data for vehicles (GetVehicleLists and GetTripandVehicleTypes from Postman)
const vehicles = {
  categories: [
    { id: 1, name: 'SEDAN', description: 'Comfortable 4-seater cars' },
    { id: 2, name: 'SUV', description: 'Spacious 6-7 seater vehicles' },
    { id: 3, name: 'HATCHBACK', description: 'Compact 4-seater cars' },
    { id: 4, name: 'PREMIUM', description: 'Luxury vehicles' }
  ],
  types: [
    { id: 1, categoryId: 1, name: 'DZIRE', category: 'SEDAN', fuel: 'Petrol/Diesel' },
    { id: 2, categoryId: 1, name: 'ETIOS', category: 'SEDAN', fuel: 'Petrol/Diesel' },
    { id: 3, categoryId: 1, name: 'AMAZE', category: 'SEDAN', fuel: 'Petrol/Diesel' },
    { id: 4, categoryId: 2, name: 'INNOVA', category: 'SUV', fuel: 'Diesel' },
    { id: 5, categoryId: 2, name: 'ERTIGA', category: 'SUV', fuel: 'Petrol/Diesel' },
    { id: 6, categoryId: 2, name: 'XUV500', category: 'SUV', fuel: 'Diesel' },
    { id: 7, categoryId: 3, name: 'SWIFT', category: 'HATCHBACK', fuel: 'Petrol/Diesel' },
    { id: 8, categoryId: 3, name: 'ALTO', category: 'HATCHBACK', fuel: 'Petrol' },
    { id: 9, categoryId: 4, name: 'CAMRY', category: 'PREMIUM', fuel: 'Petrol/Hybrid' },
    { id: 10, categoryId: 4, name: 'ACCORD', category: 'PREMIUM', fuel: 'Petrol/Hybrid' }
  ],
  transmissionTypes: [
    { id: 1, name: 'Manual' },
    { id: 2, name: 'Automatic' }
  ],
  tripTypes: [
    { id: 1, name: 'InCity', description: 'Within city limits' },
    { id: 2, name: 'Outstation', description: 'Outside city limits' },
    { id: 3, name: 'Round Trip', description: 'Two-way journey' },
    { id: 4, name: 'One Way', description: 'Single direction travel' }
  ]
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'success',
      vehicles
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch vehicle data' 
      },
      { status: 500 }
    );
  }
}