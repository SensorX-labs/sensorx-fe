import { DetailStaff } from '@/features/user/staff/components/admin/detail-staff';
import { use } from 'react';

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <DetailStaff id={resolvedParams.id} />;
}