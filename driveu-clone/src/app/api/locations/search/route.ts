import { NextRequest, NextResponse } from 'next/server';
import { Location } from '@/types';

// Mock location data - in a real app, this would come from a database
const locations: Location[] = [
  // Bangalore
  { id: 'blr-1', name: 'Bangalore', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-2', name: 'Bangalore International Airport (KIA)', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-3', name: 'Koramangala', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-4', name: 'Indiranagar', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-5', name: 'Whitefield', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-6', name: 'Electronic City', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-7', name: 'Marathahalli', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-8', name: 'HSR Layout', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-9', name: 'BTM Layout', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-10', name: 'Jayanagar', city: 'Bangalore', state: 'Karnataka' },
  
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
  
  // Delhi NCR
  { id: 'del-1', name: 'Delhi', city: 'Delhi', state: 'Delhi' },
  { id: 'del-2', name: 'Indira Gandhi International Airport (DEL)', city: 'Delhi', state: 'Delhi' },
  { id: 'del-3', name: 'Connaught Place', city: 'Delhi', state: 'Delhi' },
  { id: 'del-4', name: 'Gurgaon', city: 'Gurgaon', state: 'Haryana' },
  { id: 'del-5', name: 'Noida', city: 'Noida', state: 'Uttar Pradesh' },
  { id: 'del-6', name: 'Faridabad', city: 'Faridabad', state: 'Haryana' },
  { id: 'del-7', name: 'Ghaziabad', city: 'Ghaziabad', state: 'Uttar Pradesh' },
  { id: 'del-8', name: 'Dwarka', city: 'Delhi', state: 'Delhi' },
  { id: 'del-9', name: 'Rohini', city: 'Delhi', state: 'Delhi' },
  { id: 'del-10', name: 'Lajpat Nagar', city: 'Delhi', state: 'Delhi' },
  
  // Mumbai
  { id: 'mum-1', name: 'Mumbai', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-2', name: 'Chhatrapati Shivaji International Airport (BOM)', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-3', name: 'Andheri', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-4', name: 'Bandra', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-5', name: 'Powai', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-6', name: 'Thane', city: 'Thane', state: 'Maharashtra' },
  { id: 'mum-7', name: 'Navi Mumbai', city: 'Navi Mumbai', state: 'Maharashtra' },
  { id: 'mum-8', name: 'Juhu', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-9', name: 'Malad', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-10', name: 'Goregaon', city: 'Mumbai', state: 'Maharashtra' },
  
  // Hyderabad
  { id: 'hyd-1', name: 'Hyderabad', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-2', name: 'Rajiv Gandhi International Airport (HYD)', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-3', name: 'HITEC City', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-4', name: 'Gachibowli', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-5', name: 'Madhapur', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-6', name: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-7', name: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-8', name: 'Secunderabad', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-9', name: 'Kondapur', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-10', name: 'Kukatpally', city: 'Hyderabad', state: 'Telangana' },
  
  // Kolkata
  { id: 'kol-1', name: 'Kolkata', city: 'Kolkata', state: 'West Bengal' },
  { id: 'kol-2', name: 'Netaji Subhas Chandra Bose International Airport (CCU)', city: 'Kolkata', state: 'West Bengal' },
  { id: 'kol-3', name: 'Salt Lake', city: 'Kolkata', state: 'West Bengal' },
  { id: 'kol-4', name: 'Park Street', city: 'Kolkata', state: 'West Bengal' },
  { id: 'kol-5', name: 'Howrah', city: 'Howrah', state: 'West Bengal' },
  
  // Pune
  { id: 'pun-1', name: 'Pune', city: 'Pune', state: 'Maharashtra' },
  { id: 'pun-2', name: 'Pune International Airport (PNQ)', city: 'Pune', state: 'Maharashtra' },
  { id: 'pun-3', name: 'Hinjewadi', city: 'Pune', state: 'Maharashtra' },
  { id: 'pun-4', name: 'Koregaon Park', city: 'Pune', state: 'Maharashtra' },
  { id: 'pun-5', name: 'Wakad', city: 'Pune', state: 'Maharashtra' },
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

