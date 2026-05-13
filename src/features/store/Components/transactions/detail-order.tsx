'use client';

import React, { useEffect, useState } from 'react';
import {
    FileText,
    MapPin,
    ChevronLeft,
    Phone,
    Mail,
    User,
    Package,
    Loader2,
    Clock,
    Calendar,
    DollarSign,
    CreditCard,
    Truck
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { OrderStatus } from '@/features/sales/order/enums/order-status';
import { OrderService } from '@/features/sales/order/services/order-service';
import { Order } from '@/features/sales/order/models/order';

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
    [OrderStatus.PendingPayment]: { 
        label: 'Chờ thanh toán', 
        className: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: Clock
    },
    [OrderStatus.Processing]: { 
        label: 'Đang xử lý', 
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: Clock
    },
    [OrderStatus.Dispatched]: { 
        label: 'Đã xuất kho', 
        className: 'bg-green-50 text-green-700 border-green-200',
        icon: Truck
    },
    [OrderStatus.Cancelled]: { 
        label: 'Đã hủy', 
        className: 'bg-red-50 text-red-700 border-red-200',
        icon: Clock
    },
};

export function OrderDetailView({ onBack, orderId }: { onBack: () => void, orderId?: string }) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!orderId) return;
            try {
                setLoading(true);
                const response = await OrderService.getOrderById(orderId);
                if (response) {
                    setOrder(response);
                }
            } catch (error) {
                console.error("Failed to fetch order detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="w-10 h-10 text-gray-300 animate-spin" />
                <p className="meta-label uppercase tracking-widest text-gray-400">Đang tải chi tiết đơn hàng...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-6">
                <FileText className="w-16 h-16 text-gray-100" />
                <p className="meta-label uppercase tracking-widest text-gray-400">Không tìm thấy đơn hàng này</p>
                <button onClick={onBack} className="btn-tracking border border-gray-900 px-8 py-3 uppercase text-[10px] font-bold">
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    const config = statusConfig[order.status] || { label: 'Đơn hàng', className: 'bg-gray-50 text-gray-700 border-gray-200', icon: FileText };
    const subtotal = order.orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className="space-y-8 pb-20">

            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="meta-label uppercase text-gray-400 mb-2">Chi tiết đơn hàng</p>
                    <h1 className="tracking-title-xl">{order.code}</h1>
                </div>
                <div className={cn("px-5 py-2 border tracking-label text-[10px] uppercase font-bold flex items-center gap-2", config.className)}>
                    <config.icon className="w-3.5 h-3.5" />
                    {config.label}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white border border-gray-100 shadow-sm">
                        <div className="p-8 pb-0">

                            <div className="grid grid-cols-3 gap-8 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Ngày đặt hàng</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Thanh toán</p>
                                        <p className="text-sm font-bold text-gray-900">Chuyển khoản</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Tổng giá trị</p>
                                        <p className="text-sm font-bold text-gray-900">{total.toLocaleString('vi-VN')} đ</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pb-10">
                            <div className="px-8 py-6 bg-gray-50/30">
                                <h3 className="tracking-title uppercase text-lg flex items-center gap-2 text-gray-900">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    Sản phẩm trong đơn
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse border-t border-b border-gray-100">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100 uppercase">
                                            <th className="px-8 py-4 tracking-label border-r border-gray-100 w-[40%]">Sản phẩm</th>
                                            <th className="px-6 py-4 tracking-label border-r border-gray-100 text-center w-[10%]">ĐVT</th>
                                            <th className="px-6 py-4 tracking-label border-r border-gray-100 text-center w-[10%]">SL</th>
                                            <th className="px-6 py-4 tracking-label border-r border-gray-100 text-right w-[15%]">Đơn giá</th>
                                            <th className="px-8 py-4 tracking-label text-right w-[25%]">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderItems.map((item, idx) => (
                                            <tr key={item.id} className={cn("border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors", idx % 2 === 1 && "bg-gray-50/30")}>
                                                <td className="px-8 py-5">
                                                    <p className="breadcrumb-text uppercase font-bold text-gray-900">{item.productCode}</p>
                                                    <div className="mt-1">
                                                        <span className="meta-label uppercase !text-[9px] font-medium text-gray-400">{item.manufacturer}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center meta-label uppercase">{item.unit}</td>
                                                <td className="px-6 py-5 text-center qty-label font-bold">{item.quantity}</td>
                                                <td className="px-6 py-5 text-right font-medium text-gray-600">{item.unitPrice.toLocaleString('vi-VN')}</td>
                                                <td className="px-8 py-5 text-right font-bold text-gray-900">{(item.quantity * item.unitPrice).toLocaleString('vi-VN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 px-8 flex justify-end">
                                <div className="w-80 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">Tạm tính</span>
                                        <span className="font-bold text-gray-900">{subtotal.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">Thuế VAT (10%)</span>
                                        <span className="font-bold text-gray-900">{tax.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-[var(--brand-green)] uppercase tracking-widest font-black text-xs">Tổng thanh toán</span>
                                        <span className="text-xl font-black text-[var(--brand-green)]">{total.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: THÔNG TIN CHUNG */}
                <div className="space-y-6 sticky top-28">
                    {/* Trạng thái đơn hàng (Timeline) */}
                    <div className="p-8 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4 mb-6 text-gray-900">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Tiến trình đơn hàng
                        </div>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:bg-gray-100">
                            {order.status === OrderStatus.Dispatched && (
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-green-500 shadow-sm"></div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">27/03/2024, 09:15</div>
                                    <div className="text-xs font-bold text-gray-900 uppercase">Đã xuất kho</div>
                                </div>
                            )}
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-sm"></div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">25/03/2024, 10:00</div>
                                <div className="text-xs font-bold text-gray-900 uppercase">Đã xác nhận đơn hàng</div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin Giao hàng */}
                    <div className="p-8 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4 text-gray-900">
                                <Truck className="w-4 h-4 text-gray-400" />
                                Địa chỉ giao hàng
                            </div>
                            <div className="space-y-4">
                                <p className="breadcrumb-text uppercase !text-lg font-bold text-gray-900">
                                    {order.recipientName}
                                </p>
                                <div className="space-y-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-3.5 h-3.5 text-gray-300" />
                                        <span className="qty-label tracking-widest text-sm text-gray-600">
                                            {order.recipientPhone}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-3.5 h-3.5 text-gray-300" />
                                        <span className="meta-label lowercase text-xs text-gray-600 line-clamp-2">
                                            {order.address}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nhân viên hỗ trợ */}
                    <div className="p-8 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4 text-gray-900">
                                <User className="w-4 h-4 text-brand-green" />
                                Chuyên viên xử lý
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                    <User className="w-6 h-6 text-gray-200" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold uppercase text-gray-900">{order.senderName}</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Order Fulfillment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
