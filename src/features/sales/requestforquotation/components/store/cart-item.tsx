'use client';

import React from 'react';
import Image from 'next/image';
import { X, Minus, Plus } from 'lucide-react';
import { ProductListItem } from '@/features/catalog/product/models/product-list-response';

interface CartItemProps {
  product: ProductListItem;
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
  const primaryImg = (product.images?.[0] && product.images[0] !== 'string') 
    ? product.images[0] 
    : '/assets/images/products/default.png';

  return (
    <div className="flex gap-6 py-8 border-b border-gray-200">
      {/* ảnh sản phẩm */}
      <div className="flex-shrink-0">
        <div className="w-24 h-24 md:w-32 md:h-32 relative bg-product-card-bg rounded border border-product-card-border overflow-hidden">
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
        <h3 className="tracking-title text-sm md:text-base font-bold text-gray-900 mb-1">
          {product.name}
        </h3>
        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-4">
          Mã: {product.code} | Thương hiệu: {product.manufacture}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus size={14} className="text-gray-600" />
            </button>
            <span className="px-2 w-10 md:w-16 text-center text-xs md:text-sm font-bold text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus size={14} className="text-gray-600" />
            </button>
          </div>

          <button
            onClick={onRemove}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 uppercase text-[10px] font-bold tracking-widest"
          >
            <X size={16} />
            <span className="hidden md:inline">Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
