'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ShoppingBag, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { CartItem } from './cart-item';
import { QuotationForm, QuotationFormData } from './quote-request-form';
import { useCart } from '../../hooks/use-cart';
import { RFQServices } from '../../services/rfq-services';
import { RfqCreateRequest } from '../../models/rfq-create-request';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/shadcn-ui/alert-dialog";

const initialFormData: QuotationFormData = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
  taxId: '',
  address: '',
};

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState<QuotationFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load form data từ localStorage nếu có
  useEffect(() => {
    const savedForm = localStorage.getItem('quotationFormData');
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        // Fix lỗi [object Object] nếu dữ liệu cũ là object địa chỉ
        if (typeof parsed.address === 'object' && parsed.address !== null) {
          parsed.address = ''; // Hoặc convert thành chuỗi nếu muốn giữ lại
        }
        setFormData(parsed);
      } catch (e) {
        console.error('Lỗi khi parse form data:', e);
      }
    }
  }, []);

  // Lưu form data khi thay đổi
  useEffect(() => {
    localStorage.setItem('quotationFormData', JSON.stringify(formData));
  }, [formData]);

  const handleRequestQuote = async () => {
    if (!formData.name || !formData.phone || !formData.companyName || !formData.taxId || !formData.address) {
      toast.warning('Thông tin chưa đầy đủ', {
        description: 'Vui lòng nhập đầy đủ các thông tin bắt buộc có dấu *'
      });
      return;
    }

    setIsSubmitting(true);

    const request: RfqCreateRequest = {
      customerId: "af277326-224c-48c8-9bf5-54b2244fa71f",
      recipientName: formData.name,
      recipientPhone: formData.phone,
      companyName: formData.companyName,
      email: formData.email,
      address: formData.address,
      taxCode: formData.taxId,
      items: cartItems.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        productCode: i.product.code,
        quantity: i.quantity,
        manufacturer: i.product.manufacture,
        unit: i.product.unit || "Cái" // Chốt chặn cuối cùng: Đảm bảo luôn có unit gửi lên API
      }))
    };

    localStorage.setItem('lastCreatedRfq', JSON.stringify(request));
    try {
      const response = await RFQServices.createRFQ(request);
      if (response.isSuccess) {
        setShowSuccessDialog(true);
        clearCart();
      } else {
        toast.warning("Gửi yêu cầu thất bại", {
          description: response.message || "Đã xảy ra lỗi không xác định"
        });
      }
    } catch (error: any) {
      console.error(">>> Lỗi khi tạo RFQ:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-page-background font-sans">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs tracking-widest font-bold uppercase text-gray-400">
            <Link href="/shop" className="hover:text-brand-green transition-all">Cửa hàng</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 border-b border-gray-900 pb-0.5">Giỏ hàng & Yêu cầu báo giá</span>
          </div>
          <Link href="/shop" className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-all">
            <ArrowLeft size={16} />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>

      {isEmpty ? (
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="tracking-title-xl mb-6">GIỎ HÀNG RỖNG</h1>
          <p className="text-sm text-gray-500 mb-12 uppercase tracking-[0.2em]">Bạn chưa chọn sản phẩm nào để yêu cầu báo giá.</p>
          <Link
            href="/shop"
            className="inline-block px-10 py-4 bg-brand-green text-white font-bold tracking-widest uppercase text-[10px] hover:shadow-lg transition-all"
          >
            Quay lại cửa hàng
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-16 items-start">

            <div className="w-full lg:w-2/3 space-y-12">

              <section className="bg-white border border-gray-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                  <span className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center text-sm font-bold">01</span>
                  <h2 className="text-2xl font-bold tracking-widest uppercase mb-0">Danh sách sản phẩm</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.product.id}
                      product={item.product}
                      quantity={item.quantity}
                      onQuantityChange={(q) => updateQuantity(item.product.id, q)}
                      onRemove={() => removeFromCart(item.product.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="bg-white border border-gray-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-4 pb-0">
                  <span className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center text-sm font-bold">02</span>
                  <h2 className="text-2xl font-bold tracking-widest uppercase mb-0">Thông tin báo giá</h2>
                </div>
                <QuotationForm
                  formData={formData}
                  onChange={setFormData}
                />
              </section>
            </div>

            <aside className="w-full lg:w-1/3 lg:sticky lg:top-8">
              <div className="bg-white border border-gray-200 p-8 md:p-12 shadow-sm">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-10 flex items-center gap-2 text-gray-900">
                  <ShoppingBag size={20} className="text-brand-green" />
                  TÓM TẮT YÊU CẦU
                </h3>

                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center py-4 border-y border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sản phẩm</span>
                    <span className="font-bold text-lg text-gray-900">{cartItems.length}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-brand-green mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-gray-600 leading-relaxed uppercase tracking-wider">Đã tối ưu linh kiện</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className={formData.companyName && formData.taxId && formData.address ? "text-brand-green mt-0.5 flex-shrink-0" : "text-gray-200 mt-0.5 flex-shrink-0"} />
                      <p className="text-[11px] text-gray-600 leading-relaxed uppercase tracking-wider">Thông tin doanh nghiệp hợp lệ</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleRequestQuote}
                    disabled={isSubmitting}
                    className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-brand-green'} text-white py-5 text-[10px] font-bold tracking-[0.3em] uppercase transition-all shadow-md flex items-center justify-center gap-3 active:scale-[0.98] hover:bg-opacity-90`}
                  >
                    {isSubmitting ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU BÁO GIÁ'}
                    {!isSubmitting && <Send size={14} />}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center leading-relaxed font-bold uppercase tracking-widest">
                    Phản hồi trong vòng <span className="text-gray-900">24 giờ làm việc</span>.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        </div>
      )}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md rounded-none border border-gray-100 shadow-2xl">
          <AlertDialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={32} className="text-brand-green" />
            </div>
            <AlertDialogTitle className="text-center tracking-widest font-bold uppercase text-xl">
              Gửi yêu cầu thành công
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm leading-relaxed text-gray-500 uppercase tracking-widest">
              Yêu cầu báo giá của bạn đã được tiếp nhận. <br />
              Đội ngũ chuyên gia của <strong>SensorX</strong> sẽ phản hồi <br />
              trong vòng <strong>24 giờ làm việc</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogAction
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-gray-900 text-white rounded-none py-6 font-bold tracking-[0.3em] uppercase text-[10px] hover:bg-brand-green transition-all"
            >
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
