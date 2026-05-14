'use client';

import { useParams } from 'next/navigation';
import StockInDetail from '@/features/inventory/stockin/components/admin/stockin-detail';

export default function WarehouseStockInDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <StockInDetail id={id} />;
}
