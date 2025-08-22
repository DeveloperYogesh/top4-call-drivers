import { Location } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

// Mock location data for only the five cities:
// Chennai, Trichy, Madurai, Tirupur, Coimbatore
const locations: Location[] = [
  // Chennai
  { id: 'che-1', name: 'Chennai', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-2', name: 'Chennai International Airport (MAA)', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-3', name: 'Adyar', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-4', name: 'T. Nagar', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-5', name: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-6', name: 'Velachery', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-7', name: 'OMR (Old Mahabalipuram Road)', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-8', name: 'Tambaram', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-9', name: 'Porur', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-10', name: 'Egmore', city: 'Chennai', state: 'Tamil Nadu' },

  // Trichy (Tiruchirappalli)
  { id: 'tri-1', name: 'Trichy', city: 'Trichy', state: 'Tamil Nadu' },
  { id: 'tri-2', name: 'Tiruchirappalli International Airport (TRZ)', city: 'Trichy', state: 'Tamil Nadu' },
  { id: 'tri-3', name: 'Srirangam', city: 'Trichy', state: 'Tamil Nadu' },
  { id: 'tri-4', name: 'Thillai Nagar', city: 'Trichy', state: 'Tamil Nadu' },
  { id: 'tri-5', name: 'Golden Rock', city: 'Trichy', state: 'Tamil Nadu' },
  { id: 'tri-6', name: 'BHEL Township', city: 'Trichy', state: 'Tamil Nadu' },
  { id: 'tri-7', name: 'Woraiyur', city: 'Trichy', state: 'Tamil Nadu' },
  { id: 'tri-8', name: 'Tennur', city: 'Trichy', state: 'Tamil Nadu' },
  { id: 'tri-9', name: 'Cantonment', city: 'Trichy', state: 'Tamil Nadu' },
  { id: 'tri-10', name: 'Tiruchirappalli Railway Station', city: 'Trichy', state: 'Tamil Nadu' },

  // Madurai
  { id: 'mad-1', name: 'Madurai', city: 'Madurai', state: 'Tamil Nadu' },
  { id: 'mad-2', name: 'Madurai Airport (IXM)', city: 'Madurai', state: 'Tamil Nadu' },
  { id: 'mad-3', name: 'Goripalayam', city: 'Madurai', state: 'Tamil Nadu' },
  { id: 'mad-4', name: 'Tallakulam', city: 'Madurai', state: 'Tamil Nadu' },
  { id: 'mad-5', name: 'East Gate', city: 'Madurai', state: 'Tamil Nadu' },
  { id: 'mad-6', name: 'West Masi', city: 'Madurai', state: 'Tamil Nadu' },
  { id: 'mad-7', name: 'Alagar Kovil Road', city: 'Madurai', state: 'Tamil Nadu' },
  { id: 'mad-8', name: 'Thirupparankundram', city: 'Madurai', state: 'Tamil Nadu' },
  { id: 'mad-9', name: 'Anna Nagar (Madurai)', city: 'Madurai', state: 'Tamil Nadu' },
  { id: 'mad-10', name: 'KK Nagar (Madurai)', city: 'Madurai', state: 'Tamil Nadu' },

  // Tirupur
  { id: 'tir-1', name: 'Tirupur', city: 'Tirupur', state: 'Tamil Nadu' },
  { id: 'tir-2', name: 'Tirupur Bus Stand', city: 'Tirupur', state: 'Tamil Nadu' },
  { id: 'tir-3', name: 'Avinashi (near Tirupur)', city: 'Tirupur', state: 'Tamil Nadu' },
  { id: 'tir-4', name: 'Palladam', city: 'Tirupur', state: 'Tamil Nadu' },
  { id: 'tir-5', name: 'New Tirupur Industrial Park (NIT)', city: 'Tirupur', state: 'Tamil Nadu' },
  { id: 'tir-6', name: 'Uthukuli', city: 'Tirupur', state: 'Tamil Nadu' },
  { id: 'tir-7', name: 'Kangeyam (nearby)', city: 'Tirupur', state: 'Tamil Nadu' },
  { id: 'tir-8', name: 'Tirupur Railway Station', city: 'Tirupur', state: 'Tamil Nadu' },
  { id: 'tir-9', name: 'Kumaran Nagar', city: 'Tirupur', state: 'Tamil Nadu' },
  { id: 'tir-10', name: 'Karumathampatti', city: 'Tirupur', state: 'Tamil Nadu' },

  // Coimbatore
  { id: 'coi-1', name: 'Coimbatore', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'coi-2', name: 'Coimbatore International Airport (CJB)', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'coi-3', name: 'Gandhipuram', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'coi-4', name: 'RS Puram', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'coi-5', name: 'Peelamedu', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'coi-6', name: 'Avinashi Road (Coimbatore)', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'coi-7', name: 'Saravanampatti', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'coi-8', name: 'Podanur', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'coi-9', name: 'Singanallur', city: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'coi-10', name: 'Kovaipudur', city: 'Coimbatore', state: 'Tamil Nadu' },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    if (query.length < 4) {
      return NextResponse.json(
        { error: 'Query must be at least 4 characters long' },
        { status: 400 }
      );
    }

    // Filter locations based on query
    const filteredLocations = locations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.city.toLowerCase().includes(query.toLowerCase()) ||
      location.state.toLowerCase().includes(query.toLowerCase())
    );

    // Limit results to 10
    const results = filteredLocations.slice(0, 10);

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
