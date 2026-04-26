'use client';

import React from 'react';
import { FolderTree, Layers, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/shadcn-ui/tooltip";
import CategoryService from '@/features/catalog/category/services/category-services';
import { LoadMoreCategoriesForModalResponse } from '@/features/catalog/category/models';
import { BaseSelectionModal } from './base-selection-modal';

interface CategorySelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (category: LoadMoreCategoriesForModalResponse) => void;
}

/**
 * Sub-component để hiển thị từng dòng danh mục - Giúp code bên dưới gọn gàng hơn
 */
const CategoryItemRow = ({
  category: c,
  onSelect
}: {
  category: LoadMoreCategoriesForModalResponse,
  onSelect: (c: LoadMoreCategoriesForModalResponse) => void
}) => (
  <div
    onClick={() => onSelect(c)}
    className="group bg-white p-4 rounded border border-slate-200/60 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 cursor-pointer transition-all duration-200 flex items-center justify-between w-full"
  >
    <div className="flex items-center gap-4 min-w-0 flex-1">
      <div className="w-12 h-12 bg-slate-50 rounded flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
        <Layers className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors uppercase tracking-tight">
          {c.name}
        </h4>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 cursor-help">
                <FileText className="w-3 h-3" />
                <span className="truncate max-w-[300px]">{c.description || 'Chưa có mô tả'}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 text-white border-slate-700 rounded text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-xl">
              <p>{c.description || 'Không có mô tả chi tiết'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>

    <div className="shrink-0 pl-4 border-l border-slate-100 group-hover:border-emerald-100 transition-colors flex items-center h-full">
      <Button variant="ghost" className="h-9 px-4 rounded font-black text-[10px] uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
        <CheckCircle2 className="w-4 h-4 mr-2" /> Chọn
      </Button>
    </div>
  </div>
);

export function CategorySelectionDialog({ isOpen, onOpenChange, onSelect }: CategorySelectionDialogProps) {
  return (
    <BaseSelectionModal<LoadMoreCategoriesForModalResponse>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Chọn danh mục"
      description="Tìm kiếm và chọn danh mục phù hợp cho sản phẩm"
      searchPlaceholder="Nhập tên danh mục cần tìm..."
      icon={FolderTree}
      onSelect={onSelect}
      itemKey={(c) => c.id}
      fetchData={(params) => CategoryService.loadMoreForModal({ ...params, pageSize: 6, isDescending: true })}
      renderItem={(c, handleSelect) => <CategoryItemRow key={c.id} category={c} onSelect={handleSelect} />}
      emptyTitle="Không tìm thấy danh mục"
    />
  );
}
