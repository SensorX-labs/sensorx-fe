'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { mockProducts } from '@/features/catalog/product/mocks/mock-product';
import { ProductDetail } from '@/features/catalog/product/components/store/product-detail';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
