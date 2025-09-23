import { NextRequest, NextResponse } from 'next/server';
import { getAllStates } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const states = await getAllStates();
    
    return NextResponse.json({
      status: 'success',
      message: 'States retrieved successfully',
      data: states
    });

  } catch (error) {
    console.error('Get states error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve states' 
      },
      { status: 500 }
    );
  }
}