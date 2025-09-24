import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie, validateMobileNumber, validateEmail, comparePassword } from '@/lib/auth';
import { findUserByMobile, findUserByEmail, userToAuthUser } from '@/lib/database';

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

      const user = await findUserByEmail(email);

      if (!user) {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'User not found with this email' 
          },
          { status: 404 }
        );
      }

      if (!user.passwordHash) {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Password not set for this account. Please use OTP login.' 
          },
          { status: 400 }
        );
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Invalid password' 
          },
          { status: 401 }
        );
      }

      // Check if user is active
      if (!user.isActive) {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Account is deactivated. Please contact support.' 
          },
          { status: 403 }
        );
      }

      // Convert to AuthUser and create token
      const authUser = userToAuthUser(user);
      const token = createToken(authUser);

      // Create response with cookie
      const response = NextResponse.json({
        status: 'success',
        message: 'Login successful',
        user: authUser
      });

      // Set the httpOnly cookie
      response.headers.set('Set-Cookie', setAuthCookie(token));

      return response;
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