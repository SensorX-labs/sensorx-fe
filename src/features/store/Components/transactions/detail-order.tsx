'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    FileText,
    MapPin,
    Phone,
    Mail,
    User,
    Package,
    Loader2,
    Clock,
    Calendar,
    DollarSign,
    CreditCard,
    Truck,
    Download,
    QrCode,
    X
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { OrderStatus } from '@/features/sales/order/enums/order-status';
import { OrderService } from '@/features/sales/order/services/order-service';
import { Order } from '@/features/sales/order/models/order';
import { usePaymentHub } from '@/shared/hooks/usePaymentHub';
import { toast } from 'sonner';
import { Button } from '@/shared/components/shadcn-ui/button';
import { PaymentQrModal } from './payment-qr-modal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/components/shadcn-ui/alert-dialog';

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
const paymentStatusConfig: Record<string, { label: string; className: string; color: string }> = {
    'Pending': {
        label: 'Chờ thanh toán',
        className: 'bg-orange-50 text-orange-700 border-orange-200',
        color: 'orange'
    },
    'PartiallyPaid': {
        label: 'Chờ thanh toán',
        className: 'bg-orange-50 text-orange-700 border-orange-200',
        color: 'orange'
    },
    'Completed': {
        label: 'Thanh toán hoàn tất',
        className: 'bg-green-50 text-green-700 border-green-200',
        color: 'green'
    },
    'Failed': {
        label: 'Thanh toán thất bại',
        className: 'bg-red-50 text-red-700 border-red-200',
        color: 'red'
    },
    'Cancelled': {
        label: 'Thanh toán bị hủy',
        className: 'bg-gray-50 text-gray-700 border-gray-200',
        color: 'gray'
    }
};

