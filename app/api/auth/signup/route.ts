import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/app/utils/db';
import { hashPassword } from '@/app/utils/password';
import { generateToken } from '@/app/utils/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const user = await createUser(email, hashedPassword, username);

    // Generate JWT token
    const token = await generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    // Return success response with token
    return NextResponse.json({ 
      message: 'User created successfully',
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username 
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 