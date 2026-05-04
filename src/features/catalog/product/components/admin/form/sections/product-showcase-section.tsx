'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { NotionEditor } from '@/shared/components/notion-editor';

interface ProductShowcaseSectionProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function ProductShowcaseSection({ content, onChange, className }: ProductShowcaseSectionProps) {
  return (
    <div className={`bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">Nội dung mô tả sản phẩm</h4>
        <LayoutGrid className="w-4 h-4 text-slate-300" />
      </div>
      <div className="p-0 flex-1 overflow-hidden">
        <NotionEditor
          content={content}
          onChange={onChange}
          editable={true}
        />
      </div>
    </div>
  );
}
