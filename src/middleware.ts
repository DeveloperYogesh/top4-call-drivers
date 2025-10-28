// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Minimal passthrough middleware - does not modify headers or block requests.
  return NextResponse.next();
}

// Keep matcher if you used one previously, otherwise remove or adjust.
// This keeps Next handling all routes as before.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|images).*)',
  ],
};
