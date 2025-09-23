// app/api/autocomplete/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_AUTOCOMPLETE_ENDPOINT =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';

function safeJson(resp: any) {
  return {
    status: resp?.status ?? 'UNKNOWN',
    predictions: resp?.predictions ?? [],
    data: resp?.predictions ?? [],
    total: (resp?.predictions ?? []).length,
    raw: resp ?? null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const input = (searchParams.get('input') ?? searchParams.get('q') ?? '').trim();
    if (!input) {
      return NextResponse.json(
        { status: 'EMPTY_QUERY', predictions: [], data: [], total: 0 },
        { status: 200 }
      );
    }

    // Minimum length check (adjust if needed)
    if (input.length < 3) {
      return NextResponse.json(
        { status: 'QUERY_TOO_SHORT', message: 'Query must be at least 3 characters long', predictions: [], data: [], total: 0 },
        { status: 200 }
      );
    }

    const key = "AIzaSyAM0HnAYNWLBOfjVZWkHeb785e3AQPEhM8";
    if (!key) {
      return NextResponse.json({ status: 'NO_API_KEY', message: 'Server missing GOOGLE_MAPS_API_KEY', predictions: [], data: [], total: 0 }, { status: 500 });
    }

    // Build Google Places Autocomplete request
    // You can adjust types, components, sessiontoken, language, etc.
    const params = new URLSearchParams({
      input,
      key,
      // optional: restrict to India: components=country:in
      // components: 'country:in',
      // types: 'geocode', // or 'establishment' or omit for all
      // language: 'en',
    });

    const url = `${GOOGLE_AUTOCOMPLETE_ENDPOINT}?${params.toString()}`;

    const gRes = await fetch(url);
    const gJson = await gRes.json();

    // Normalize the predictions to a simple shape for client:
    // { id, description, structured_formatting, place_id }
    const normalized = (gJson.predictions ?? []).map((p: any) => ({
      id: p.place_id ?? p.id ?? p.reference ?? p.description,
      description: p.description ?? '',
      main_text: p.structured_formatting?.main_text ?? '',
      secondary_text: p.structured_formatting?.secondary_text ?? '',
      place_id: p.place_id,
      raw: p,
    }));

    return NextResponse.json(safeJson({ status: gJson.status ?? 'OK', predictions: normalized }), { status: 200 });
  } catch (err: any) {
    console.error('[autocomplete] error', err);
    return NextResponse.json({ status: 'ERROR', message: err?.message ?? String(err), predictions: [], data: [], total: 0 }, { status: 500 });
  }
}
