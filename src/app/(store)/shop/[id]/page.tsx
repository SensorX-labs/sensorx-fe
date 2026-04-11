'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/features/catalog/product/mocks/product-mocks';
import { ProductDetail } from '@/features/catalog/product/components/store/product-detail';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const product = MOCK_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
