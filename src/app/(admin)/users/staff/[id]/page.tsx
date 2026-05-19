import StaffDetail from '@/features/user/staff/components/admin/staff-detail';
import { use } from 'react';

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <StaffDetail id={resolvedParams.id} />;
}