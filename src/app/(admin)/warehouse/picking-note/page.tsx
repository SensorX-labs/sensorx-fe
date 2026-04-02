import { PickingNoteList } from '@/features/warehouse/picking-note/components/admin/picking-note-list';
import React from 'react';

interface PickingNoteListPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PickingNoteListPage(props: PickingNoteListPageProps) {
  // TODO: Fetch picking notes from API
  const mockPickingNotes = [
    {
      id: '1',
      code: 'PN-2024-001',
      date: '2024-01-15',
      createdBy: 'Nguyễn Văn A',
      items: 5,
      status: 'draft' as const,
      totalQuantity: 45,
    },
    {
      id: '2',
      code: 'PN-2024-002',
      date: '2024-01-14',
      createdBy: 'Trần Thị B',
      items: 3,
      status: 'confirmed' as const,
      totalQuantity: 32,
    },
    {
      id: '3',
      code: 'PN-2024-003',
      date: '2024-01-13',
      createdBy: 'Lê Văn C',
      items: 8,
      status: 'completed' as const,
      totalQuantity: 78,
    },
  ];

  return <PickingNoteList notes={mockPickingNotes} />;
}
