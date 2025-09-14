import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      status: 'success',
      message: 'Logged out successfully'
    });

    // Clear the authentication cookie
    response.headers.set('Set-Cookie', clearAuthCookie());

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Logout failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}