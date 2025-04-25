import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/app/utils/db';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get the token from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user data
    // Cast userId to number from the payload
    const userId = Number(payload.userId);
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without sensitive information
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username || 'User',
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 