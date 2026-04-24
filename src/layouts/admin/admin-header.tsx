'use client';

import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { SidebarTrigger } from '@/shared/components/shadcn-ui/sidebar';
import { useActiveTab } from '@/shared/hooks/use-active-tab';

const AdminHeader: React.FC = () => {
    const activeTab = useActiveTab();

    return (
        <header className="min-h-16 flex items-center justify-between px-4 md:px-6 bg-[var(--admin-background)] border-b border-gray-200 py-3 transition-all duration-300">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="w-10 h-10 [&_svg]:w-5 [&_svg]:h-5 admin-muted hover:text-[--admin-title] hover:bg-admin-surface shrink-0 rounded-md" />
                <div className="flex flex-col justify-center">
                    <h1
                        key={activeTab.title}
                        className="text-xl md:text-2xl font-bold admin-title tracking-tight leading-tight
                                    animate-in fade-in slide-in-from-left-2 duration-500"
                    >
                        {activeTab.title}
                    </h1>

                    {activeTab.description && (
                        <p
                            key={activeTab.description}
                            className="text-slate-500 text-xs md:text-sm font-medium mt-0.5
                                        animate-in fade-in slide-in-from-left-2 duration-1000"
                        >
                            {activeTab.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors hidden sm:block">
                    <Search className="w-5 h-5 admin-muted" />
                </div>

                <div className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <Bell className="w-5 h-5 admin-muted" />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                        4
                    </span>
                </div>
                <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors hidden sm:block">
                    <Settings className="w-5 h-5 admin-muted" />
                </div>

                <div className="hidden md:flex items-center gap-3 ml-2 border-l pl-4 border-gray-300">
                    <div className="flex flex-col items-end leading-tight">
                        <span className="text-sm font-bold admin-title">
                            Martin Gurley
                        </span>
                        <span className="text-xs admin-muted">
                            Admin
                        </span>
                    </div>

                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://ui-avatars.com/api/?name=Martin+Gurley&background=DBEAFE&color=2B3674" alt="user" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;