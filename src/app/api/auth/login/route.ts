import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie, validateMobileNumber, validateEmail, comparePassword } from '@/lib/auth';
import { findUserByMobile, userToAuthUser } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, password, otp } = body;

    // Support both phone/OTP and email/password login
    if (phone && otp) {
      // Phone + OTP login (redirect to verify-otp endpoint)
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Please use the verify-otp endpoint for OTP login' 
        },
        { status: 400 }
      );
    }

    if (email && password) {
      // Email + Password login
      if (!validateEmail(email)) {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Invalid email format' 
          },
          { status: 400 }
        );
      }

      // Find user by email (in our simple database, we'll search by email in the user records)
      // In a real application, you'd have proper email-based lookup
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Email/password login not yet implemented. Please use OTP login.' 
        },
        { status: 501 }
      );
    }

    // If neither valid combination is provided
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Please provide either (phone + otp) or (email + password)' 
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Login failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}