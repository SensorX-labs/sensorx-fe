'use client';

import React, { useEffect, useState } from 'react';
import {
    MapPin,
    ChevronLeft,
    Phone,
    Mail,
    User,
    Package,
    Loader2,
    FileText,
    Calendar,
    DollarSign,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';
import { QuoteService } from '../../services/quote-service';
import { CanAccess } from '@/shared/components/common/can-access';
import CustomerService from '@/features/user/customer/services/customer-service';
import { QuoteDetail } from '../../models/quote-detail-response';
import { Customer } from '@/features/user/customer/models/customer';

const statusStyles: Record<string, string> = {
    [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-500 border-gray-200',
    [QuoteStatus.PENDING]: 'bg-blue-50 text-blue-600 border-blue-100',
    [QuoteStatus.APPROVED]: 'bg-green-50 text-green-600 border-green-100',
    [QuoteStatus.RETURNED]: 'bg-red-50 text-red-600 border-red-100',
    [QuoteStatus.SENT]: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    [QuoteStatus.ORDERED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    [QuoteStatus.EXPIRED]: 'bg-gray-50 text-gray-400 border-gray-200',
};

const statusLabels: Record<string, string> = {
    [QuoteStatus.DRAFT]: 'Nháp',
    [QuoteStatus.PENDING]: 'Chờ duyệt',
    [QuoteStatus.APPROVED]: 'Đã phê duyệt',
    [QuoteStatus.RETURNED]: 'Từ chối',
    [QuoteStatus.SENT]: 'Đã gửi khách',
    [QuoteStatus.ORDERED]: 'Đã sinh đơn',
    [QuoteStatus.EXPIRED]: 'Hết hạn',
};

export function QuotationDetailView({ onBack, quotationId }: {
    onBack: () => void,
    quotationId?: string
}) {
    const [quote, setQuote] = useState<QuoteDetail | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!quotationId) return;
            try {
                setLoading(true);
                // 1. Lấy chi tiết báo giá
                const response = await QuoteService.getQuoteById(quotationId);
                if (response.isSuccess && response.value) {
                    const quoteData = response.value;
                    setQuote(quoteData);

                    // 2. Lấy thông tin khách hàng
                    if (quoteData.customerId) {
                        const customerRes = await CustomerService.getCustomerById(quoteData.customerId);
                        if (customerRes.isSuccess && customerRes.value) {
                            setCustomer(customerRes.value);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching quotation detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [quotationId]);

    const handleAccept = async () => {
        if (!quotationId) return;
        try {
            setLoading(true);
            const response = await QuoteService.accept(quotationId);
            if (response.isSuccess) {
                // Cập nhật local state
                if (quote) setQuote({ ...quote, status: QuoteStatus.ORDERED });
            }
        } catch (error) {
            console.error("Error accepting quotation:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="w-10 h-10 text-gray-300 animate-spin" />
                <p className="meta-label uppercase tracking-widest text-gray-400">Đang tải chi tiết báo giá...</p>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-6">
                <FileText className="w-16 h-16 text-gray-100" />
                <p className="meta-label uppercase tracking-widest text-gray-400">Không tìm thấy báo giá này</p>
                <button onClick={onBack} className="btn-tracking border border-gray-900 px-8 py-3 uppercase text-[10px] font-bold">
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    const statusStyle = statusStyles[quote.status] || 'bg-gray-100 text-gray-700 border-gray-200';
    const statusLabel = statusLabels[quote.status] || quote.status;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 tracking-breadcrumb group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Quay lại danh sách
                </button>

                {/* Nút Chốt báo giá cho khách hàng */}
                <CanAccess roles={['Customer']}>
                    {(quote.status === QuoteStatus.SENT || quote.status === QuoteStatus.APPROVED) && (
                        <button 
                            onClick={handleAccept}
                            className="btn-tracking bg-gray-900 text-white px-8 py-3 uppercase text-[10px] font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Chốt báo giá
                        </button>
                    )}
                </CanAccess>
            </div>

            <div className="w-full space-y-10">
                {/* Header Info */}
                <div className="bg-white border border-gray-100 shadow-sm">
                    <div className="p-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="meta-label uppercase text-gray-400 mb-2">Số báo giá</p>
                                <h2 className="tracking-title-xl">{quote.code}</h2>
                            </div>
                            <div className={cn("px-5 py-2 border tracking-label text-[10px] uppercase font-bold", statusStyle)}>
                                {statusLabel}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8 mt-10 pt-8 border-t border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Ngày báo giá</p>
                                    <p className="text-sm font-bold text-gray-900">{new Date(quote.quoteDate).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Tổng giá trị</p>
                                    <p className="text-sm font-bold">{quote.grandTotal.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Số lượng dòng</p>
                                    <p className="text-sm font-bold text-gray-900">{quote.items.length} hạng mục</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="border-t border-gray-100 pb-10">
                        <div className="px-8 py-6 bg-gray-50/30">
                            <h3 className="tracking-title uppercase text-lg flex items-center gap-2">
                                <Package className="w-5 h-5 text-gray-400" />
                                Nội dung báo giá chi tiết
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
                                    {quote.items.map((item, idx) => (
                                        <tr key={item.id} className={cn("border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors", idx % 2 === 1 && "bg-gray-50/30")}>
                                            <td className="px-8 py-5">
                                                <p className="breadcrumb-text uppercase font-bold text-gray-900">Sản phẩm #{idx + 1}</p>
                                                <div className="mt-1">
                                                    <span className="px-2 py-0.5 bg-gray-100 meta-label uppercase !text-[9px] font-bold tracking-widest">{item.productCode}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center meta-label uppercase">{item.unit}</td>
                                            <td className="px-6 py-5 text-center qty-label font-bold">{item.quantity}</td>
                                            <td className="px-6 py-5 text-right font-medium text-gray-600">{item.unitPrice.toLocaleString('vi-VN')}</td>
                                            <td className="px-8 py-5 text-right font-bold text-gray-900">{item.totalLineAmount.toLocaleString('vi-VN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-8 px-8 flex justify-end">
                            <div className="w-80 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">Tạm tính</span>
                                    <span className="font-bold text-gray-900">{quote.subtotal.toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">Thuế VAT</span>
                                    <span className="font-bold text-gray-900">{quote.totalTax.toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-blue-600 uppercase tracking-widest font-black text-xs">Tổng cộng</span>
                                    <span className="text-xl font-black text-blue-600">{quote.grandTotal.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Info Section */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="p-10 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4">
                                <User className="w-4 h-4 text-gray-400" />
                                Thông tin khách hàng
                            </div>
                            <div className="space-y-4">
                                <p className="breadcrumb-text uppercase !text-xl font-bold">
                                    {customer?.name || quote.recipientName}
                                </p>
                                {(quote.companyName) && (
                                    <p className="meta-label uppercase text-[#B48F4E] font-bold">
                                        {quote.companyName}
                                    </p>
                                )}
                                <div className="pt-2 space-y-3 border-t border-gray-50 mt-6">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-3.5 h-3.5 text-gray-300" />
                                        <span className="qty-label tracking-widest">
                                            {customer?.phoneNumber || quote.recipientPhone}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-3.5 h-3.5 text-gray-300" />
                                        <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase">
                                            {customer?.email || quote.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                Địa chỉ và Mã số thuế
                            </div>
                            <div className="space-y-4">
                                <p className="qty-label font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4 lowercase first-letter:uppercase text-gray-600">
                                    {customer?.address || quote.address}
                                </p>
                                {quote.taxCode && (
                                    <div className="pt-10 border-t border-gray-50">
                                        <div className="bg-gray-50 p-6 border border-gray-100">
                                            <p className="meta-label uppercase mb-2 text-gray-400">Mã số thuế:</p>
                                            <p className="qty-label tracking-[0.1em] !text-xl font-bold">
                                                {quote.taxCode}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
