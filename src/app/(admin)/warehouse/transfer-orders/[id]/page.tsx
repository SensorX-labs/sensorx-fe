'use client';

import { TransferOrderDetail } from '@/features/supplychain/transferorder/components/admin/transfer-order-detail';
import { useSearchParams, useParams } from 'next/navigation';

export default function WarehouseTransferOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const action = searchParams.get('action') || undefined;

  return <TransferOrderDetail id={id} action={action} />;
}
