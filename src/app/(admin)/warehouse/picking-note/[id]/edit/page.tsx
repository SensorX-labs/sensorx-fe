import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PickingNoteForm } from '@/features/warehouse/picking-note';

interface EditPickingNotePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPickingNotePage(props: EditPickingNotePageProps) {
  const params = await props.params;

  // TODO: Fetch picking note by ID from API
  const mockPickingNote = {
    id: params.id,
    code: 'PN-2024-001',
    date: '2024-01-15',
    warehouse: 'Kho 1',
    items: [
      {
        id: '1',
        productCode: 'PROD-001',
        productName: 'Áo thun trắng size M',
        quantity: 10,
        notes: 'Hàng mới',
      },
      {
        id: '2',
        productCode: 'PROD-002',
        productName: 'Quần jean xanh size 32',
        quantity: 15,
        notes: 'Kiểm tra kỹ',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/warehouse/picking-note/${params.id}`} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <ChevronLeft size={20} className="text-[#2B3674]" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Chỉnh Sửa Phiếu Soạn Kho</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Chỉnh sửa thông tin và chi tiết hàng hóa</p>
        </div>
      </div>

      <PickingNoteForm isEditing={true} initialData={mockPickingNote} />
    </div>
  );
}