export function OrderDetailView({ onBack, orderId }: { onBack: () => void, orderId?: string }) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const paymentHub = usePaymentHub();
    const lastHandledUpdateRef = useRef<number | null>(null);
    const subscribedOrderIdRef = useRef<string | null>(null);

    const handleCancelOrder = async () => {
        if (!orderId) return;
        try {
            setIsCancelling(true);
            await OrderService.cancelOrder(orderId);
            toast.success('Đơn hàng đã được hủy thành công.');
            // Reload order to reflect cancelled state
            const updated = await OrderService.getMyOrderById(orderId);
            if (updated) setOrder(updated);
        } catch {
            toast.error('Không thể hủy đơn hàng. Vui lòng thử lại.');
        } finally {
            setIsCancelling(false);
        }
    };

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

    // Subscribe to payment updates via SignalR
    useEffect(() => {
        if (!orderId || loading || !order) return;
        if (subscribedOrderIdRef.current === orderId) return;
        subscribedOrderIdRef.current = orderId;

        const subscribeToPaymentUpdates = async () => {
            try {
                await paymentHub.subscribeToOrder(orderId);
            } catch (error) {
                console.error('Failed to subscribe to payment updates:', error);
            }
        };

        subscribeToPaymentUpdates();

        return () => {
            // Unsubscribe when component unmounts
            subscribedOrderIdRef.current = null;
            paymentHub.unsubscribeFromOrder(orderId).catch(console.error);
        };
    }, [orderId, loading, order, paymentHub.subscribeToOrder, paymentHub.unsubscribeFromOrder]);

    // Listen for payment status changes
    useEffect(() => {
        if (!orderId || !paymentHub.lastUpdate) return;

        // If payment status changed for this order, reload the order data
        if (paymentHub.lastUpdate.orderId === orderId && lastHandledUpdateRef.current !== paymentHub.lastUpdate.timestamp) {
            lastHandledUpdateRef.current = paymentHub.lastUpdate.timestamp;

            const isSuccessfulPayment = paymentHub.lastUpdate.paymentStatus === 'Completed';
            if (isSuccessfulPayment) {
                toast.success('Thanh toán thành công. Đơn hàng đã được cập nhật.');
                setIsPaymentModalOpen(false);
            }

            const reloadOrderData = async () => {
                try {
                    setRefreshing(true);
                    const response = await OrderService.getOrderById(orderId);
                    if (response) {
                        setOrder(response);
                    }
                } catch (error) {
                    console.error('Failed to reload order data:', error);
                } finally {
                    setRefreshing(false);
                }
            };

            reloadOrderData();
        }
    }, [orderId, paymentHub.lastUpdate]);

    const paymentQrConfig = useMemo(() => {
        const paymentStatus = (order?.paymentStatus || '').trim();
        const normalizedStatus = paymentStatus.toLowerCase();
        const paymentQrUrls = order?.paymentQRURls ?? [];
        const grandTotal = order?.grandTotal ?? 0;
        const orderCode = order?.code ?? '';

        if (!paymentStatus || paymentQrUrls.length === 0) {
            return {
                qrUrl: undefined as string | undefined,
                qrLabel: 'Chưa có mã QR',
                canPay: false,
                isPending: false,
                isPartiallyPaid: false,
            };
        }

        const isPending = normalizedStatus === 'pending';
        const isPartiallyPaid = normalizedStatus === 'partiallypaid';

        let qrUrl = paymentQrUrls[0];
        if (qrUrl) {
            try {
                const url = new URL(qrUrl);
                url.searchParams.set('amount', Math.round(grandTotal).toString());

                let des = url.searchParams.get('des') || orderCode;
                if (des.endsWith('-P1') || des.endsWith('-P2')) {
                    des = des.substring(0, des.length - 3);
                }
                url.searchParams.set('des', des);
                qrUrl = url.toString();
            } catch (e) {
                console.error("Failed to parse or reconstruct QR URL", e);
            }
        }

        return {
            qrUrl: qrUrl,
            qrLabel: 'Thanh toán toàn bộ (100%)',
            canPay: isPending || isPartiallyPaid,
            isPending,
            isPartiallyPaid,
        };
    }, [order?.paymentStatus, order?.paymentQRURls, order?.grandTotal, order?.code]);

    const paymentAmount = order?.grandTotal || 0;
    const paidAmount = order?.paymentAmount || 0;
    const remainingAmount = Math.max(paymentAmount - paidAmount, 0);
    const isFullyPaid = !!order && (order.paymentStatus === 'Completed' || paidAmount >= paymentAmount);

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
    const subtotal = order.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className="space-y-8 pb-20">

            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="meta-label uppercase text-gray-400 mb-2">Chi tiết đơn hàng</p>
                    <h1 className="tracking-title-xl">{order.code}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-8 py-2.5 border border-gray-900 tracking-label uppercase btn-tracking transition-all hover:bg-gray-900 hover:text-white !text-[10px] font-bold">
                        <Download className="w-4 h-4" />
                        Tải hóa đơn (PDF)
                    </button>

                    {order.status === OrderStatus.PendingPayment && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    disabled={isCancelling}
                                    className="flex items-center gap-2 px-8 py-2.5 border border-red-300 text-red-600 tracking-label uppercase btn-tracking transition-all hover:bg-red-600 hover:text-white hover:border-red-600 !text-[10px] font-bold disabled:opacity-50"
                                >
                                    {isCancelling
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <X className="w-4 h-4" />
                                    }
                                    Hủy đơn hàng
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Xác nhận hủy đơn hàng?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Hành động này không thể hoàn tác. Đơn hàng <strong>{order.code}</strong>, hóa đơn và thanh toán liên quan sẽ bị hủy vĩnh viễn.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Quay lại</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleCancelOrder}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Xác nhận hủy
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    <div className={cn("px-5 py-2 border tracking-label text-[10px] uppercase font-bold flex items-center gap-2", config.className)}>
                        <config.icon className="w-3.5 h-3.5" />
                        {config.label}
                    </div>
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
                                        {order.items.map((item, idx) => (
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
                    {/* Thông tin thanh toán */}
                    {order.paymentStatus && (
                        <div className="p-8 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4 mb-6 text-gray-900">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                Thông tin thanh toán
                            </div>

                            <div className="space-y-6">
                                {/* Payment Status Badge */}
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-2">Trạng thái</p>
                                    <div className={cn(
                                        "px-4 py-2 border tracking-label text-[10px] uppercase font-bold text-center",
                                        paymentStatusConfig[order.paymentStatus]?.className || 'bg-gray-50 text-gray-700 border-gray-200'
                                    )}>
                                        {paymentStatusConfig[order.paymentStatus]?.label || order.paymentStatus}
                                    </div>
                                </div>

                                {/* Payment Amount */}
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Số tiền cần thanh toán</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {paymentAmount.toLocaleString('vi-VN')} đ
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Đã thanh toán</p>
                                    <p className="text-lg font-bold text-emerald-700">
                                        {paidAmount.toLocaleString('vi-VN')} đ
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Còn lại</p>
                                    <p className="text-lg font-bold text-orange-600">
                                        {remainingAmount.toLocaleString('vi-VN')} đ
                                    </p>
                                </div>

                                {/* QR Payment Action */}
                                {order.paymentStatus && order.paymentStatus !== 'Completed' && order.paymentStatus !== 'Failed' && order.paymentStatus !== 'Cancelled' && (
                                    <div className="space-y-3">
                                        <Button
                                            type="button"
                                            onClick={() => setIsPaymentModalOpen(true)}
                                            disabled={!paymentQrConfig.canPay}
                                            className="w-full mt-2 bg-brand-green hover:bg-brand-green-hover shadow-lg shadow-brand-green/20 text-white uppercase tracking-widest text-[10px] font-bold disabled:bg-gray-200 disabled:text-gray-500"
                                        >
                                            <QrCode className="w-4 h-4 mr-2" />
                                            Thanh toán
                                        </Button>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider text-center">
                                            {paymentQrConfig.qrLabel}
                                        </p>
                                    </div>
                                )}

                                {!paymentQrConfig.canPay && order.paymentStatus !== 'Completed' && order.paymentStatus !== 'Failed' && order.paymentStatus !== 'Cancelled' && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                                        <p className="text-sm font-bold text-yellow-700 text-center">
                                            Chưa có mã QR thanh toán phù hợp.
                                        </p>
                                    </div>
                                )}

                                {/* Completion Message */}
                                {order.paymentStatus === 'Completed' && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                                        <p className="text-sm font-bold text-green-700 text-center">
                                            ✓ Thanh toán thành công. Cảm ơn bạn đã mua hàng!
                                        </p>
                                    </div>
                                )}

                                {/* Error Message */}
                                {['Failed', 'Cancelled'].includes(order.paymentStatus) && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded">
                                        <p className="text-sm font-bold text-red-700 text-center">
                                            ✗ Thanh toán không thành công. Vui lòng liên hệ hỗ trợ.
                                        </p>
                                    </div>
                                )}

                                {/* Refresh Indicator */}
                                {refreshing && (
                                    <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                        <p className="text-[10px] uppercase text-blue-700 font-bold">Đang cập nhật...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
                                <div>
                                    <p className="breadcrumb-text uppercase !text-lg font-bold text-gray-900">
                                        {order.recipientName}
                                    </p>
                                    {order.companyName && (
                                        <p className="meta-label uppercase text-[#B48F4E] mt-0.5">{order.companyName}</p>
                                    )}
                                </div>
                                <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-3.5 h-3.5 text-gray-300" />
                                        <span className="qty-label tracking-widest text-sm text-gray-600">
                                            {order.recipientPhone}
                                        </span>
                                    </div>
                                    {(order.email || order.customerEmail) && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-3.5 h-3.5 text-gray-300" />
                                            <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase text-xs text-gray-600">
                                                {order.email || order.customerEmail}
                                            </span>
                                        </div>
                                    )}
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

            <PaymentQrModal
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
                orderCode={order.code}
                paymentStatus={order.paymentStatus || 'Pending'}
                paymentAmount={paymentAmount}
                qrUrl={paymentQrConfig.qrUrl}
                qrLabel={paymentQrConfig.qrLabel}
            />
        </div>
    );
}
