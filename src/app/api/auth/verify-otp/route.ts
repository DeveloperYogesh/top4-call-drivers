import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie } from '@/lib/auth';
import { verifyOTP, findUserByMobile, createUser, userToAuthUser } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobileno, phone, OTP, otp, devicetoken } = body;
    
    // Accept both parameter names for compatibility
    const mobileNumber = phone || mobileno;
    const otpCode = otp || OTP;

    // Validate input
    if (!mobileNumber || !otpCode) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Mobile number and OTP are required' 
        },
        { status: 400 }
      );
    }

    // Verify OTP
    const isOTPValid = await verifyOTP(mobileNumber, otpCode);
    
    if (!isOTPValid) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid or expired OTP' 
        },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await findUserByMobile(mobileNumber);
    
    if (!user) {
      // Create new user with basic info
      user = await createUser({
        mobileno: mobileNumber,
        firstname: 'User', // Default name, can be updated later
        lastname: '',
        isVerified: true, // Since OTP is verified
        isActive: true
      });
    } else {
      // Update user verification status
      user.isVerified = true;
    }

    // Convert to AuthUser and create token
    const authUser = userToAuthUser(user);
    const token = createToken(authUser);

    // Create response with cookie
    const response = NextResponse.json({
      status: 'success',
      message: 'OTP verified successfully',
      user: authUser
    });

    // Set the httpOnly cookie
    response.headers.set('Set-Cookie', setAuthCookie(token));

    return response;

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to verify OTP. Please try again.' 
      },
      { status: 500 }
    );
  }
}