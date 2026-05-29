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
      const rfqItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const rfqId = await StoreRFQService.createRFQ(rfqItems);
      clearCart();
      toast.success("Đã lưu bản thảo yêu cầu báo giá!");
      return rfqId;
    } catch (error) {
      console.error("Error sending RFQ:", error);
      toast.error("Không thể lưu bản thảo");
    }
  }

  const handleSendRFQ = async () => {
    try {
      const rfqId = await handleSaveDraft();
      if (!rfqId) {
        toast.error("Không thể gửi yêu cầu báo giá");
        return;
      }
      await StoreRFQService.sendRFQ(rfqId);
      toast.success("Đã gửi yêu cầu báo giá thành công!");
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
      <div className="py-24 text-center bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-zinc-700 mx-auto mb-4" />
        <p className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">Giỏ hàng bản thảo đang trống.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans select-none">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400">
          Danh sách sản phẩm ({items.length})
        </h3>
        <button
          onClick={clearCart}
          className="text-[10px] font-sans font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors cursor-pointer font-extrabold"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-stone-850 rounded-2xl overflow-hidden shadow-md">
        <div className="divide-y divide-stone-200 dark:divide-zinc-800">
          {items.map((item, idx) => {
            const bgAccents = [
              'bg-emerald-500', 
              'bg-indigo-500',  
              'bg-teal-500',    
              'bg-violet-500',  
              'bg-amber-500',   
              'bg-cyan-500',    
            ];
            const bgAccent = bgAccents[idx % bgAccents.length];

            return (
              <div key={item.productId} className="p-6 flex items-center gap-6 hover:bg-stone-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer group relative overflow-hidden">
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${bgAccent}`} />
                
                <div className="relative w-20 h-20 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 flex-shrink-0 ml-2 rounded-xl overflow-hidden shadow-sm">
                  <Image
                    src={item.image || '/assets/images/products/default.png'}
                    alt={item.productName}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    onClick={() => router.push(`/shop/${item.productId}`)}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-heading font-extrabold uppercase tracking-wide text-stone-900 dark:text-white mb-1 truncate">
                    {item.productName}
                  </h4>
                  <p className="text-[9px] font-mono text-stone-400 dark:text-zinc-500 uppercase tracking-widest mb-4 font-bold">
                    Mã: {item.productId.substring(0, 8)}...
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-full overflow-hidden shadow-inner">
                      <button
                        onClick={() => handleUpdateQty(item.productId, item.quantity, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-zinc-850 transition-colors border-r border-stone-200 dark:border-zinc-800 cursor-pointer"
                      >
                        <Minus size={11} className="text-stone-500 font-bold" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-stone-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.productId, item.quantity, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-zinc-850 transition-colors border-l border-stone-200 dark:border-zinc-800 cursor-pointer"
                      >
                        <Plus size={11} className="text-stone-500 font-bold" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
        <button
          onClick={handleSaveDraft}
          className="flex items-center justify-center gap-3 px-8 h-12 bg-white dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:bg-stone-50 dark:hover:bg-zinc-800 text-stone-850 dark:text-white transition-all cursor-pointer active:scale-95 shadow-sm">
          <Save size={16} className="shrink-0" />
          Lưu bản thảo
        </button>
        <button
          onClick={handleSendRFQ}
          className="flex items-center justify-center gap-3 px-8 h-12 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all cursor-pointer active:scale-95 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
          <Send size={16} className="shrink-0" />
          Gửi yêu cầu báo giá
        </button>
      </div>
    </div>
  );
}
