'use client';

import React from 'react';
import { BookOpen, FileText, Info } from 'lucide-react';
import { NotionEditor } from '@/shared/components/notion-editor';

interface ProductDescriptionCardProps {
  showcase?: string | null;
}

export function ProductDescriptionCard({ showcase }: ProductDescriptionCardProps) {
  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden mt-6 transition-all hover:shadow-md animate-in fade-in duration-700">

      {/* Header đồng bộ với ProductInfoCard */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-blue-50/80 border border-blue-100/50 text-blue-600 shadow-sm">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">Mô tả chi tiết</h4>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Thông tin giới thiệu và thông số mở rộng</p>
        </div>
      </div>

      {/* Content Area */}
      <div className={`
        min-h-[350px] p-8 flex flex-col 
        ${!showcase ? 'items-center justify-center bg-slate-50/30' : 'bg-white'}
      `}>
        {showcase ? (
          <div className="prose prose-slate max-w-none prose-sm sm:prose-base w-full">
            <NotionEditor
              content={showcase}
              editable={false}
            />
          </div>
        ) : (
          <div className="text-center w-full animate-in zoom-in-95 duration-500">
            {/* Empty State Icon */}
            <div className="w-16 h-16 rounded bg-white flex items-center justify-center mb-5 border border-slate-100 shadow-sm mx-auto">
              <BookOpen className="w-7 h-7 text-slate-300" />
            </div>

            {/* Empty State Text */}
            <h5 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Chưa có nội dung</h5>
            <p className="text-xs font-medium text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              Sản phẩm này hiện chưa được thiết lập thông tin mô tả chi tiết trên hệ thống.
            </p>

            {/* Hint Box */}
            <div className="mt-8 flex items-center gap-2 px-4 py-2.5 rounded bg-blue-50/50 border border-blue-100 text-xs font-semibold text-blue-600 w-fit mx-auto transition-colors hover:bg-blue-50">
              <Info className="w-4 h-4" />
              Gợi ý: Cập nhật mô tả để tăng tỷ lệ chuyển đổi
            </div>
          </div>
        )}
      </div>
    </div>
  );
}