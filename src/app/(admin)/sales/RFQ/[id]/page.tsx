'use client';

import { use } from 'react';
import RequestForQuotationDetail from '@/features/sales/RFQ/components/admin/rfq-detail';
import { useRouter } from 'next/navigation';

export default function RequestForQuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  return <RequestForQuotationDetail id={id} onBack={() => router.back()} />;
}
