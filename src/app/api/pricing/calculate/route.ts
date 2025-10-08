// app/api/pricing/calculate/route.ts
import { NextResponse } from 'next/server';

const REMOTE_URL = 'http://top4mobileapp.vbsit.in/api/V1/booking/GetFareAmount';
// optionally set an API key in your .env: FARE_API_KEY=somekey
const FARE_API_KEY = process.env.FARE_API_KEY ?? '';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Prepare headers for remote call. Add Authorization if you need one.
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      // Add any other headers the remote API expects (User-Agent, Referer etc.)
    };
    if (FARE_API_KEY) {
      // Example: remote expects a header called 'x-api-key' or 'Authorization'
      headers['x-api-key'] = FARE_API_KEY;
      // headers['Authorization'] = `Bearer ${FARE_API_KEY}`;
    }

    const apiRes = await fetch(REMOTE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      // no credentials
    });

    const text = await apiRes.text();

    // log for debugging (server console)
    console.log('[pricing/calculate] remote status:', apiRes.status);
    // limit output size to avoid huge logs
    console.log('[pricing/calculate] remote body preview:', text.slice(0, 2000));

    // if remote returned non-200, return a helpful message to client
    if (!apiRes.ok) {
      // include remote body in the response for debugging; strip sensitive data if any
      return NextResponse.json(
        {
          error: 'remote_error',
          status: apiRes.status,
          bodyPreview: text,
        },
        { status: 502 } // Bad Gateway — proxy error
      );
    }

    // try parse JSON; if not JSON, return text
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: 200 });
    } catch {
      return new Response(text, {
        status: 200,
        headers: { 'Content-Type': apiRes.headers.get('content-type') ?? 'text/plain' },
      });
    }
  } catch (err) {
    console.error('[pricing/calculate] proxy error:', err);
    return NextResponse.json({ error: 'proxy_failed', details: String(err) }, { status: 500 });
  }
}
