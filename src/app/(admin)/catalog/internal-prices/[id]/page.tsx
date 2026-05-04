'use client';

import { InternalPriceDetail } from '@/features/catalog/internal-price/components/admin/detail';
import { use } from 'react';

export default function InternalPriceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <InternalPriceDetail internalPriceId={resolvedParams.id} />
  );
}
