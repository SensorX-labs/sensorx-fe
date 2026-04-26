'use client';

import React from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  LayoutList, 
  LayoutGrid, 
  FolderTree 
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';

interface CategoryHeaderProps {
  viewMode: 'table' | 'tree';
  onViewModeChange: (mode: 'table' | 'tree') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  matchingIds: string[];
  currentMatchIndex: number;
  onPrevMatch: () => void;
  onNextMatch: () => void;
  onCreateClick: () => void;
}

export function CategoryHeader({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  matchingIds,
  currentMatchIndex,
  onPrevMatch,
  onNextMatch,
  onCreateClick
}: CategoryHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-50 p-4 shrink-0 z-10">
      <div className="flex items-center gap-4">
        {/* View Toggles */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-100 shadow-sm flex-shrink-0">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            className={`h-8 px-3 rounded-lg transition-all ${viewMode === 'table' ? 'admin-btn-primary shadow-sm' : 'hover:bg-gray-100 text-gray-600'}`}
            onClick={() => onViewModeChange('table')}
          >
            <LayoutList className="w-4 h-4 mr-2" />
            Danh sách
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'ghost'}
            size="sm"
            className={`h-8 px-3 rounded-lg transition-all ${viewMode === 'tree' ? 'admin-btn-primary shadow-sm' : 'hover:bg-gray-100 text-gray-600'}`}
            onClick={() => onViewModeChange('tree')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Dạng Cây
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Search Navigation */}
        {viewMode === 'tree' && matchingIds.length > 0 && (
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-100 shadow-lg shadow-blue-500/5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="px-3 py-1 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Kết quả</span>
              <span className="text-xs font-black text-blue-700 min-w-[3rem] text-center">
                {currentMatchIndex + 1} <span className="text-blue-300 mx-0.5">/</span> {matchingIds.length}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                onClick={onPrevMatch}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                onClick={onNextMatch}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <Button
          className="admin-btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20 flex-shrink-0"
          onClick={onCreateClick}
        >
          <FolderTree className="w-4 h-4" />
          Tạo danh mục
        </Button>
      </div>
    </div>
  );
}
