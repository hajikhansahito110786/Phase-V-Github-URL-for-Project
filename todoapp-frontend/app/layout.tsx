'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import Chatbot from '@/components/Chatbot';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Todo App</Link>
            
            <div className="flex gap-4 items-center">
              <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link href="/students" className="hover:text-gray-300">Students</Link>
              <Link href="/todos" className="hover:text-gray-300">Todos</Link>
              <Link href="/audit" className="hover:text-gray-300">Audit</Link>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span>Welcome, {user?.username}</span>
                  <button 
                    onClick={() => setChatbotOpen(true)}
                    className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                  >
                    AI Chat
                  </button>
                  <button 
                    onClick={logout}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Login</Link>
                  <Link href="/register" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">Register</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto p-4">
          {children}
        </main>
        
        <Toaster position="top-right" />
        <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
      </body>
    </html>
  );
}