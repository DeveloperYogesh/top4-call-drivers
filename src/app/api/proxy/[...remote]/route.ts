// File: app/api/proxy/[...remote]/route.ts
import { NextResponse } from "next/server";

const REMOTE_BASE = (
  process.env.REMOTE_API_BASE || "http://top4mobileapp.vbsit.in"
).replace(/\/$/, "");
const REMOTE_AUTH =
  process.env.REMOTE_API_AUTH || "Basic dG9wNHdlYnNpdGU6eFRrVzY0OFc=";

async function handleProxy(
  request: Request,
  remoteSegments: string[] | undefined
) {
  try {
    const segments = Array.isArray(remoteSegments) ? [...remoteSegments] : [];

    if (segments.length === 0) {
      return NextResponse.json(
        { error: "Missing remote endpoint in URL" },
        { status: 400 }
      );
    }

    // Normalize — remove a leading 'booking' if present to avoid duplication.
    // Also tolerate callers that pass /api/V1/booking/...
    let payloadSegments = segments;
    if (segments[0] === "booking") {
      payloadSegments = segments.slice(1);
    } else if (
      segments.length >= 3 &&
      segments[0] === "api" &&
      segments[1] === "V1" &&
      segments[2] === "booking"
    ) {
      payloadSegments = segments.slice(3);
    }

    // Build the remote path under /api/V1/booking
    const remotePath = payloadSegments.filter(Boolean).join("/"); // may be empty
    const remoteUrl =
      remotePath && remotePath.length > 0
        ? `${REMOTE_BASE}/api/V1/booking/${remotePath}`
        : `${REMOTE_BASE}/api/V1/booking`;

    // Build headers to forward. Start from incoming headers, but avoid overriding host.
    const headers: Record<string, string> = {};
    const incomingContentType = request.headers.get("content-type");
    const incomingAccept = request.headers.get("accept");

    if (incomingContentType) headers["content-type"] = incomingContentType;
    if (incomingAccept) headers["accept"] = incomingAccept;

    if (REMOTE_AUTH) {
      headers["Authorization"] = REMOTE_AUTH;
    }

    const method = request.method.toUpperCase();

    let body: BodyInit | undefined;
    if (method !== "GET" && method !== "HEAD") {
      // forward raw text so JSON stays JSON
      body = await request.text();
    }

    // Debug log (server logs) — remove in production if desired
    console.log("[proxy] Fetching remote URL:", remoteUrl, "method:", method);

    const remoteRes = await fetch(remoteUrl, { method, headers, body });

    const text = await remoteRes.text();

    // Prepare response headers (copy remote headers back)
    const responseHeaders = new Headers();
    remoteRes.headers.forEach((value, key) => {
      // Optionally skip hop-by-hop headers here if needed
      responseHeaders.set(key, value);
    });

    return new Response(text, {
      status: remoteRes.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: "Proxy failed", details: String(err) },
      { status: 500 }
    );
  }
}

// NOTE: using `context: any` avoids Next's overly strict internal type comparison during build
// We still extract params and forward them to handleProxy.
export async function POST(request: Request, context: any) {
  const params = await context.params;
  const remote = params?.remote as string[] | undefined;
  return handleProxy(request, remote);
}
export async function GET(request: Request, context: any) {
  const params = await context.params;
  const remote = params?.remote as string[] | undefined;
  return handleProxy(request, remote);
}
export async function PUT(request: Request, context: any) {
  const params = await context.params;
  const remote = params?.remote as string[] | undefined;
  return handleProxy(request, remote);
}
export async function PATCH(request: Request, context: any) {
  const params = await context.params;
  const remote = params?.remote as string[] | undefined;
  return handleProxy(request, remote);
}
export async function DELETE(request: Request, context: any) {
  const params = await context.params;
  const remote = params?.remote as string[] | undefined;
  return handleProxy(request, remote);
}
