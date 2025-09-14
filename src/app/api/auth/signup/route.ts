import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie, validateMobileNumber, validateEmail } from '@/lib/auth';
import { findUserByMobile, createUser, userToAuthUser } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      mobileno, 
      firstname, 
      lastname, 
      emailid, 
      vehiclemodel, 
      segment, 
      vehicletype, 
      userImage 
    } = body;

    // Validate required fields
    if (!mobileno || !firstname) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Mobile number and first name are required' 
        },
        { status: 400 }
      );
    }

    // Validate mobile number format
    if (!validateMobileNumber(mobileno)) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid mobile number format' 
        },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (emailid && !validateEmail(emailid)) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByMobile(mobileno);
    if (existingUser) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'User with this mobile number already exists' 
        },
        { status: 409 }
      );
    }

    // Create new user
    const user = await createUser({
      mobileno,
      firstname,
      lastname: lastname || '',
      emailid,
      vehiclemodel,
      segment,
      vehicletype,
      userImage
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