'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HeaderControls() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Reload the page to update the server-rendered header
        window.location.reload();
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-600">
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="m12 14 7 0c0 3-3 6-7 6s-7-3-7-6h7z" stroke="currentColor" strokeWidth="2" />
        </svg>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-400">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
            <div className="py-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/bookings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                My Bookings
              </Link>
              <div className="border-t border-gray-100" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}