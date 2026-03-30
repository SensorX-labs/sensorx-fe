'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { Product } from '@/features/refactor/catalog/product/models';
import Image from 'next/image';

interface AddItemToCartMessageProps {
  product: Product;
  quantity: number;
  isVisible: boolean;
  onClose: () => void;
}

export function AddCartItemMessage({
  product,
  quantity,
  isVisible,
  onClose,
}: AddItemToCartMessageProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!show) return null;

  const primaryImg = product.images?.[0]?.imageUrl || '/assets/images/products/default.webp';

  return (
    <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-right duration-300">
      <div className="bg-white border border-gray-200 shadow-lg rounded p-6 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="btn-tracking uppercase text-xs">✓ Đã thêm vào giỏ hàng</h3>
          <button
            onClick={() => {
              setShow(false);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-4">
          {/* ảnh sản phẩm*/}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 relative bg-gray-100 rounded overflow-hidden">
              <Image
                src={primaryImg}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* thông tin sản phẩm*/}
          <div className="flex-1">
            <h4 className="tracking-title text-sm mb-1">
              {product.name}
            </h4>
            <p className="meta-label mb-3">
              Mã: {product.code} | Thương hiệu: {product.manufacture}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              Số lượng: {quantity}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Link
            href="/shop/cart"
            className="flex-1 py-2 border border-gray-300 text-gray-900 btn-tracking text-xs hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
