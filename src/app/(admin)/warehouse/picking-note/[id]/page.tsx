import { PickingNoteDetail } from '@/features/warehouse/picking-note/components/admin/picking-note-detail';

interface PickingNoteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PickingNoteDetailPage(props: PickingNoteDetailPageProps) {
  const params = await props.params;

  const mockPickingNotes = [
    {
      id: '1',
      code: 'PN-2024-001',
      date: '2024-01-15',
      createdBy: 'Nguyễn Văn A',
      warehouse: 'Kho 1',
      status: 'draft' as const,
      items: [
        { id: '1', productCode: 'PROD-001', productName: 'Áo thun trắng size M', quantity: 10, notes: 'Hàng mới' },
        { id: '2', productCode: 'PROD-002', productName: 'Quần jean xanh size 32', quantity: 15, notes: 'Kiểm tra kỹ' },
      ],
      createdAt: '2024-01-15T08:30:00Z',
      updatedAt: '2024-01-15T08:30:00Z',
    },
    {
      id: '2',
      code: 'PN-2024-002',
      date: '2024-01-14',
      createdBy: 'Trần Thị B',
      warehouse: 'Kho 2',
      status: 'confirmed' as const,
      items: [
        { id: '1', productCode: 'PROD-004', productName: 'Giày thể thao Nam', quantity: 5, notes: '' },
      ],
      createdAt: '2024-01-14T10:20:00Z',
      updatedAt: '2024-01-14T11:45:00Z',
    },
    {
      id: '3',
      code: 'PN-2024-003',
      date: '2024-01-13',
      createdBy: 'Lê Văn C',
      warehouse: 'Kho 1',
      status: 'completed' as const,
      items: [
        { id: '1', productCode: 'PROD-005', productName: 'Balo du lịch 45L', quantity: 8, notes: 'Đã đóng gói' },
      ],
      createdAt: '2024-01-13T09:00:00Z',
      updatedAt: '2024-01-13T16:20:00Z',
    },
  ];

  const mockPickingNote = mockPickingNotes.find(n => n.id === params.id) || mockPickingNotes[0];

  return (
    <PickingNoteDetail id={params.id} initialData={mockPickingNote} />
  );
}
