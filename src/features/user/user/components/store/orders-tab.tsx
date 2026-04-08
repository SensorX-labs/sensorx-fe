'use client';

import { ShoppingBag, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/shared/utils';

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'completed' | 'pending' | 'cancelled';
    items: number;
}

interface OrdersTabProps {
    orders: Order[];
    onViewDetail?: (id: string) => void;
}

const statusConfig = {
    pending: {
        label: 'Đang xử lý',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    completed: {
        label: 'Hoàn thành',
        className: 'bg-green-50 text-green-700 border-green-200',
    },
    cancelled: {
        label: 'Đã hủy',
        className: 'bg-red-50 text-red-700 border-red-200',
    }
};

export function OrdersTab({ orders, onViewDetail }: OrdersTabProps) {
    return (
        <div>
            <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="tracking-title-lg">Đơn hàng của tôi</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo mã đơn hàng..."
                        className="pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all w-80 btn-tracking uppercase"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {orders.length > 0 ? (
                    orders.map((order) => {
                        const config = statusConfig[order.status];

                        return (
                            <div 
                                key={order.id}
                                className="group border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-200 cursor-pointer shadow-sm"
                                onClick={() => onViewDetail?.(order.id)}
                            >
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-4">
                                                <span className="tracking-title text-sm">{order.id}</span>
                                                <span className={cn(
                                                    "px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border",
                                                    config.className
                                                )}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <span className="meta-label uppercase text-gray-400">
                                                   Ngày tạo: {new Date(order.date).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <p className="tracking-label uppercase text-gray-400 mb-0.5 !text-[10px]">Tổng cộng</p>
                                            <p className="qty-label !text-lg !text-gray-900">
                                                {(order.total).toLocaleString('vi-VN')} VNĐ
                                            </p>
                                        </div>
                                        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900 group/btn btn-tracking">
                                            <span>Chi tiết</span>
                                            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-24 text-center bg-white border border-dashed border-gray-100">
                        <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <p className="meta-label uppercase">Bạn chưa có đơn hàng nào.</p>
                    </div>
                )}
            </div>

            <div className="mt-12 flex justify-center">
                <button className="px-10 py-3 border border-gray-900 text-[10px] font-bold uppercase btn-tracking hover:bg-gray-900 hover:text-white transition-all duration-300">
                    Tải thêm đơn hàng cũ
                </button>
            </div>
        </div>
    );
}
