import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie, validateMobileNumber, validateEmail, hashPassword } from '@/lib/auth';
import { findUserByMobile, createUser, userToAuthUser, verifyOTP } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      firstName,
      lastName,
      phone,
      email,
      password,
      otp
    } = body;

    // Validate required fields
    if (!phone || !firstName || !email || !password || !otp) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Phone, first name, email, password, and OTP are required' 
        },
        { status: 400 }
      );
    }

    // Validate mobile number format
    if (!validateMobileNumber(phone)) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid mobile number format' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Password must be at least 6 characters long' 
        },
        { status: 400 }
      );
    }

    // Verify OTP
    const isOTPValid = await verifyOTP(phone, otp);
    if (!isOTPValid) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid or expired OTP' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByMobile(phone);
    if (existingUser) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'User with this mobile number already exists' 
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const user = await createUser({
      mobileno: phone,
      firstname: firstName,
      lastname: lastName || '',
      emailid: email,
      passwordHash,
      isVerified: true, // Since OTP is verified
      isActive: true
    });

    // Convert to AuthUser and create token
    const authUser = userToAuthUser(user);
    const token = createToken(authUser);

    // Create response with cookie
    const response = NextResponse.json({
      status: 'success',
      message: 'User registered successfully',
      user: authUser
    });

    // Set the httpOnly cookie
    response.headers.set('Set-Cookie', setAuthCookie(token));

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Registration failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}