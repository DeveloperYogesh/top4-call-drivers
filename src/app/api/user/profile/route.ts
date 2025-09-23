import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { findUserByMobile, updateUser } from '@/lib/database';

// GET /api/user/profile - Get user profile
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

    // Get full user details
    const userProfile = await findUserByMobile(user.mobileno);

    if (!userProfile) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'User not found' 
        },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const { passwordHash, ...safeProfile } = userProfile;

    return NextResponse.json({
      status: 'success',
      message: 'Profile retrieved successfully',
      user: safeProfile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve profile' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
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
      firstname,
      lastname,
      emailid,
      vehiclemodel,
      segment,
      vehicletype,
      userImage
    } = body;

    // Update user profile
    const updatedUser = await updateUser(user.mobileno, {
      firstname: firstname || user.firstname,
      lastname: lastname || user.lastname,
      emailid: emailid || user.emailid,
      vehiclemodel: vehiclemodel || user.vehiclemodel,
      segment: segment || user.segment,
      vehicletype: vehicletype || user.vehicletype,
      userImage: userImage || user.userImage
    });

    if (!updatedUser) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Failed to update profile' 
        },
        { status: 400 }
      );
    }

    // Remove sensitive data
    const { passwordHash, ...safeProfile } = updatedUser;

    return NextResponse.json({
      status: 'success',
      message: 'Profile updated successfully',
      user: safeProfile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to update profile' 
      },
      { status: 500 }
    );
  }
}

