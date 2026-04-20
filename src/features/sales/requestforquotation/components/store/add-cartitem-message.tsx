'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import Image from 'next/image';
import { ProductListItem } from '@/features/catalog/product/models/product-list-response';

interface AddItemToCartMessageProps {
  product: ProductListItem;
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

  const primaryImg = (product.images?.[0] && product.images[0] !== 'string') 
    ? product.images[0] 
    : '/assets/images/products/default.png';

  return (
    <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-right duration-300">
      <div className="bg-white border border-gray-200 shadow-lg rounded p-6 max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="btn-tracking uppercase text-[10px] font-bold text-brand-green">✓ Đã thêm vào giỏ hàng</h3>
          <button
            onClick={() => {
              setShow(false);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 relative bg-gray-50 border border-gray-100 rounded overflow-hidden">
              <Image
                src={primaryImg}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-xs mb-1 line-clamp-2">
              {product.name}
            </h4>
            <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider">
              Mã: {product.code}
            </p>
            <p className="text-xs font-bold text-gray-900">
              Số lượng: {quantity}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <Link
            href="/shop/cart"
            className="flex-1 py-3 border border-gray-300 text-gray-900 font-bold uppercase tracking-widest text-[9px] hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Xem giỏ hàng
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest text-[9px] hover:bg-gray-800 transition-colors"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}
