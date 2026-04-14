'use client';

import { TransferOrderDetail } from '@/features/supplychain/transferorder/components/admin/transfer-order-detail';
import { useSearchParams } from 'next/navigation';

interface TransferOrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function TransferOrderDetailPage({ params }: TransferOrderDetailPageProps) {
  const searchParams = useSearchParams();
  const action = searchParams.get('action') || undefined;

  return <TransferOrderDetail id={params.id} action={action} />;
}
