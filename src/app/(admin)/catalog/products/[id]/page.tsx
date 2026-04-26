'use client';

import { ProductDetail } from '@/features/catalog/product/components/admin/detail/product-detail';
import { ProductForm } from '@/features/catalog/product/components/admin/form/product-form';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
