'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

const NavigationBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get admin email from localStorage or your auth context
  const adminEmail = typeof window !== 'undefined' 
    ? localStorage.getItem('userEmail') || 
      JSON.parse(localStorage.getItem('user') || '{}').email || 
      "admin@buildbetter.com"
    : "admin@buildbetter.com";

  const isActive = (path: string) => {
    return pathname === path ? 'border-b-3 border-custom-green-300 text-custom-green-300 font-medium' : 'text-custom-green-200';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    try {
      // 1. Remove tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authToken');
      
      // 2. Remove tokens from sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('authToken');
      
      // 3. Clear user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      localStorage.removeItem('userInfo');
      
      // 5. Clear any cookies (if using httpOnly cookies)
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      // 7. Close modals
      setShowLogoutConfirm(false);
      setIsDropdownOpen(false);
      
      // 8. Redirect to login page
      router.push('/');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still proceed with logout even if there's an error
      setShowLogoutConfirm(false);
      setIsDropdownOpen(false);
      router.push('/');
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="bg-custom-green-25 px-8 py-3 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/rumah" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Build Better Logo" 
                width={110} 
                height={40} 
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/rumah" className={`pb-1 px-2 ${isActive('/rumah')}`}>
              Rumah
            </Link>
            <Link href="/material" className={`pb-1 px-2 ${isActive('/material')}`}>
              Material
            </Link>
            <Link href="/arsitek" className={`pb-1 px-2 ${isActive('/arsitek')}`}>
              Arsitek
            </Link>
            <Link href="/konsultasi" className={`pb-1 px-2 ${isActive('/konsultasi')}`}>
              Konsultasi
            </Link>
            <Link href="/artikel" className={`pb-1 px-2 ${isActive('/artikel')}`}>
              Artikel
            </Link>
          </nav>
          
          <div className="flex items-center relative" ref={dropdownRef}>
            <button 
              onClick={handleProfileClick}
              className="p-2 rounded-full border-1 border-custom-green-200 hover:bg-custom-green-50 transition-colors"
            >
              <FaUser className="text-custom-green-200" />
            </button>

            {/* Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Logged in sebagai:</div>
                  <div className="text-sm font-medium text-gray-900 mb-3 break-all">
                    {adminEmail}
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Anda yakin ingin keluar?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelLogout}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;