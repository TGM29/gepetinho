'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  username: string;
  email: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('gepetinho-token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If there's an authentication error, redirect to login
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('gepetinho-token');
    router.push('/login');
  };

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secondary">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-secondary border-b border-gray-200 p-4 flex items-center">
        <button 
          className="text-gray-700"
          onClick={() => router.push('/chat')}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-6">Profile</h1>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Profile picture and name */}
        <div className="flex flex-col items-center p-6 bg-secondary rounded-lg">
          <div className="relative h-24 w-24 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              👤
            </div>
          </div>
          <h2 className="text-xl font-bold">{user?.username || 'User'}</h2>
          <p className="text-gray-600">{user?.email || ''}</p>
        </div>

        {/* Profile options */}
        <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <Link 
            href="/profile/edit" 
            className="flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <span className="mr-3">👤</span>
              <span>Edit Profile</span>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <span className="mr-3">🔔</span>
              <span>Notifications</span>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                id="notifications-toggle"
              />
              <label 
                htmlFor="notifications-toggle"
                className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                  notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`block w-4 h-4 mt-1 ml-1 bg-white rounded-full transition-transform duration-300 ease-in-out transform ${
                    notificationsEnabled ? 'translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <Link 
            href="/profile/languages" 
            className="flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <span className="mr-3">🌐</span>
              <span>Languages</span>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link 
            href="/terms" 
            className="flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <span className="mr-3">📄</span>
              <span>Terms of service</span>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link 
            href="/privacy" 
            className="flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <span className="mr-3">🔒</span>
              <span>Privacy Policy</span>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-between px-4 py-3 w-full text-left hover:bg-gray-50"
          >
            <div className="flex items-center text-red-500">
              <span className="mr-3">🚪</span>
              <span>Log out</span>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 