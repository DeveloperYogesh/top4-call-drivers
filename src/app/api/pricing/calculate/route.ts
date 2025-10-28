// app/api/pricing/calculate/route.ts
import { NextResponse } from 'next/server';

const REMOTE_URL = 'http://top4mobileapp.vbsit.in/api/V1/booking/GetFareAmount';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 💡 Match your Postman request exactly — raw JSON, no auth headers
    const apiRes = await fetch(REMOTE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify(body),
    });

    const text = await apiRes.text();
    console.log('[pricing/calculate] remote status:', apiRes.status);
    console.log('[pricing/calculate] remote body preview:', text.slice(0, 1000));

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: 'remote_error', status: apiRes.status, bodyPreview: text },
        { status: 502 }
      );
    }

    // Parse JSON if possible
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: 200 });
    } catch {
      return new Response(text, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('[pricing/calculate] proxy error:', err);
    return NextResponse.json(
      { error: 'proxy_failed', details: String(err) },
      { status: 500 }
    );
  }
}
