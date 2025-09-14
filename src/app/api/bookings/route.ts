import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { createBooking, getUserBookings } from '@/lib/database';

// GET /api/bookings - Get user's bookings (booking history)
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

    // Get user's bookings
    const bookings = await getUserBookings(user.id);

    return NextResponse.json({
      status: 'success',
      bookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch bookings' 
      },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking (InsertBooking from Postman)
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
      PhoneNo,
      CustomerName,
      TravelDate,
      TravelTime,
      pickuplatlon,
      droplatlon,
      PickupPlace,
      DropPlace,
      pickUpKMS,
      VehicleCategory,
      VehicleType,
      triptype,
      NOD,
      NOH,
      favdriverid,
      mailid,
      OutStCity,
      OutStState,
      TravelType,
      paymenttype,
      tripamt,
      Couponcode
    } = body;

    // Validate required fields
    if (!PhoneNo || !CustomerName || !TravelDate || !TravelTime || !PickupPlace || !DropPlace) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing required booking information' 
        },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await createBooking({
      userId: user.id,
      phoneNo: PhoneNo,
      customerName: CustomerName,
      travelDate: TravelDate,
      travelTime: TravelTime,
      pickupLatLon: pickuplatlon || '',
      dropLatLon: droplatlon || '',
      pickupPlace: PickupPlace,
      dropPlace: DropPlace,
      pickUpKMS: pickUpKMS || '',
      vehicleCategory: VehicleCategory || '',
      vehicleType: VehicleType || '',
      tripType: triptype || '',
      nod: NOD || '',
      noh: NOH || '',
      favDriverId: favdriverid,
      mailId: mailid,
      outStCity: OutStCity || '0',
      outStState: OutStState || '0',
      travelType: TravelType || '',
      paymentType: paymenttype || 'Cash',
      tripAmt: tripamt || 0,
      couponCode: Couponcode
    });

    return NextResponse.json({
      status: 'success',
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to create booking' 
      },
      { status: 500 }
    );
  }
}