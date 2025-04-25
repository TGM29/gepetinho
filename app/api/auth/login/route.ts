import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/app/utils/db';
import { comparePassword } from '@/app/utils/password';
import { generateToken } from '@/app/utils/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify the password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    // Return success response with token
    return NextResponse.json({ 
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 