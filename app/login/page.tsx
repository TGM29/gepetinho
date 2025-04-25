'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Store the token
      localStorage.setItem('gepetinho-token', data.token);
      
      // Redirect to chat
      router.push('/chat');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative h-12 w-12">
            <img
              src="/logo.svg"
              alt="Gepetinho Logo"
              className="w-full h-full"
            />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-700">
            Log in to your Gepetinho account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <button 
              type="submit" 
              className="w-full bg-black text-white py-3 rounded-md hover:bg-opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 