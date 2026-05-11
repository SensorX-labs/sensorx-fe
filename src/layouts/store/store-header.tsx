'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, Phone, MessageCircle, Circle, Heart, Bookmark, LayoutDashboard, ChevronRight, FileText, Package } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/shadcn-ui/sheet';
import Cookies from 'js-cookie';

export const StoreHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Kiểm tra quyền từ cookie
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
        // Nếu bất kỳ role nào khác "Customer" hoặc "0"
        const hasStaffAccess = roles.some((r: any) => {
          const roleStr = String(r);
          return roleStr !== "Customer" && roleStr !== "0" && roleStr !== "";
        });
        setIsAdmin(hasStaffAccess);
      } catch (e) {
        console.error("Error parsing user cookie", e);
      }
    }
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
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-8">

            {/* Logo */}
            <Link href="/" className="flex-none shrink-0">
              <span className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter text-gray-900 uppercase italic">
                Sensor<span className="text-brand-green italic">X</span>
              </span>
            </Link>

            {/* Navigation Menu (Desktop) */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-10">
              <Link href="/shop" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-brand-green transition-colors">
                Sản phẩm
              </Link>
              <Link href="/catalog" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-brand-green transition-colors">
                Giải pháp
              </Link>
              <Link href="/brands" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-brand-green transition-colors">
                Thương hiệu
              </Link>
              <Link href="/contact" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-brand-green transition-colors">
                Liên hệ
              </Link>
            </nav>

            {/* Icons & Menu */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 lg:gap-2">
              <div className="hidden sm:flex items-center gap-1">
                <Link href="/transactions?tab=rfqs" className="text-gray-900 hover:text-gray-600 transition-colors p-2 relative group" title="Yêu cầu báo giá">
                  <FileText size={20} strokeWidth={1.5} />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Yêu cầu báo giá</span>
                </Link>
                <Link href="/transactions?tab=quotes" className="text-gray-900 hover:text-gray-600 transition-colors p-2 relative group" title="Báo giá">
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Báo giá của tôi</span>
                </Link>
                <Link href="/transactions?tab=orders" className="text-gray-900 hover:text-gray-600 transition-colors p-2 relative group" title="Đơn hàng">
                  <Package size={20} strokeWidth={1.5} />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Đơn hàng</span>
                </Link>
              </div>

              <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

              <Link href="/profile" className="text-gray-900 hover:text-gray-600 transition-colors p-2 mr-2">
                <User size={20} strokeWidth={1.5} />
              </Link>

              {isMounted && (
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex items-center gap-2 p-2 text-xs font-bold text-gray-900 hover:text-gray-600 transition-colors tracking-widest uppercase lg:hidden">
                      <Menu size={22} strokeWidth={1.5} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[350px] sm:w-[450px] p-0 border-l border-gray-100 shadow-2xl">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Menu điều hướng</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col h-full bg-white">
                      {/* Menu Header */}
                      <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <span className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400">Điều hướng</span>
                      </div>

                      {/* Menu Items */}
                      <div className="flex-1 overflow-y-auto py-6">
                        <nav className="flex flex-col">
                          {isAdmin && (
                            <Link href="/dashboard" className="group flex items-center justify-between px-8 py-6 hover:bg-gray-50 transition-all border-b border-gray-50">
                              <span className="text-lg font-light tracking-[0.15em] uppercase group-hover:pl-2 transition-all">Quản trị hệ thống</span>
                              <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                            </Link>
                          )}

                          <Link href="/shop" className="group flex items-center justify-between px-8 py-6 hover:bg-gray-50 transition-all border-b border-gray-50">
                            <span className="text-lg font-light tracking-[0.15em] uppercase group-hover:pl-2 transition-all">Tất cả sản phẩm</span>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                          </Link>

                          <Link href="/catalog" className="group flex items-center justify-between px-8 py-6 hover:bg-gray-50 transition-all border-b border-gray-50">
                            <span className="text-lg font-light tracking-[0.15em] uppercase group-hover:pl-2 transition-all">Danh mục giải pháp</span>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                          </Link>

                          <div className="px-8 py-10">
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-6">Thương hiệu đối tác</span>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 border border-gray-100 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                                <span className="font-bold tracking-tighter text-lg">OMRON</span>
                              </div>
                              <div className="p-4 border border-gray-100 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                                <span className="font-bold tracking-tighter text-lg">SIEMENS</span>
                              </div>
                            </div>
                          </div>
                        </nav>
                      </div>

                      {/* Menu Footer */}
                      <div className="p-8 bg-gray-900 text-white">
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Hỗ trợ kỹ thuật</span>
                            <span className="text-sm font-medium tracking-wider">+84 382 116 944</span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest">
                            © 2024 SensorX Labs. <br />
                            Giải pháp công nghiệp tiên tiến.
                          </p>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default StoreHeader;
