import { NextRequest, NextResponse } from 'next/server';
import { validateMobileNumber } from '@/lib/auth';

// External OTP API (the one that works in Postman)
const EXTERNAL_SEND_OTP_URL = 'http://top4mobileapp.vbsit.in/api/V1/booking/sendOTP';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobileno, phone } = body;

    // Accept both 'phone' and 'mobileno' for compatibility
    const mobileNumber = phone || mobileno;

    // Validate input
    if (!mobileNumber || typeof mobileNumber !== 'string') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Mobile number is required',
        },
        { status: 400 },
      );
    }

    // Validate mobile number format
    if (!validateMobileNumber(mobileNumber)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid mobile number format. Please enter a valid 10-digit Indian mobile number.',
        },
        { status: 400 },
      );
    }

    // Proxy request to the external SMS provider API (same as Postman)
    const externalRes = await fetch(EXTERNAL_SEND_OTP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobileno: mobileNumber }),
      // Optional timeout using AbortController could be added if needed
    });

    const externalJson = await externalRes.json().catch(() => ({ status: 'error', message: 'Invalid response from SMS provider' }));

    if (!externalRes.ok) {
      return NextResponse.json(
        {
          status: 'error',
          message: externalJson?.message || 'SMS provider error',
        },
        { status: externalRes.status },
      );
    }

    // Normalize response to our app format while preserving provider message/otp if present
    return NextResponse.json({
      status: 'success',
      message: externalJson?.message || 'OTP sent successfully to your mobile number',
      otp: externalJson?.otp,
      provider: externalJson?.status || 'success',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to send OTP. Please try again.',
      },
      { status: 500 },
    );
  }
}