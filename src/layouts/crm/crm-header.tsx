'use client';

import React from 'react';
import { Search, Bell, Settings} from 'lucide-react';
import { SidebarTrigger } from '@/shared/components/shadcn-ui/sidebar';

const CrmHeader: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-[#F4F7FE] border-b border-gray-200">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-[#A3AED0] hover:text-[#2B3674] hover:bg-gray-100" />
        <h1 className="text-xl font-bold text-[#2B3674]">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Search className="w-5 h-5 text-[#A3AED0]" />
        </div>

        <div className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-[#A3AED0]" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
            4
          </span>
        </div>
        <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Settings className="w-5 h-5 text-[#A3AED0]" />
        </div>

        <div className="hidden md:flex items-center gap-3 ml-2 border-l pl-4 border-gray-300">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-sm font-bold text-[#2B3674]">
              Martin Gurley
            </span>
            <span className="text-xs text-[#A3AED0]">
              Admin
            </span>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img
              src="https://ui-avatars.com/api/?name=Martin+Gurley&background=DBEAFE&color=2B3674"
              alt="user"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default CrmHeader;