'use client';

import React, { useState, useEffect } from 'react';
import {
    MapPin,
    ChevronLeft,
    Phone,
    Mail,
    User,
    DollarSign,
    CheckCircle2,
    Package,
    Loader2,
    AlertCircle,
    FileText,
    Calendar,
    Clock
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Dialog, DialogContent } from '@/shared/components/shadcn-ui/dialog';
import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';
import { QuoteService } from '@/features/sales/quotation/services/quote.service';
import { CustomerInfoResponse, GetDetailQuoteByIdResponse } from '@/features/sales/quotation/models/quote-detail-response';
import { toast } from 'sonner';
import { cn } from '@/shared/utils';
import { CanAccess } from '@/shared/components/common/can-access';
import { StoreQuoteService, CustomerRespondToQuoteCommand, QuoteResponseStatus, PaymentTerm } from '../../services/store-quote.service';
const statusStyles: Record<string, string> = {
    [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-500 border-gray-200',
    [QuoteStatus.PENDING]: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    [QuoteStatus.APPROVED]: 'bg-green-50 text-green-600 border-green-100',
    [QuoteStatus.RETURNED]: 'bg-red-50 text-red-600 border-red-100',
    [QuoteStatus.SENT]: 'bg-blue-50 text-blue-600 border-blue-100',
    [QuoteStatus.ORDERED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    [QuoteStatus.EXPIRED]: 'bg-gray-50 text-gray-400 border-gray-200',
};

const statusLabels: Record<string, string> = {
    [QuoteStatus.DRAFT]: 'Nháp',
    [QuoteStatus.PENDING]: 'Chờ phản hồi',
    [QuoteStatus.APPROVED]: 'Đã chốt',
    [QuoteStatus.RETURNED]: 'Đã từ chối',
    [QuoteStatus.SENT]: 'Chờ phản hồi',
    [QuoteStatus.ORDERED]: 'Đã chốt',
    [QuoteStatus.EXPIRED]: 'Hết hạn',
};

export function QuotationDetailView({ onBack, quotationId }: {
    onBack: () => void,
    quotationId?: string
}) {
    const [quote, setQuote] = useState<GetDetailQuoteByIdResponse>();
    const [customer, setCustomer] = useState<CustomerInfoResponse>();
    const [loading, setLoading] = useState(true);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectSubmitting, setRejectSubmitting] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!quotationId) return;
            try {
                setLoading(true);
                const response = await QuoteService.getQuoteById(quotationId);
                if (response) {
                    setQuote(response);
                    setCustomer(response.customer);
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
        if (!quotationId || !quote) return;
        try {
            setLoading(true);
            const data: CustomerRespondToQuoteCommand = {
                responseType: QuoteResponseStatus.Accepted,
                paymentTerm: PaymentTerm.FullPayment,
                shippingAddress: quote.customer.address || '',
                recipientName: customer?.companyName || '',
                recipientPhone: customer?.phone || '',
                feedback: "Khách hàng đã chốt báo giá trực tuyến."
            };
            const response = await StoreQuoteService.customerResponse(quotationId, data);
            if (response) {
                if (quote) setQuote({ ...quote, status: QuoteStatus.ORDERED });
                toast.success('Bạn đã chốt báo giá thành công.');
            }
        } catch (error) {
            console.error("Error accepting quotation:", error);
            toast.error('Không thể chốt báo giá. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (reason: string) => {
        if (!quotationId) return;
        try {
            setRejectSubmitting(true);
            const response = await QuoteService.reject(quotationId, { reason });
            if (response) {
                setQuote(prev => prev ? { ...prev, status: QuoteStatus.RETURNED, reasonReject: reason } : prev);
                toast.success('Bạn đã từ chối báo giá.');
                setRejectModalOpen(false);
            }
        } catch (error) {
            console.error("Error rejecting quotation:", error);
            toast.error('Không thể từ chối báo giá. Vui lòng thử lại.');
        } finally {
            setRejectSubmitting(false);
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
            <div className="flex items-center justify-end gap-3">
                <CanAccess roles={['Customer']}>
                    {(quote.status === QuoteStatus.SENT || quote.status === QuoteStatus.APPROVED) && (
                        <>
                            <button
                                onClick={() => setRejectModalOpen(true)}
                                className="btn-tracking border border-red-500 text-red-500 px-8 py-3 uppercase text-[10px] font-bold hover:bg-red-50 transition-all"
                            >
                                Từ chối
                            </button>
                            <button
                                onClick={handleAccept}
                                className="btn-tracking bg-gray-900 text-white px-8 py-3 uppercase text-[10px] font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-xl"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Chốt báo giá ngay
                            </button>

                            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                                <DialogContent className="sm:max-w-md">
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Tại sao bạn từ chối báo giá này?</h3>
                                        <div className="space-y-3">
                                            {['Giá quá cao', 'Không hài lòng với sản phẩm/dịch vụ', 'Thời gian giao hàng quá lâu', 'Đã tìm được nhà cung cấp khác', 'Khác'].map((reason) => (
                                                <label key={reason} className="flex items-center gap-3 p-3 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer transition-all">
                                                    <input
                                                        type="radio"
                                                        name="rejectReason"
                                                        value={reason}
                                                        checked={rejectReason === reason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                        className="w-4 h-4 accent-gray-900"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">{reason}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {rejectReason === 'Khác' && (
                                            <textarea
                                                className="w-full mt-4 p-3 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-gray-900 outline-none"
                                                placeholder="Vui lòng nhập lý do khác..."
                                                rows={3}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                            />
                                        )}

                                        <div className="mt-6 flex gap-3">
                                            <Button variant="outline" className="flex-1 uppercase text-[10px] font-bold" onClick={() => setRejectModalOpen(false)}>Hủy</Button>
                                            <Button
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white uppercase text-[10px] font-bold"
                                                onClick={() => handleReject(rejectReason)}
                                                disabled={!rejectReason || rejectSubmitting}
                                            >
                                                {rejectSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </CanAccess>
            </div>

            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="meta-label uppercase text-gray-400 mb-2">Số báo giá</p>
                    <h1 className="tracking-title-xl">{quote.code}</h1>
                </div>
                <div className={cn("px-5 py-2 border tracking-label text-[10px] uppercase font-bold", statusStyle)}>
                    {statusLabel}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* CỘT TRÁI: NỘI DUNG BÁO GIÁ */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white border border-gray-100 shadow-sm">
                        <div className="p-8 pb-0">

                            <div className="grid grid-cols-3 gap-8 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Ngày báo giá</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {quote.quoteDate ? new Date(quote.quoteDate).toLocaleDateString('vi-VN') : '---'}
                                        </p>
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
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Hạng mục</p>
                                        <p className="text-sm font-bold text-gray-900">{quote.items.length} hạng mục</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="border-t border-gray-100 pb-10">
                            <div className="px-8 py-6 bg-gray-50/30">
                                <h3 className="tracking-title uppercase text-lg flex items-center gap-2 text-gray-900">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    Chi tiết hạng mục
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
                                                    <p className="breadcrumb-text uppercase font-bold text-gray-900">{item.productCode}</p>
                                                    <div className="mt-1">
                                                        <span className="meta-label uppercase !text-[9px] font-medium text-gray-400">Thiết bị tự động hóa</span>
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

                            <div className="mt-8 px-8 flex justify-end">
                                <div className="w-80 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">Tạm tính</span>
                                        <span className="font-bold text-gray-900">{quote.subtotal.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">Thuế VAT (10%)</span>
                                        <span className="font-bold text-gray-900">{quote.totalTax.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-blue-600 uppercase tracking-widest font-black text-xs">Tổng giá trị</span>
                                        <span className="text-xl font-black text-blue-600">{quote.grandTotal.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: THÔNG TIN CHUNG */}
                <div className="space-y-6 sticky top-28">
                    {/* Tiến trình xử lý (Mock) */}
                    <div className="p-8 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4 mb-6 text-gray-900">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Lịch sử báo giá
                        </div>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:bg-gray-100">
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-green-500 shadow-sm"></div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Hôm nay, 08:45</div>
                                <div className="text-xs font-bold text-gray-900 uppercase">Gửi báo giá hoàn tất</div>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-sm"></div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Hôm qua, 15:30</div>
                                <div className="text-xs font-bold text-gray-900 uppercase">Duyệt giá nội bộ</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4 text-gray-900">
                                <User className="w-4 h-4 text-gray-400" />
                                Thông tin khách hàng
                            </div>
                            <div className="space-y-4">
                                <p className="breadcrumb-text uppercase !text-lg font-bold text-gray-900">
                                    {customer?.companyName || '---'}
                                </p>
                                <div className="space-y-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-3.5 h-3.5 text-gray-300" />
                                        <span className="qty-label tracking-widest text-sm text-gray-600">
                                            {customer?.phone || '---'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-3.5 h-3.5 text-gray-300" />
                                        <span className="meta-label lowercase text-xs text-gray-600 line-clamp-2">
                                            {customer?.address || '---'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4 text-gray-900">
                                <User className="w-4 h-4 text-brand-green" />
                                Chuyên viên phụ trách
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                    <User className="w-6 h-6 text-gray-200" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold uppercase text-gray-900">{quote.sender.name}</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Technical Sales</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-50 flex gap-2">
                                <button className="flex-1 py-2 text-[10px] uppercase font-bold tracking-widest border border-gray-900 hover:bg-gray-900 hover:text-white transition-all">Gọi điện</button>
                                <button className="flex-1 py-2 text-[10px] uppercase font-bold tracking-widest border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-all">Nhắn tin</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
