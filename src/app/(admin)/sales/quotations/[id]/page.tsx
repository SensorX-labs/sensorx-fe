'use client';

import { useParams } from 'next/navigation';
import QuotationDetail from '@/features/sales/quotation/components/admin/quotation-detail';

export default function QuotationPage() {
  const params = useParams();
  const id = params.id as string;

  return <QuotationDetail id={id} />;
}

