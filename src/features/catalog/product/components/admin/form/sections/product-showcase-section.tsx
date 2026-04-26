'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { NotionEditor } from '@/shared/components/notion-editor';

interface ProductShowcaseSectionProps {
  content: string;
  onChange: (content: string) => void;
}

export function ProductShowcaseSection({ content, onChange }: ProductShowcaseSectionProps) {
  return (
    <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nội dung mô tả sản phẩm</h4>
        <LayoutGrid className="w-4 h-4 text-slate-300" />
      </div>
      <div className="p-0 min-h-[400px]">
        <NotionEditor
          content={content}
          onChange={onChange}
          editable={true}
        />
      </div>
    </div>
  );
}
