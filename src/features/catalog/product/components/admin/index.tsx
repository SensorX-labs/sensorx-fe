'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductPageList } from '../../models';
import { ProductList } from './list/product-list';
import { ProductForm } from './form/product-form';
import { ProductService } from '../../services/product-service';

export function ProductManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');
  const idParam = searchParams.get('id');

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [view, setView] = useState<'list' | 'create' | 'update'>('list');

  useEffect(() => {
    if (actionParam === 'create') {
      setView('create');
      setSelectedProduct(null);
    } else if (actionParam === 'update' && idParam) {
      // Fetch product detail to populate the form if we only have ID
      const fetchProduct = async () => {
        const res = await ProductService.getDetail(idParam);
        if (res.isSuccess) {
          setSelectedProduct(res.value);
          setView('update');
        }
      };
      fetchProduct();
    } else {
      setView('list');
      setSelectedProduct(null);
    }
  }, [actionParam, idParam]);

  const handleViewDetail = (product: ProductPageList) => {
    router.push(`/catalog/products/${product.id}`);
  };

  const handleCreate = () => {
    router.push('/catalog/products?action=create');
  };

  const handleEdit = (product: ProductPageList) => {
    router.push(`/catalog/products?id=${product.id}&action=update`);
  };

  const handleBackToList = () => {
    router.push('/catalog/products');
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
