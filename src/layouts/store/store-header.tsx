'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ShoppingBag, LayoutDashboard, ChevronRight, ChevronDown, LogOut, ClipboardList } from 'lucide-react';
import Cookies from 'js-cookie';
import { AuthService } from '@/features/system/auth/services/auth-service';
import { cn } from '@/shared/utils';
import { LucideIcon } from 'lucide-react';
import { useInquiryCart } from '@/shared/hooks/use-inquiry-cart';

interface DropdownItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  isDanger?: boolean;
  isSuccess?: boolean;
}

const DropdownItem = ({ icon: Icon, label, href, onClick, isDanger, isSuccess }: DropdownItemProps) => {
  const content = (
    <div className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 transition-colors group">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
          isDanger ? "bg-red-50 text-red-600" : isSuccess ? "bg-brand-green/10 text-brand-green" : "bg-gray-100 text-gray-900"
        )}>
          <Icon size={20} />
        </div>
        <span className={cn(
          "text-[15px] font-medium",
          isDanger ? "text-red-600" : isSuccess ? "text-brand-green" : "text-gray-900"
        )}>{label}</span>
      </div>
      <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="block w-full">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
};

export const StoreHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { totalItems } = useInquiryCart();

  const authService = new AuthService();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const refreshToken = Cookies.get('refreshToken');
    try {
      await authService.logout(refreshToken);
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      Cookies.remove('token', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('user', { path: '/' });
      setUser(null);
      setIsDropdownOpen(false);
      window.dispatchEvent(new Event('user-updated'));
      router.push('/');
    }
  };

  useEffect(() => {
    const syncUser = () => {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          setUser(parsedUser);
        } catch (e) {
          console.error("Error parsing user cookie", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    syncUser();

    window.addEventListener('user-updated', syncUser);
    return () => window.removeEventListener('user-updated', syncUser);
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

            <div className="flex items-center justify-end gap-2 sm:gap-4 lg:gap-2">
              <Link
                href="/transactions?tab=inquiry-cart"
                className="relative group p-2 text-gray-700 hover:text-brand-green transition-colors"
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1 bg-brand-green text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Yêu cầu báo giá của tôi
                </div>
              </Link>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-200 mx-1 sm:mx-2 hidden sm:block" />

              {/* Icons & Menu */}
              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative focus:outline-none group transition-all active:scale-95 ml-2"
                  >
                    <div className="relative w-9 h-9 sm:w-10 h-10">
                      <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible">
                        <defs>
                          <mask id="avatarMask">
                            <circle cx="20" cy="20" r="20" fill="white" />
                            <circle cx="33" cy="33" r="9" fill="black" />
                          </mask>
                        </defs>
                        <g mask="url(#avatarMask)">
                          {user.avatarUrl ? (
                            <image
                              href={user.avatarUrl}
                              x="0"
                              y="0"
                              height="40"
                              width="40"
                              preserveAspectRatio="xMidYMid slice"
                            />
                          ) : (
                            <>
                              <circle cx="20" cy="20" r="20" fill="#F9FAFB" />
                              <text
                                x="20"
                                y="23"
                                textAnchor="middle"
                                fill="#9CA3AF"
                                fontSize="10"
                                fontWeight="bold"
                                letterSpacing="0.1em"
                                className="uppercase"
                              >
                                {(user.fullName || user.name || "U").split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </text>
                            </>
                          )}
                          <circle cx="20" cy="20" r="19.5" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                        </g>
                      </svg>

                      {/* Dropdown Indicator Badge */}
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center z-10">
                        <ChevronDown
                          size={10}
                          strokeWidth={3}
                          className={cn("text-gray-600 transition-transform duration-200", isDropdownOpen ? "rotate-180" : "")}
                        />
                      </div>
                    </div>
                  </button>
                ) : (
                  <Link href="/login" className="text-gray-900 hover:text-gray-600 transition-colors p-1 mr-2 flex items-center justify-center">
                    <User size={20} strokeWidth={1.5} />
                  </Link>
                )}

                {/* Dropdown Menu */}
                {isDropdownOpen && user && (
                  <div className="absolute right-0 mt-3 w-80 bg-white shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] rounded-xl py-3 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200/50">
                    {/* User Card - Simple Info */}
                    <div className="mx-4 mb-4 mt-1 p-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                            {(user.fullName || user.name || "U").split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-[17px] text-gray-900">{user.fullName || user.name}</span>
                    </div>

                    {/* Menu Items */}
                    <div className="px-2 space-y-0.5">
                      <DropdownItem
                        icon={User}
                        label="Tài khoản của tôi"
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <DropdownItem
                        icon={ClipboardList}
                        label="Giao dịch của tôi"
                        href="/transactions"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <DropdownItem
                        icon={LogOut}
                        label="Đăng xuất"
                        onClick={handleLogout}
                        isDanger
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default StoreHeader;
