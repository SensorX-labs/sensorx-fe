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

    // Gộp chung LUỒNG ĐỔI FILTER và TÌM KIẾM để tránh gọi API 2 lần
    useEffect(() => {
        setOrders([]);
        const timer = setTimeout(() => {
            paginationRef.current.lastId = undefined;
            paginationRef.current.lastValue = undefined;
            fetchOrders(false, activeFilter, searchTerm);
        }, searchTerm ? 400 : 0);
        return () => clearTimeout(timer);
    }, [activeFilter, searchTerm, fetchOrders]);

    return (
        <div>
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all uppercase"
                    />
                </div>
            </div>

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
                {loading && orders.length === 0 ? (
                    <ListSkeleton count={4} />
                ) : orders.length > 0 ? (
                    <>
                        {orders.map((order) => {
                            const config = statusConfig[order.status as OrderStatus] || { label: order.status, className: '' };

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
                                                        Ngày tạo: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12">
                                            <div className="text-right">
                                                <p className="tracking-label uppercase text-gray-400 mb-0.5 !text-[10px]">Tổng cộng</p>
                                                <p className="qty-label !text-lg !text-gray-900 font-bold">
                                                    {(order.totalAmount || 0).toLocaleString('vi-VN')} đ
                                                </p>
                                            </div>
                                            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900 group/btn">
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
                                    className="px-10 py-3 border border-gray-900 text-[10px] font-bold uppercase hover:bg-gray-900 hover:text-white transition-all duration-300"
                                >
                                    Tải thêm đơn hàng cũ
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-24 text-center bg-white border border-dashed border-gray-100">
                        <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <p className="meta-label uppercase">Không tìm thấy đơn hàng nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
