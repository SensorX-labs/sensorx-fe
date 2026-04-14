'use client';

import { useParams } from 'next/navigation';
import StockOutDetail from '@/features/inventory/stockout/components/admin/stockout-detail';

export default function StockOutDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <StockOutDetail id={id} />;
}
