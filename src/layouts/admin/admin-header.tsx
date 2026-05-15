'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { SidebarTrigger } from '@/shared/components/shadcn-ui/sidebar';
import { useActiveTab } from '@/shared/hooks/use-active-tab';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { cn } from '@/shared/utils';

interface DropdownItemProps {
    icon: any;
    label: string;
    href?: string;
    onClick?: () => void;
    className?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ icon: Icon, label, href, onClick, className }) => {
    const content = (
        <div className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer group",
            className
        )}>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                <Icon size={18} strokeWidth={1.5} className="text-gray-500 group-hover:text-blue-600" />
            </div>
            <span className="text-[15px] font-medium">{label}</span>
        </div>
    );

    if (href) {
        return <Link href={href} onClick={onClick}>{content}</Link>;
    }

    return <div onClick={onClick}>{content}</div>;
};

const AdminHeader: React.FC = () => {
    const activeTab = useActiveTab();
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Hàm chuyển đổi Role sang tiếng Việt
    const getRoleLabel = (role: string) => {
        if (!role) return 'Quản trị viên';
        const r = role.toLowerCase();
        switch (r) {
            case 'admin': return 'Quản trị viên';
            case 'manager': return 'Quản lý';
            case 'salestaff': return 'Nhân viên kinh doanh';
            case 'warehousestaff': return 'Nhân viên kho';
            default: return role;
        }
    };

    // Sync user state from cookies
    const syncUser = () => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            try {
                const parsedUser = JSON.parse(userCookie);
                setUser(parsedUser);
            } catch (e) {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        syncUser();
        window.addEventListener('user-updated', syncUser);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('user-updated', syncUser);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        window.dispatchEvent(new Event('user-updated'));
        window.location.href = '/login';
    };

    return (
        <header className="sticky top-0 z-50 min-h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-gray-200 py-3 transition-all duration-300">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="w-10 h-10 [&_svg]:w-5 [&_svg]:h-5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 shrink-0 rounded-md" />
                <div className="flex flex-col justify-center">
                    <h1
                        key={activeTab.title}
                        className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight animate-in fade-in slide-in-from-left-2 duration-500"
                    >
                        {activeTab.title}
                    </h1>

                    {activeTab.description && (
                        <p
                            key={activeTab.description}
                            className="text-gray-500 text-xs md:text-sm font-medium mt-0.5 animate-in fade-in slide-in-from-left-2 duration-1000"
                        >
                            {activeTab.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {/* Notifications */}
                <div className="relative cursor-pointer hover:bg-gray-100 p-2.5 rounded-full transition-colors group">
                    <Bell size={22} strokeWidth={1.5} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                        4
                    </span>
                </div>

                {/* User Profile Dropdown */}
                <div className="relative ml-2" ref={dropdownRef}>
                    {user ? (
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 group p-1.5 hover:bg-gray-50 rounded-xl transition-all"
                        >
                            <div className="flex flex-col items-end leading-tight hidden md:flex">
                                <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {user.fullName || user.name}
                                </span>
                                <span className="text-[11px] text-gray-500 font-medium mt-0.5">
                                    {getRoleLabel(user.roles?.[0] || user.role)}
                                </span>
                            </div>

                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-200 group-hover:shadow-md">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                                            {(user.fullName || user.name || "U").split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                        </span>
                                    )}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center z-10">
                                    <ChevronDown
                                        size={10}
                                        strokeWidth={3}
                                        className={cn("text-gray-500 transition-transform duration-200", isDropdownOpen ? "rotate-180" : "")}
                                    />
                                </div>
                            </div>
                        </button>
                    ) : (
                        <Link href="/login" className="text-gray-500 hover:text-blue-600 transition-colors p-2 flex items-center justify-center">
                            <User size={22} strokeWidth={1.5} />
                        </Link>
                    )}

                    {/* Dropdown Menu */}
                    {isDropdownOpen && user && (
                        <div className="absolute right-0 mt-3 w-72 bg-white shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] rounded-xl py-3 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200/50">
                            <div className="mx-4 mb-4 mt-1 p-2 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                                            {(user.fullName || user.name || "U").split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[16px] text-gray-900 truncate leading-tight">
                                        {user.fullName || user.name}
                                    </span>
                                    <span className="text-xs text-gray-500 truncate mt-0.5">
                                        {getRoleLabel(user.roles?.[0] || user.role)}
                                    </span>
                                </div>
                            </div>

                            <div className="px-2 space-y-0.5">
                                <DropdownItem
                                    icon={User}
                                    label="Thông tin cá nhân"
                                    href="/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="my-1 border-t border-gray-100" />
                                <DropdownItem
                                    icon={LogOut}
                                    label="Đăng xuất"
                                    onClick={handleLogout}
                                    className="hover:bg-red-50/50"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;