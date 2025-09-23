import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window
const API_RATE_LIMIT_MAX_REQUESTS = 50; // API requests per window

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  // NextRequest doesn't always expose `ip`; fallback to header only
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `rate_limit:${ip}`;
}

function checkRateLimit(key: string, maxRequests: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security headers for all requests
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.top4calldrivers.com;"
  );

  // Rate limiting
  const rateLimitKey = getRateLimitKey(request);
  const isApiRequest = pathname.startsWith('/api/');
  const maxRequests = isApiRequest ? API_RATE_LIMIT_MAX_REQUESTS : RATE_LIMIT_MAX_REQUESTS;

  if (!checkRateLimit(rateLimitKey, maxRequests)) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Too many requests. Please try again later.' 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': '900', // 15 minutes
        }
      }
    );
  }

  // API Authentication middleware
  // Only protect endpoints under /api/private/*
  if (pathname.startsWith('/api/private/')) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }
    try {
      const user = verifyToken(token);
      if (!user) {
        return NextResponse.json(
          { status: 'error', message: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      if ((user as any).userId) response.headers.set('x-user-id', (user as any).userId);
      if ((user as any).mobileno) response.headers.set('x-user-mobile', (user as any).mobileno);
    } catch (error) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  // Protected pages middleware
  const protectedPages = ['/dashboard', '/profile', '/bookings', '/admin'];
  const isProtectedPage = protectedPages.some(page => pathname.startsWith(page));

  if (isProtectedPage) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = verifyToken(token);
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  const authPages = ['/login', '/signup'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (token) {
      try {
        const user = verifyToken(token);
        if (user) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        // Token is invalid, continue to auth page
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images).*)',
  ],
};

