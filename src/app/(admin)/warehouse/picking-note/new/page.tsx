import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PickingNoteForm } from '@/features/warehouse/picking-note';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

export default function NewPickingNotePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/warehouse/picking-note" className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <ChevronLeft size={20} className="text-[#2B3674]" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Tạo Phiếu Soạn Kho</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Tạo phiếu soạn kho mới để quản lý hàng hóa</p>
        </div>
      </div>

      <PickingNoteForm isEditing={false} />
    </div>
  );
}
