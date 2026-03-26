'use client';

import React from 'react';
import Link from 'next/link';

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'completed' | 'pending' | 'cancelled';
    items: number;
}

interface OrdersTabProps {
    orders: Order[];
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Hoàn thành';
            case 'pending':
                return 'Đang xử lý';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="tracking-title-lg">Đơn hàng của tôi</h2>

            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white border border-gray-200 rounded-none p-6 hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex flex-row items-center justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold tracking-wider text-gray-900 mb-1">
                                        Đơn hàng: {order.id}
                                    </p>
                                    <p className="meta-label text-gray-600 mb-3">
                                        Ngày: {new Date(order.date).toLocaleDateString('vi-VN')}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-none ${getStatusBadge(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusLabel(order.status)}
                                        </span>
                                        <span className="meta-label text-gray-600">
                                            {order.items} sản phẩm
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold tracking-wider text-gray-900 mb-3">
                                        {order.total.toLocaleString('vi-VN')} ₫
                                    </p>
                                    <button className="px-4 py-2 border-0 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300" style={{ backgroundColor: 'var(--brand-green)' }}>
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 border border-gray-200 bg-gray-50">
                    <p className="tracking-label text-gray-600 mb-4">
                        Bạn chưa có đơn hàng nào
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block px-8 py-2 text-white text-xs font-semibold uppercase tracking-wider rounded-none transition-all duration-300"
                        style={{ backgroundColor: 'var(--brand-green)' }}
                    >
                        Bắt đầu mua sắm
                    </Link>
                </div>
            )}
        </div>
    );
};
