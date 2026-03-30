import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PickingNoteDetail } from '@/features/refactor/warehouse/picking-note';

interface PickingNoteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PickingNoteDetailPage(props: PickingNoteDetailPageProps) {
  const params = await props.params;

  // TODO: Fetch picking note by ID from API
  const mockPickingNote = {
    id: params.id,
    code: 'PN-2024-001',
    date: '2024-01-15',
    createdBy: 'Nguyễn Văn A',
    warehouse: 'Kho 1',
    status: 'draft' as const,
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
      {
        id: '3',
        productCode: 'PROD-003',
        productName: 'Mũ lưỡi trai đen',
        quantity: 20,
        notes: '',
      },
    ],
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  };

  return (
    <div>
      <PickingNoteDetail note={mockPickingNote} />
    </div>
  );
}
