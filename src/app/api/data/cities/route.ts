import { NextRequest, NextResponse } from 'next/server';
import { getAllCities, getCitiesByState } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('stateId');
    
    let cities;
    
    if (stateId) {
      // Get cities for a specific state
      cities = await getCitiesByState(parseInt(stateId));
    } else {
      // Get all cities
      cities = await getAllCities();
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Cities retrieved successfully',
      data: cities
    });

  } catch (error) {
    console.error('Get cities error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve cities' 
      },
      { status: 500 }
    );
  }
}

