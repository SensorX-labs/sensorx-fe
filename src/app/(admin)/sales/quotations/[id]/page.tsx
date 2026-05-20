'use client';

import { useParams, useSearchParams } from 'next/navigation';
import QuotationForm from '@/features/sales/quotation/components/admin/quotation-form';
import QuotationDetail from '@/features/sales/quotation/components/admin/quotation-detail';

export default function QuotationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const action = searchParams.get('action');

  if (action === 'edit') {
    return <QuotationForm id={id} />;
  }

  return <QuotationDetail id={id} />;
}

