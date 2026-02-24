'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

export const ClientHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* liên hệ */}
            <div className="flex-1 flex items-center justify-start">
              <div className="hidden md:flex items-center">
                <button className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                  <span className="text-lg">+</span>
                  <span>Contact Us</span>
                </button>
              </div>
            </div>

            {/*logo */}
            <Link href="/" className="flex-none">
              <span className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.3em] text-gray-900 uppercase">
                SensorX
              </span>
            </Link>

            {/* menu */}
            <div className="flex-1 flex items-center justify-end gap-4 sm:gap-6 lg:gap-3">
              <button className="text-gray-900 hover:text-gray-600 transition-colors p-2">
                <ShoppingBag size={20} />
              </button>
              <Link href="/account" className="text-gray-900 hover:text-gray-600 transition-colors p-2">
                <User size={20} />
              </Link>
              <button className="text-gray-900 hover:text-gray-600 transition-colors p-2">
                <Search size={20} />
              </button>
              <button className="flex items-center gap-2 text-xs font-medium text-gray-900 hover:text-gray-600 transition-colors tracking-wider uppercase">
                <Menu size={20} />
                Menu
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default ClientHeader;
