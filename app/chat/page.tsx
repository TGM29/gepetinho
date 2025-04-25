'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('gepetinho-token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "I'm here to help you with whatever you need, from answering questions to providing recommendations. Let's chat!"
        }
      ]);
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('gepetinho-token')}`
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gepetinho-token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-secondary">
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`bg-white absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-10 w-64 shadow-md`}>
        <div className="p-4">
          <div className="flex justify-center mb-6">
            <Link href="/chat">
              <div className="relative h-10 w-10">
                <Image 
                  src="/logo.svg"
                  alt="Gepetinho Logo"
                  fill
                  priority
                />
              </div>
            </Link>
          </div>
          
          <nav className="mt-8">
            <div className="space-y-2">
              <button 
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left"
                onClick={() => router.push('/profile')}
              >
                <span className="mr-3">👤</span>
                Profile
              </button>
              <button 
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left"
                onClick={handleLogout}
              >
                <span className="mr-3">🚪</span>
                Log out
              </button>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-secondary border-b border-gray-200 py-4 px-4 flex items-center justify-between">
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="text-center flex-1 md:flex-none">
            <h1 className="text-xl font-bold">Gepetinho</h1>
          </div>
          
          <Link href="/profile" className="rounded-full bg-gray-200 h-8 w-8 flex items-center justify-center">
            <span className="text-sm">👤</span>
          </Link>
        </header>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-secondary">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-gray-200 text-gray-900' 
                    : 'bg-white text-gray-900 shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Add thumbs up/down and copy buttons for assistant messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-end mt-2 space-x-2 text-gray-500">
                      <button className="hover:text-gray-700">
                        👍
                      </button>
                      <button className="hover:text-gray-700">
                        👎
                      </button>
                      <button className="hover:text-gray-700 text-xs">
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm max-w-[80%]">
                  <p>Thinking...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input area */}
        <div className="bg-secondary border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 