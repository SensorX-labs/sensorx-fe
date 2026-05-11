'use client';

import { useState, useMemo } from 'react';
import { ShoppingBag, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/shared/utils';

import { OrderStatus } from '../../enums/order-status';

interface Order {
    id: string;
    date: string;
    total: number;
    status: OrderStatus;
    items: number;
}

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OrderService } from '../../services/order-service';
import { Loader2 } from 'lucide-react';

interface OrdersTabProps {
    customerId?: string;
}

const statusConfig = {
    [OrderStatus.PendingPayment]: {
        label: 'Chờ thanh toán',
        className: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    [OrderStatus.Processing]: {
        label: 'Đang xử lý',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    [OrderStatus.Dispatched]: {
        label: 'Đã xuất kho',
        className: 'bg-green-50 text-green-700 border-green-200',
    },
    [OrderStatus.Cancelled]: {
        label: 'Đã hủy',
        className: 'bg-red-50 text-red-700 border-red-200',
    }
};

export function OrdersTab({ customerId }: OrdersTabProps) {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('ALL');

    const filters = [
        { id: 'ALL', label: 'Tất cả' },
        { id: OrderStatus.PendingPayment, label: 'Chờ thanh toán' },
        { id: OrderStatus.Processing, label: 'Đang xử lý' },
        { id: OrderStatus.Dispatched, label: 'Đã xuất kho' },
        { id: OrderStatus.Cancelled, label: 'Đã hủy' }
    ];

    const fetchOrders = useCallback(async () => {
        if (!customerId) return;
        try {
            setLoading(true);
            const response = await OrderService.getOrdersByCustomerId(customerId);
            if (response) setOrders(response);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = useMemo(() => {
        if (activeFilter === 'ALL') return orders;
        return orders.filter(o => o.status === activeFilter);
    }, [orders, activeFilter]);

    return (
        <div>
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo mã đơn hàng..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all btn-tracking uppercase"
                    />
                </div>
            </div>

            {/* Shopee-style filter tabs */}
            <div className="flex items-center border-b border-gray-100 mb-6 bg-white sticky top-0 z-10">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={cn(
                            "flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-all border-b-2 text-center",
                            activeFilter === filter.id
                                ? "border-[var(--brand-green)] text-[var(--brand-green)]"
                                : "border-transparent text-gray-500 hover:text-gray-900"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-24 text-center">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                        <p className="meta-label uppercase">Đang tải đơn hàng...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                        const config = statusConfig[order.status as OrderStatus] || { label: order.status, className: '' };
                        const totalAmount = order.orderItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice * 1.1), 0);

                        return (
                            <div 
                                key={order.id}
                                className="group border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-200 cursor-pointer shadow-sm"
                                onClick={() => router.push(`/transactions/orders/${order.id}`)}
                            >
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-4">
                                                <span className="tracking-title text-sm">{order.code}</span>
                                                <span className={cn(
                                                    "px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border",
                                                    config.className
                                                )}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <span className="meta-label uppercase text-gray-400">
                                                   Ngày tạo: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <p className="tracking-label uppercase text-gray-400 mb-0.5 !text-[10px]">Tổng cộng</p>
                                            <p className="qty-label !text-lg !text-gray-900">
                                                {(totalAmount).toLocaleString('vi-VN')} đ
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
