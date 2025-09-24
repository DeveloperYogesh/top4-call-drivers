import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { getBookingById, updateBookingStatus } from '@/lib/database';

// Helper to normalize id (handle string | string[])
function normalizeId(id: string | string[] | undefined): string | null {
  if (!id) return null;
  return Array.isArray(id) ? id[0] : id;
}

// GET /api/bookings/[id] - Get specific booking details
export async function GET(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  try {
    const id = normalizeId(context.params.id);
    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Missing id' }, { status: 400 });
    }

    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'Authentication required' }, { status: 401 });
    }

    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ status: 'error', message: 'Booking not found' }, { status: 404 });
    }

    if (booking.userId !== user.id) {
      return NextResponse.json({ status: 'error', message: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ status: 'success', booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch booking' }, { status: 500 });
  }
}

// PUT /api/bookings/[id] - Update booking status
export async function PUT(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  try {
    const id = normalizeId(context.params.id);
    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Missing id' }, { status: 400 });
    }

    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ status: 'error', message: 'Invalid request body' }, { status: 400 });
    }

    const { status } = body;
    const allowed = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!status || !allowed.includes(status)) {
      return NextResponse.json({ status: 'error', message: 'Invalid status' }, { status: 400 });
    }

    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ status: 'error', message: 'Booking not found' }, { status: 404 });
    }

    if (booking.userId !== user.id) {
      return NextResponse.json({ status: 'error', message: 'Access denied' }, { status: 403 });
    }

    const updatedBooking = await updateBookingStatus(id, status);

    return NextResponse.json({
      status: 'success',
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to update booking' }, { status: 500 });
  }
}
