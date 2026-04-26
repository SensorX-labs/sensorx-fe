'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductPageList } from '../../models';
import { ProductList } from './list/product-list';
import { ProductForm } from './form/product-form';

export function ProductManagement() {
  const router = useRouter();
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [view, setView] = useState<'list' | 'create' | 'update'>('list');

  const handleViewDetail = (product: ProductPageList) => {
    router.push(`/catalog/products/${product.id}`);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setView('create');
  };

  const handleEdit = (product: ProductPageList) => {
    setSelectedProduct(product);
    setView('update');
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    setView('list');
  };

  return (
    <div className="w-full">
      {view === 'list' && (
        <ProductList
          onViewDetail={handleViewDetail}
          onCreate={handleCreate}
          onEdit={handleEdit}
        />
      )}

      {(view === 'create' || view === 'update') && (
        <ProductForm
          product={selectedProduct}
          mode={view}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}
