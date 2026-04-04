'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Clock, CheckCircle2, XCircle, ChevronRight, Search, Package } from 'lucide-react';
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
        icon: Clock,
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    completed: {
        label: 'Hoàn thành',
        icon: CheckCircle2,
        className: 'bg-green-50 text-green-700 border-green-200',
    },
    cancelled: {
        label: 'Đã hủy',
        icon: XCircle,
        className: 'bg-red-50 text-red-700 border-red-200',
    }
};

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onViewDetail }) => {
    return (
        <div className="duration-500">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Đơn hàng của tôi</h2>
                    <p className="text-sm text-gray-500">Lịch sử và trạng thái mua hàng của bạn</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo mã đơn hàng..."
                        className="pl-10 pr-4 py-2 border border-gray-200 focus:border-[var(--brand-green)] outline-none text-sm transition-all w-72"
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
                                className="group border border-gray-100 bg-white hover:border-gray-300 transition-all duration-300 overflow-hidden cursor-pointer"
                                onClick={() => onViewDetail?.(order.id)}
                            >
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 flex items-center justify-center rounded-none border shrink-0 transition-transform group-hover:scale-110",
                                            config.className
                                        )}>
                                            <ShoppingBag className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-900 tracking-tight">{order.id}</span>
                                                <span className={cn(
                                                    "px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest border",
                                                    config.className
                                                )}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-8 text-xs text-gray-500">
                                                <span className="flex items-center gap-1.5 min-w-[120px]">
                                                   <Clock className="w-3.5 h-3.5" />
                                                   {new Date(order.date).toLocaleDateString('vi-VN')}
                                                </span>
                                                <span className="flex items-center gap-1.5 min-w-[120px]">
                                                   <Package className="w-3.5 h-3.5" />
                                                   {order.items} sản phẩm
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Tổng thanh toán</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                                            </p>
                                        </div>
                                        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-[var(--brand-green)] transition-colors group/btn">
                                            Chi tiết
                                            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-none bg-gray-50/50">
                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Bạn chưa có đơn hàng nào</p>
                        <Link href="/shop" className="mt-4 inline-block text-sm font-bold text-[var(--brand-green)] hover:underline uppercase tracking-widest">
                            Bắt đầu mua sắm
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-center">
                <button className="px-8 py-3 border border-gray-900 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300">
                    Xem thêm đơn hàng cũ
                </button>
            </div>
        </div>
    );
};
