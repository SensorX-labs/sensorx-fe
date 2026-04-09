'use client';

import { useParams } from 'next/navigation';
import QuotationCreate from '@/features/sales/quotation/components/admin/quotation-create';

export default function QuotationPage() {
  const params = useParams();
  const id = params.id as string;

  return <QuotationCreate id={id} />;
}
