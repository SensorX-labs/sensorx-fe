'use client';

import { useParams } from 'next/navigation';
import SupplyRequestDetail from '@/features/supplychain/supplyrequest/components/supply-request-detail';

export default function SupplyRequestDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <SupplyRequestDetail id={id} />;
}
