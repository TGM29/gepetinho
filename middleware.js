import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.svg).*)'],
};

export default function middleware(request) {
  // This is a simplified version that will be executed on the client
  // The real authentication will happen in the API endpoints
  return NextResponse.next();
} 