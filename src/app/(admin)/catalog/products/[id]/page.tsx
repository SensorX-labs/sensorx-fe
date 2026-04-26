'use client';

import { ProductDetail } from '@/features/catalog/product/components/admin/detail/product-detail';
import { ProductForm } from '@/features/catalog/product/components/admin/form/product-form';
import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const action = searchParams.get('action');
  const isEditing = action === 'update';

  const handleEdit = () => {
    router.push(`/catalog/products/${resolvedParams.id}?action=update`);
  };

  const handleCancel = () => {
    router.push(`/catalog/products/${resolvedParams.id}`);
  };

  const handleBackToList = () => {
    router.push('/catalog/products');
  };

  if (isEditing) {
    return (
      <ProductForm 
        product={{ id: resolvedParams.id }} 
        mode="update" 
        onBack={handleCancel} 
      />
    );
  }

  return (
    <ProductDetail 
      productId={resolvedParams.id} 
      onBack={handleBackToList}
      onEdit={handleEdit}
    />
  );
}
