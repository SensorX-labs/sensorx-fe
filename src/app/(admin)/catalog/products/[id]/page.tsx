import { ProductDetail } from '@/features/catalog/product/components/admin/product-detail';
import { use } from 'react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ProductDetail id={resolvedParams.id} />;
}
