'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CartItem } from './cart-item';
import { mockProducts } from '@/features/catalog/product/mocks/mock-product';

const mockCartItems = [
  {
    product: mockProducts.find((p) => p.id === 'prod-001')!,
    quantity: 2,
  },
  {
    product: mockProducts.find((p) => p.id === 'prod-002')!,
    quantity: 1,
  },
];

export function Cart() {
  const [cartItems, setCartItems] = useState(mockCartItems);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.product.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.product.id !== itemId));
  };

  const handleRequestQuote = () => {
    alert('Yêu cầu của bạn đã được gửi thành công. Nhân viên sẽ phản hồi trong vòng 24h.');
  };

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-page-background">

      {isEmpty ? (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="tracking-title-lg mb-8">Giỏ hàng của bạn đang trống</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-brand-green text-white btn-tracking hover:opacity-90 transition-opacity"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="grid grid-cols-3 gap-12">
            {/* danh sách item trong giỏ hàng */}
            <div className="col-span-2">
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.product.id}
                    product={item.product}
                    quantity={item.quantity}
                    onQuantityChange={(quantity) =>
                      handleQuantityChange(item.product.id, quantity)
                    }
                    onRemove={() => handleRemoveItem(item.product.id)}
                  />
                ))}
              </div>
            </div>

            {/* nút yêu cầu báo giá*/}
            <div className="col-span-1">
              <div className="bg-product-card-bg border border-product-card-border p-8 sticky top-24">
                <h2 className="tracking-title mb-4">
                  Yêu cầu báo giá
                </h2>
                <p className="subtitle-sm mb-6">
                  Bạn có <span className="font-semibold">{cartItems.length} sản phẩm</span> trong giỏ hàng. Vui lòng gửi yêu cầu báo giá để nhận được mức giá tốt nhất.
                </p>

                <button
                  onClick={handleRequestQuote}
                  className="w-full bg-brand-green text-white py-3 btn-tracking hover:opacity-90 transition-opacity mb-3"
                >
                  Yêu cầu báo giá
                </button>

                <Link
                  href="/shop"
                  className="block text-center py-3 border border-gray-300 text-gray-900 btn-tracking hover:bg-gray-50 transition-colors"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
