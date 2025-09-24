import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { getDriverLocation, updateDriverLocation } from '@/lib/database';

// GET /api/tracking/driver - Get driver location for a booking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Booking ID is required' 
        },
        { status: 400 }
      );
    }

    // Get driver location for the booking
    const driverLocation = await getDriverLocation(bookingId);

    if (!driverLocation) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Driver location not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Driver location retrieved successfully',
      data: driverLocation
    });

  } catch (error) {
    console.error('Get driver location error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve driver location' 
      },
      { status: 500 }
    );
  }
}

// POST /api/tracking/driver - Update driver location (for drivers)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      bookingId,
      latitude,
      longitude,
      heading,
      speed,
      accuracy
    } = body;

    // Validate required fields
    if (!bookingId || !latitude || !longitude) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Booking ID, latitude, and longitude are required' 
        },
        { status: 400 }
      );
    }

    // Update driver location
    const locationUpdate = await updateDriverLocation({
      bookingId,
      driverId: user.id,
      latitude,
      longitude,
      heading: heading || 0,
      speed: speed || 0,
      accuracy: accuracy || 0,
      timestamp: new Date()
    });

    return NextResponse.json({
      status: 'success',
      message: 'Driver location updated successfully',
      data: locationUpdate
    });

  } catch (error) {
    console.error('Update driver location error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to update driver location' 
      },
      { status: 500 }
    );
  }
}

