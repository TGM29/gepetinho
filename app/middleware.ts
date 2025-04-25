import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils/jwt';

// List of paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/signup', '/api/auth/login', '/api/auth/signup'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is public or is a static asset
  if (PUBLIC_PATHS.includes(path) || path.startsWith('/_next') || path.includes('.')) {
    return NextResponse.next();
  }
  
  // Get the token from the request headers or cookies
  const authHeader = request.headers.get('authorization');
  const token = authHeader ? authHeader.split(' ')[1] : request.cookies.get('gepetinho-token')?.value;
  
  // If no token, redirect to login
  if (!token) {
    if (path.startsWith('/api')) {
      return new NextResponse(JSON.stringify({ message: 'Authentication required' }), {
        status: 401,
        headers: { 'content-type': 'application/json' }
      });
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verify the token
  const payload = await verifyToken(token);
  
  if (!payload) {
    if (path.startsWith('/api')) {
      return new NextResponse(JSON.stringify({ message: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'content-type': 'application/json' }
      });
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}; 