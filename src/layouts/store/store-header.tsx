'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, Phone, MessageCircle, Circle, Heart, Bookmark } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/shadcn-ui/sheet';

export const StoreHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
                {isMounted && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                        <span className="text-lg">+</span>
                        <span>Liên hệ</span>
                      </button>
                    </SheetTrigger>
                    <SheetContent className="w-[600px] sm:max-w-none px-12 md:px-20 py-20 flex flex-col gap-16">
                      <SheetHeader className="p-0 flex-none">
                        <SheetTitle className="text-3xl font-medium tracking-[0.1em] uppercase text-left">
                          Liên hệ với chúng tôi
                        </SheetTitle>
                      </SheetHeader>

                      <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <Phone size={22} strokeWidth={1.5} />
                            <a href="tel:+84382116944" className="text-xl font-medium border-b border-black pb-0.5">
                              Gọi cho chúng tôi +84 382 116 944
                            </a>
                          </div>
                          <div className="text-gray-600 text-[15px] leading-relaxed ml-9">
                            <p>Thứ Hai - Thứ Bảy: 10:00 - 22:00</p>
                            <p>Chủ Nhật: 10:00 - 21:00</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <Circle></Circle>
                            <button className="text-xl font-medium border-b border-black pb-0.5">
                              Trò chuyện trực tiếp
                            </button>
                          </div>
                          <div className="text-gray-600 text-[15px] leading-relaxed ml-9">
                            <p>Thứ Hai - Thứ Bảy: 10:00 - 22:00</p>
                            <p>Chủ Nhật: 10:00 - 21:00</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <MessageCircle size={22} strokeWidth={1.5} />
                            <button className="text-xl font-medium border-b border-black pb-0.5">
                              Gửi tin nhắn cho chúng tôi
                            </button>
                          </div>
                          <div className="text-gray-600 text-[15px] leading-relaxed ml-9">
                            <p>Thứ Hai - Thứ Bảy: 10:00 - 22:00</p>
                            <p>Chủ Nhật: 10:00 - 21:00</p>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
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
                <Bookmark size={20} />
              </button>
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

export default StoreHeader;
