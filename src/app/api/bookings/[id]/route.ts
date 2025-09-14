import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { getBookingById, updateBookingStatus } from '@/lib/database';

// GET /api/bookings/[id] - Get specific booking details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const booking = await getBookingById(params.id);

    if (!booking) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Booking not found' 
        },
        { status: 404 }
      );
    }

    // Check if booking belongs to the user
    if (booking.userId !== user.id) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Access denied' 
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      status: 'success',
      booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch booking' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { status } = body;

    if (!status || !['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid status' 
        },
        { status: 400 }
      );
    }

    const booking = await getBookingById(params.id);

    if (!booking) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Booking not found' 
        },
        { status: 404 }
      );
    }

    // Check if booking belongs to the user
    if (booking.userId !== user.id) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Access denied' 
        },
        { status: 403 }
      );
    }

    const updatedBooking = await updateBookingStatus(params.id, status);

    return NextResponse.json({
      status: 'success',
      message: 'Booking updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to update booking' 
      },
      { status: 500 }
    );
  }
}