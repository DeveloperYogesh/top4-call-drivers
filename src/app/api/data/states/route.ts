import { NextRequest, NextResponse } from 'next/server';

// Static data for states (GetStateNames from Postman)
const states = [
  { id: 1, name: 'Tamil Nadu', code: 'TN' },
  { id: 2, name: 'Karnataka', code: 'KA' },
  { id: 3, name: 'Andhra Pradesh', code: 'AP' },
  { id: 4, name: 'Telangana', code: 'TS' },
  { id: 5, name: 'Kerala', code: 'KL' },
  { id: 6, name: 'Maharashtra', code: 'MH' },
  { id: 7, name: 'Gujarat', code: 'GJ' },
  { id: 8, name: 'Rajasthan', code: 'RJ' },
  { id: 9, name: 'Uttar Pradesh', code: 'UP' },
  { id: 10, name: 'Delhi', code: 'DL' }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'success',
      states
    });
  } catch (error) {
    console.error('Get states error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch states' 
      },
      { status: 500 }
    );
  }
}