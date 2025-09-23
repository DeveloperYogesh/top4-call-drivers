// app/api/autocomplete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Location } from '@/types';

// (your in-memory locations array — keep the one you posted)
const locations: Location[] = [
  /* ... your list ... */
];

function normalizeLocations(list: Location[]) {
  return list.map(loc => ({
    id: loc.id,
    name: loc.name,
    city: loc.city ?? '',
    state: loc.state ?? '',
    // leave raw Lat/Lng undefined if not available
  }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Accept either 'q' or 'input' to be tolerant of client differences
    const rawQuery = searchParams.get('q') ?? searchParams.get('input') ?? '';
    const query = rawQuery.trim();

    // Always return a stable JSON shape so client never tries to read undefined
    if (!query) {
      return NextResponse.json({
        status: 'EMPTY_QUERY',
        predictions: [],
        data: [],
        total: 0,
      }, { status: 200 });
    }

    if (query.length < 3) {
      // less strict threshold; adjust to 4 if you want
      return NextResponse.json({
        status: 'QUERY_TOO_SHORT',
        message: 'Query must be at least 3 characters long',
        predictions: [],
        data: [],
        total: 0,
      }, { status: 200 });
    }

    // Filter locations case-insensitively on name, city or state
    const filtered = locations.filter(loc =>
      (loc.name ?? '').toLowerCase().includes(query.toLowerCase()) ||
      (loc.city ?? '').toLowerCase().includes(query.toLowerCase()) ||
      (loc.state ?? '').toLowerCase().includes(query.toLowerCase())
    );

    const limited = filtered.slice(0, 10);
    const normalized = normalizeLocations(limited);

    return NextResponse.json({
      status: 'OK',
      predictions: normalized, // keep older naming if client expects 'predictions'
      data: normalized,
      total: normalized.length,
    }, { status: 200 });
  } catch (err: any) {
    console.error('autocomplete route error', err);
    return NextResponse.json({
      status: 'ERROR',
      message: err?.message ?? String(err),
      predictions: [],
      data: [],
      total: 0,
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ status: 'METHOD_NOT_ALLOWED', predictions: [], data: [], total: 0 }, { status: 405 });
}
