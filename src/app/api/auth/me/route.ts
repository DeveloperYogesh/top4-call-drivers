import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Not authenticated' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: 'success',
      user
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to get user information' 
      },
      { status: 500 }
    );
  }
}