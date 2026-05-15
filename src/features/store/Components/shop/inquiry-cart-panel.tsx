'use client';

import React, { useState } from 'react';
import { ClipboardList, X, Send, Trash2, ChevronUp, ChevronDown, Minus, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useInquiryCart } from '@/shared/hooks/use-inquiry-cart';
import { StoreRFQService } from '@/features/store/services/store-rfq.service';
import { cn } from '@/shared/utils';

export function InquiryCartPanel() {
    const router = useRouter();
    const { items, totalItems, removeItem, updateQuantity, clearCart } = useInquiryCart();
    const [isOpen, setIsOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);

    if (totalItems === 0) return null;

    const isAuthenticated = () => !!Cookies.get('token');

    const handleAction = async (type: 'DRAFT' | 'SEND') => {
        if (!isAuthenticated()) {
            localStorage.setItem('pendingRFQSubmit', 'true');
            toast.info('Vui lòng đăng nhập để tiếp tục', {
                action: {
                    label: 'Đăng nhập',
                    onClick: () => router.push('/login'),
                },
                duration: 5000,
            });
            return;
        }

        try {
            if (type === 'DRAFT') setIsSavingDraft(true);
            else setIsSending(true);

            const rfqItems = items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
            }));

            const rfqId = await StoreRFQService.createRFQ(rfqItems);
            if (!rfqId) throw new Error('Không thể tạo yêu cầu báo giá');

            if (type === 'SEND') {
                await StoreRFQService.sendRFQ(rfqId);
                toast.success('Yêu cầu báo giá đã được gửi thành công!');
            } else {
                toast.success('Đã lưu bản thảo yêu cầu báo giá');
            }

            clearCart();
            setIsOpen(false);
            router.push('/transactions');
        } catch (error) {
            console.error(`Failed to ${type} RFQ:`, error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsSavingDraft(false);
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Panel mở rộng */}
            {isOpen && (
                <div className="w-80 bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="px-5 py-4 bg-gray-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ClipboardList size={16} />
                            <span className="text-[11px] font-bold uppercase tracking-widest">
                                Danh sách báo giá
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Items */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                        {items.map(item => (
                            <div key={item.productId} className="px-4 py-3 flex items-start gap-3 group hover:bg-gray-50/60 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight line-clamp-1">
                                        {item.productName}
                                    </p>
                                    <span className="text-[9px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-sm">
                                        {item.productCode}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                    >
                                        <Minus size={9} />
                                    </button>
                                    <span className="w-6 text-center text-[11px] font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                    >
                                        <Plus size={9} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeItem(item.productId)}
                                    className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 space-y-3">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400">
                            <span>Tổng sản phẩm</span>
                            <span className="font-bold text-gray-900">{totalItems} loại</span>
                        </div>

                        {isAuthenticated() ? (
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => handleAction('DRAFT')}
                                    disabled={isSavingDraft || isSending}
                                    className="w-full h-10 flex items-center justify-center gap-2 border border-gray-900 text-gray-900 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50"
                                >
                                    {isSavingDraft ? <Loader2 size={12} className="animate-spin" /> : <ClipboardList size={12} />}
                                    Lưu bản thảo
                                </button>
                                <button
                                    onClick={() => handleAction('SEND')}
                                    disabled={isSavingDraft || isSending}
                                    className="w-full h-11 flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-brand-green transition-all disabled:opacity-50 shadow-lg shadow-gray-200"
                                >
                                    {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                    Gửi yêu cầu ngay
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleAction('SEND')}
                                className="w-full h-11 flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-brand-green transition-all"
                            >
                                <Send size={14} />
                                Đăng nhập để gửi báo giá
                            </button>
                        )}

                        <button
                            onClick={clearCart}
                            className="w-full flex items-center justify-center gap-1.5 text-[9px] text-gray-400 hover:text-red-400 uppercase tracking-widest transition-colors pt-1"
                        >
                            <Trash2 size={10} />
                            Xóa tất cả
                        </button>
                    </div>
                </div>
            )}

            {/* FAB Button - Chỉ hiện khi Panel đóng */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        'relative flex items-center gap-3 px-5 h-14',
                        'bg-gray-900 text-white rounded-2xl shadow-2xl',
                        'transition-all duration-500 hover:-translate-y-1 hover:shadow-brand-green/30',
                        'hover:bg-brand-green group animate-in fade-in zoom-in duration-300'
                    )}
                >
                    <ClipboardList size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                        Báo giá
                    </span>
                    <ChevronUp size={14} className="text-gray-400 group-hover:text-white transition-colors" />

                    {/* Badge số lượng */}
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-green text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                        {totalItems}
                    </span>
                </button>
            )}
        </div>
    );
}
