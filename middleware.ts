import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user is authenticated by looking for the token cookie
  const token = request.cookies.get('google_token');
  
  // Protected routes that require authentication
  const protectedPaths = ['/dashboard'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If accessing a protected route without authentication, redirect to home
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/api/auth/google', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};