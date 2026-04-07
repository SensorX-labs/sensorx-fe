'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ShoppingBag, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { CartItem } from './cart-item';
import { mockProducts } from '@/features/catalog/product/mocks/mock-product';
import { QuotationForm, QuotationFormData } from './quote-request-form';

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

const initialFormData: QuotationFormData = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvanan@email.com',
  phone: '0912345678',
  companyName: 'Công Ty TNHH SensorX',
  taxId: '0123456789',
  address: {
    street: '123 Đường ABC',
    ward: 'Phường 1',
    district: 'Quận 1',
    province: 'TP. Hồ Chí Minh',
  },
};

export function Cart() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [formData, setFormData] = useState<QuotationFormData>(initialFormData);

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
    if (!formData.companyName || !formData.taxId) {
      alert('Vui lòng nhập đầy đủ thông tin doanh nghiệp (Tên công ty và Mã số thuế).');
      return;
    }
    console.log('Quotation Request Data:', { cartItems, formData });
    alert(`Yêu cầu báo giá của bạn (Người nhận: ${formData.name}) đã được gửi thành công. Nhân viên sẽ phản hồi trong vòng 24h.`);
  };

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-page-background">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs tracking-widest font-medium uppercase text-gray-400">
            <Link href="/shop" className="hover:text-brand-green">Cửa hàng</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 border-b border-gray-900 pb-0.5">Giỏ hàng & Yêu cầu báo giá</span>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft size={16} />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>

      {isEmpty ? (
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="tracking-title-xl mb-8">Giỏ hàng rỗng</h1>
          <Link
            href="/shop"
            className="inline-block px-10 py-4 bg-brand-green text-white font-bold tracking-widest uppercase text-[10px]"
          >
            Quay lại cửa hàng
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex gap-16 items-start">
            
            <div className="w-2/3 space-y-12">
              
              <section className="bg-white border border-gray-200 p-10">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                  <span className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center text-sm font-bold">01</span>
                  <h2 className="tracking-title-lg mb-0 text-2xl">Danh sách sản phẩm</h2>
                </div>
                <div className="divide-y divide-gray-100">
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
              </section>

              {/* Step 2: Quotation Info */}
              <section className="bg-white border border-gray-200 p-10">
                <div className="flex items-center gap-4 mb-4 pb-0">
                  <span className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center text-sm font-bold">02</span>
                  <h2 className="tracking-title-lg mb-0 text-2xl">Thông tin yêu cầu báo giá</h2>
                </div>
                <QuotationForm 
                  formData={formData} 
                  onChange={setFormData} 
                />
              </section>
            </div>

            {/* Sidebar Summary (1/3) */}
            <aside className="w-1/3 sticky top-8">
              <div className="bg-product-card-bg border border-product-card-border p-10">
                <h3 className="tracking-title mb-8 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-brand-green" />
                  Tổng quan yêu cầu
                </h3>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center py-4 border-y border-gray-200/50">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Sản phẩm</span>
                    <span className="font-bold text-lg">{cartItems.length}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-brand-green mt-0.5" />
                      <p className="text-xs text-gray-600 leading-relaxed">Đã chọn các linh kiện cần thiết</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className={formData.companyName && formData.taxId ? "text-brand-green mt-0.5" : "text-gray-300 mt-0.5"} />
                      <p className="text-xs text-gray-600 leading-relaxed">Thông tin doanh nghiệp: {formData.companyName && formData.taxId ? "Đã nhập" : "Chưa hoàn tất"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleRequestQuote}
                    className="w-full bg-brand-green text-white py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    Gửi yêu cầu báo giá
                    <Send size={14} />
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center leading-relaxed font-medium">
                    Bằng việc nhấn nút, bạn đồng ý với <Link href="/policy" className="text-brand-green underline underline-offset-2 hover:text-brand-green/80 transition-colors">chính sách xử lý dữ liệu</Link> của SensorX.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        </div>
      )}
    </div>
  );
}

