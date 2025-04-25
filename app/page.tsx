'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('gepetinho-token');
    if (!token) {
      router.push('/signup');
    } else {
      router.push('/chat');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Gepetinho</h1>
        <p className="mt-2">Loading...</p>
      </div>
    </div>
  );
} 