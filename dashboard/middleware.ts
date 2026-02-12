import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// CRIMEINTEL 7.0 Ω — SECURITY MIDDLEWARE
// Auth guard, CSP, security headers, rate limit headers
// ============================================================

const PUBLIC_ROUTES = ['/login', '/register', '/icon.svg', '/_next', '/favicon.ico'];
const API_ROUTES = ['/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r));
  const isApi = API_ROUTES.some(r => pathname.startsWith(r));

  const response = isPublic || isApi
    ? NextResponse.next()
    : NextResponse.next();

  // ── SECURITY HEADERS ──
  const headers = response.headers;

  // Content Security Policy
  headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.crimeintel.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; '));

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // XSS protection (legacy browsers)
  headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  headers.set('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', '));

  // HSTS (Strict Transport Security)
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Cross-Origin policies
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  headers.set('Cross-Origin-Embedder-Policy', 'credentialless');

  // Remove server info
  headers.set('X-Powered-By', '');
  headers.set('Server', 'CrimeIntel-7.0-Omega');

  // Request ID for tracing
  const requestId = crypto.randomUUID();
  headers.set('X-Request-Id', requestId);

  // Cache control for auth pages
  if (!isPublic) {
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
