'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { ProductDetail } from '@/features/catalog/product/components/store/product-detail';
import { ProductListItem } from '@/features/catalog/product/models/product-list-response';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = React.useState<ProductListItem | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Lấy data từ localStorage thay vì gọi API detail
    const savedProduct = localStorage.getItem('selectedProduct');
    if (savedProduct) {
      try {
        const parsed = JSON.parse(savedProduct);
        // Kiểm tra đúng ID để tránh dữ liệu cũ của sp khác
        if (parsed.id === productId) {
          setProduct(parsed);
        }
      } catch (e) {
        console.error(">>> Error parsing selectedProduct:", e);
      }
    }
    setLoading(false);
  }, [productId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-blue-600">Đang tải sản phẩm...</div>;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Không tìm thấy dữ liệu sản phẩm trong bộ nhớ tạm.</p>
        {/* Có thể thêm fallback gọi API ở đây nếu muốn */}
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
