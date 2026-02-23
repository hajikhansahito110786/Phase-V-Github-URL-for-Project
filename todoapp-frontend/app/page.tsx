'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Todo App</h1>
        <p className="mb-8">Manage your tasks with AI assistance</p>
        <div className="space-x-4">
          <a href="/login" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">Login</a>
          <a href="/register" className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600">Register</a>
        </div>
      </div>
    </div>
  );
}