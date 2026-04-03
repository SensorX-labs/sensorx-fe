'use client';

import React from 'react';
import Image from 'next/image';
import { X, Minus, Plus } from 'lucide-react';
import { Product } from '@/features/catalog/product/models/product';

interface CartItemProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const primaryImg = product.images?.[0]?.imageUrl || '/assets/images/products/default.webp';

  return (
    <div className="flex gap-6 py-8 border-b border-gray-200">
      {/* ảnh sản phẩm */}
      <div className="flex-shrink-0">
        <div className="w-32 h-32 relative bg-product-card-bg rounded border border-product-card-border overflow-hidden">
          <Image
            src={primaryImg}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* thông tin sản phẩm */}
      <div className="flex-1">
        <h3 className="tracking-title mb-2">
          {product.name}
        </h3>
        <p className="meta-label mb-4">
          Mã: {product.code} | Thương hiệu: {product.manufacture}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <span className="px-4 w-16 text-center text-sm font-medium text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>

          <button
            onClick={onRemove}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
