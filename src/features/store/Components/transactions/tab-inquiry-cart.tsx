'use client';

import { useInquiryCart } from '@/shared/hooks/use-inquiry-cart';
import { Trash2, ShoppingBag, Plus, Minus, Send, Save } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { StoreRFQService } from '../../services/store-rfq.service';

export function TabInquiryCart() {
  const { items, removeItem, updateQuantity, clearCart } = useInquiryCart();
  const router = useRouter();

  const handleUpdateQty = (productId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      updateQuantity(productId, newQty);
    }
  };

  const handleSaveDraft = async () => {
    try {
      // Create RFQ items from cart items
      const rfqItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Send RFQ
      const rfqId = await StoreRFQService.createRFQ(rfqItems);
      clearCart();
      return rfqId;
    } catch (error) {
      console.error("Error sending RFQ:", error);
    }
  }

  const handleSendRFQ = async () => {
    try {
      // Create RFQ items from cart items
      const rfqId = await handleSaveDraft();
      if (!rfqId) {
        toast.error("Không thể gửi yêu cầu báo giá");
        return;
      }
      await StoreRFQService.sendRFQ(rfqId);

    } catch (error) {
      console.error("Error sending RFQ:", error);
    }
  };

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('hideInquiryCartPanel', { detail: { hide: true } }));

    return () => {
      window.dispatchEvent(new CustomEvent('hideInquiryCartPanel', { detail: { hide: false } }));
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center bg-white border border-dashed border-gray-100">
        <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
        <p className="meta-label uppercase">Giỏ hàng bản thảo đang trống.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          Danh sách sản phẩm ({items.length})
        </h3>
        <button
          onClick={clearCart}
          className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="border border-gray-100 bg-white">
        <div className="divide-y divide-gray-50">
          {items.map((item) => (
            <div key={item.productId} className="p-6 flex items-center gap-6 hover:bg-gray-50/50 transition-colors cursor-pointer group">
              <div className="relative w-20 h-20 bg-gray-50 flex-shrink-0 border border-gray-100">
                <Image
                  src={item.image || '/assets/images/products/default.png'}
                  alt={item.productName}
                  fill
                  className="object-contain p-2"
                  onClick={() => router.push(`/shop/${item.productId}`)}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold tracking-tight text-gray-900 mb-1 truncate">
                  {item.productName}
                </h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                  Mã: {item.productId.substring(0, 8)}...
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-100">
                    <button
                      onClick={() => handleUpdateQty(item.productId, item.quantity, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.productId, item.quantity, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
        <>
          <button
            onClick={handleSaveDraft}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-gray-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-all cursor-pointer active:scale-95">
            <Save size={16} />
            Lưu bản thảo hệ thống
          </button>
          <button
            onClick={handleSendRFQ}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all cursor-pointer active:scale-95">
            <Send size={16} />
            Gửi yêu cầu báo giá ngay
          </button>
        </>
      </div>
    </div>
  );
}
