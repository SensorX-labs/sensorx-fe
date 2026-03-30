'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { ProductDetail } from '@/features/refactor/catalog/product/components/store';
import { mockProducts } from '@/features/refactor/catalog/product/mocks';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
