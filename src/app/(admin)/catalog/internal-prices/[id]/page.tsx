'use client';

import { InternalPriceDetailView } from '@/features/catalog/internal-price/components/admin/detail/internal-price-detail-view';
import { use } from 'react';

export default function InternalPriceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <InternalPriceDetailView internalPriceId={resolvedParams.id} />
  );
}
