'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

const NavigationBar: React.FC = () => {
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path ? 'border-b-3 border-custom-green-300 text-custom-green-300 font-medium' : 'text-custom-green-200';
  };

  return (
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
          <Link href="/artikel" className={`pb-1 px-2 ${isActive('/artikel')}`}>
            Artikel
          </Link>
        </nav>
        
        <div className="flex items-center">
          <Link href="/profile" className="p-2 rounded-full border-1 border-custom-green-200">
            <FaUser className="text-custom-green-200" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;