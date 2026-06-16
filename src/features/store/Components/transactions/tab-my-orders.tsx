'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingBag, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/shared/utils';
import { OrderStatus } from '@/features/sales/order/enums/order-status';
import { useRouter } from 'next/navigation';
import { StoreOrderService, StoreMyOrderItem } from '../../services/store-order.service';
import { ListSkeleton } from '@/shared/components/common/loading';

const statusConfig = {
    [OrderStatus.PendingPayment]: {
        label: 'Chờ thanh toán',
        className: 'bg-amber-100/80 text-amber-700 border-amber-200/50',
    },
    [OrderStatus.Processing]: {
        label: 'Đang xử lý',
        className: 'bg-sky-100/80 text-sky-700 border-sky-200/50',
    },
    [OrderStatus.Dispatched]: {
        label: 'Đã xuất kho',
        className: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50',
    },
    [OrderStatus.Cancelled]: {
        label: 'Đã hủy',
        className: 'bg-rose-100/80 text-rose-700 border-rose-200/50',
    }
};

export function OrdersTab() {
    const router = useRouter();
    const [orders, setOrders] = useState<StoreMyOrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [hasNext, setHasNext] = useState(false);

    const paginationRef = useRef({
        lastId: undefined as string | undefined,
        lastValue: undefined as string | undefined,
        pageSize: 10
    });

    const filters = [
        { id: 'ALL', label: 'Tất cả' },
        { id: OrderStatus.PendingPayment, label: 'Chờ thanh toán' },
        { id: OrderStatus.Processing, label: 'Đang xử lý' },
        { id: OrderStatus.Dispatched, label: 'Đã xuất kho' },
        { id: OrderStatus.Cancelled, label: 'Đã hủy' }
    ];

    const fetchOrders = useCallback(async (isLoadMore = false, status?: string, search?: string) => {
        try {
            setLoading(true);
            const response = await StoreOrderService.getMyOrders({
                pageSize: paginationRef.current.pageSize,
                status: status === 'ALL' ? undefined : status,
                searchTerm: search || undefined,
                lastId: isLoadMore ? paginationRef.current.lastId : undefined,
                lastValue: isLoadMore ? paginationRef.current.lastValue : undefined,
                isDescending: true
            });

            if (response) {
                setOrders(prev => isLoadMore ? [...prev, ...response.items] : response.items);
                paginationRef.current.lastId = response.lastId;
                paginationRef.current.lastValue = response.lastValue;
                setHasNext(response.hasNext);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            paginationRef.current.lastId = undefined;
            paginationRef.current.lastValue = undefined;
            fetchOrders(false, activeFilter, searchTerm);
        }, searchTerm ? 400 : 0);
        return () => clearTimeout(timer);
    }, [activeFilter, searchTerm, fetchOrders]);

    return (
        <div className="font-sans select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:flex-1 sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-stone-250 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-950 outline-none text-xs font-semibold transition-all uppercase focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] shadow-sm text-stone-900"
                    />
                </div>
            </div>

            <div className="flex items-center border-b border-stone-200 dark:border-zinc-800 mb-6 bg-white dark:bg-zinc-950 sticky top-0 z-10 overflow-x-auto hide-scrollbar">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={cn(
                            "min-w-max flex-1 py-4 px-4 text-[10px] font-extrabold tracking-widest uppercase transition-all border-b-2 text-center cursor-pointer",
                            activeFilter === filter.id
                                ? "border-[#0D9488] text-[#0D9488] dark:text-emerald-400"
                                : "border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-white"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading && orders.length === 0 ? (
                    <ListSkeleton count={4} />
                ) : orders.length > 0 ? (
                    <>
                        {orders.map((order, idx) => {
                            const config = statusConfig[order.status as OrderStatus] || { label: order.status, className: '' };
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
                                <div
                                    key={order.id}
                                    className="glass-card group border border-stone-200 dark:border-stone-850 bg-[#F9F9FB] dark:bg-stone-900/60 backdrop-blur-md hover:bg-gray-150/20 dark:hover:bg-zinc-800/20 hover:-translate-y-0.5 transition-all duration-350 cursor-pointer shadow-sm overflow-hidden relative pl-2"
                                    onClick={() => router.push(`/transactions/orders/${order.id}`)}
                                >
                                    {/* Left accent bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${bgAccent}`} />

                                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                                    <span className="font-heading font-bold text-sm tracking-wide text-gray-900 dark:text-white">{order.code}</span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border rounded",
                                                        config.className
                                                    )}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-gray-400">
                                                        Ngày tạo: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12">
                                            <div className="text-left sm:text-right">
                                                <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-gray-400 mb-0.5">Tổng cộng</p>
                                                <p className="text-lg font-bold text-primary dark:text-secondary">
                                                    {(order.totalAmount || 0).toLocaleString('vi-VN')} đ
                                                </p>
                                            </div>
                                            <button className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gray-900 dark:text-white group/btn hover:text-primary dark:hover:text-secondary transition-colors">
                                                <span>Chi tiết</span>
                                                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {loading && <ListSkeleton count={1} />}

                         {hasNext && !loading && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={() => fetchOrders(true, activeFilter, searchTerm)}
                                    className="px-10 py-3.5 bg-[#0D9488] hover:bg-[#0F766E] text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Tải thêm đơn hàng cũ
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-24 text-center bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                        <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-zinc-700 mx-auto mb-4" />
                        <p className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">Không tìm thấy đơn hàng nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
