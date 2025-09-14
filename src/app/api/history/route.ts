import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { getUserBookings } from '@/lib/database';

// GET /api/history - Get booking history (same as GET /api/bookings but different endpoint for Postman compatibility)
export async function GET(request: NextRequest) {
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

    // Get user's booking history
    const bookings = await getUserBookings(user.id);

    // Format response similar to Postman collection
    const history = bookings.map(booking => ({
      id: booking.id,
      customerName: booking.customerName,
      travelDate: booking.travelDate,
      travelTime: booking.travelTime,
      pickupPlace: booking.pickupPlace,
      dropPlace: booking.dropPlace,
      vehicleCategory: booking.vehicleCategory,
      vehicleType: booking.vehicleType,
      tripType: booking.tripType,
      travelType: booking.travelType,
      paymentType: booking.paymentType,
      tripAmt: booking.tripAmt,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));

    return NextResponse.json({
      status: 'success',
      message: 'Booking history retrieved successfully',
      history
    });

  } catch (error) {
    console.error('Get booking history error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch booking history' 
      },
      { status: 500 }
    );
  }
}