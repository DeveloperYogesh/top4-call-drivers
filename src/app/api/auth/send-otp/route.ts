import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, validateMobileNumber } from '@/lib/auth';
import { storeOTP } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobileno } = body;

    // Validate input
    if (!mobileno || typeof mobileno !== 'string') {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Mobile number is required' 
        },
        { status: 400 }
      );
    }

    // Validate mobile number format
    if (!validateMobileNumber(mobileno)) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid mobile number format. Please enter a valid 10-digit Indian mobile number.' 
        },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in database (expires in 5 minutes)
    await storeOTP(mobileno, otp, 5);

    // In a real application, you would send the OTP via SMS here
    // For development, we'll log it to console
    console.log(`OTP for ${mobileno}: ${otp}`);

    // Simulate SMS sending success
    return NextResponse.json({
      status: 'success',
      message: 'OTP sent successfully to your mobile number',
      // In development, include OTP for testing (remove in production)
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to send OTP. Please try again.' 
      },
      { status: 500 }
    );
  }
}