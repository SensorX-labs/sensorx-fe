'use client';

import React from 'react';
import {
  MapPin,
  ChevronLeft,
  Download,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MessageSquare,
  XCircle,
  Truck,
  Package,
  Building2,
  CalendarCheck
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { MOCK_QUOTES } from '@/features/sales/quotation/mocks/quote-mocks';
import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';

export function QuotationDetailView({ onBack, quotationId }: { onBack: () => void, quotationId?: string }) {
  // Tìm Báo giá từ mock dữ liệu
  const quote = MOCK_QUOTES.find(q => q.code === quotationId || q.id === quotationId) || MOCK_QUOTES[0];

  const statusConfig: any = {
    [QuoteStatus.PENDING]: { label: 'Đang chờ xử lý', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    [QuoteStatus.SENT]: { label: 'Đã gửi khách', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    [QuoteStatus.APPROVED]: { label: 'Đã duyệt', className: 'bg-green-50 text-green-700 border-green-200' },
    [QuoteStatus.ORDERED]: { label: 'Đã đặt hàng', className: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)] border-[var(--brand-green)]/20' },
    [QuoteStatus.EXPIRED]: { label: 'Hết hạn', className: 'bg-red-50 text-red-700 border-red-200' },
    [QuoteStatus.RETURNED]: { label: 'Bị từ chối', className: 'bg-gray-50 text-gray-700 border-gray-200' },
  };

  const config = statusConfig[quote.status] || statusConfig[QuoteStatus.SENT];

  return (
    <div className="space-y-10 pb-24">
      <div className="flex items-center justify-between border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 tracking-breadcrumb group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách báo giá
        </button>
        <div className="flex items-center gap-4">
          {quote.status === QuoteStatus.SENT && (
            <button className="flex items-center gap-2 px-8 py-2.5 border border-gray-900 tracking-label uppercase btn-tracking transition-all hover:bg-gray-900 hover:text-white !text-[10px]">
              <Truck className="w-4 h-4" />
              Chấp nhận & Tạo đơn hàng
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-10 border border-gray-100">
         <div className="flex justify-between items-start">
            <div className="space-y-4">
               <h1 className="tracking-title-xl">{quote.code}</h1>
               <div className="flex items-center gap-8">
                  <span className="tracking-label uppercase">Ngày báo giá: {new Date(quote.quoteDate).toLocaleDateString('vi-VN')}</span>
                  {quote.REQId && (
                    <span className="tracking-label uppercase">Từ yêu cầu: <span className="text-gray-900">{quote.REQId}</span></span>
                  )}
               </div>
            </div>
            <div className={cn("px-6 py-2 border-2 tracking-label uppercase font-bold text-[11px]", config.className)}>
               {config.label}
            </div>
         </div>
      </div>

      <div className="bg-white border border-gray-100">
        <div className="px-10 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-400" />
              <h3 className="tracking-title uppercase text-lg">Chi tiết danh mục thiết bị</h3>
            </div>
        </div>
        
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-100 uppercase">
              <th className="px-10 py-5 tracking-label border-r border-gray-50 w-[45%]">Sản phẩm</th>
              <th className="px-4 py-5 tracking-label border-r border-gray-50 text-center w-[10%]">ĐVT</th>
              <th className="px-4 py-5 tracking-label border-r border-gray-50 text-center w-[10%]">SL</th>
              <th className="px-8 py-5 tracking-label border-r border-gray-50 text-right w-[15%]">Đôn giá</th>
              <th className="px-10 py-5 tracking-label text-right w-[20%] bg-gray-50/30">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {(quote.items || []).map((item, idx) => (
              <tr key={item.id} className={cn("border-b border-gray-50 last:border-0", idx % 2 === 1 && "bg-gray-50/30")}>
                <td className="px-10 py-6">
                  <p className="breadcrumb-text uppercase mb-2 leading-snug">{item.productName}</p>
                  <div>
                     <span className="px-2 py-0.5 bg-gray-100 meta-label uppercase text-[9px] font-bold tracking-widest">{item.productCode}</span>
                  </div>
                </td>
                <td className="px-4 py-6 text-center meta-label uppercase">{item.unit}</td>
                <td className="px-4 py-6 text-center qty-label">{item.quantity}</td>
                <td className="px-8 py-6 text-right meta-label font-bold">
                  {(item.unitPrice || 0).toLocaleString('vi-VN')}
                </td>
                <td className="px-10 py-6 text-right qty-label bg-gray-50/20 text-base">
                  {((item.unitPrice || 0) * item.quantity).toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end p-10 border-t border-gray-100">
           <div className="w-96 space-y-5">
              <div className="flex justify-between meta-label uppercase">
                <span className="text-gray-400 font-bold">Tổng tiền (Chưa thuế):</span>
                <span className="qty-label">
                  {(quote.items || []).reduce((acc: number, item: any) => acc + (item.unitPrice * item.quantity), 0).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="flex justify-between meta-label uppercase">
                <span className="text-gray-400 font-bold">Thuế VAT (10%):</span>
                <span className="qty-label">
                  {((quote.items || []).reduce((acc: number, item: any) => acc + (item.unitPrice * item.quantity), 0) * 0.1).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="flex justify-between pt-6 border-t-2 border-gray-900 items-baseline">
                <span className="tracking-label uppercase text-sm">Tổng cộng:</span>
                <span className="tracking-title-xl text-3xl text-brand-green tracking-tighter">
                  {((quote.items || []).reduce((acc: number, item: any) => acc + (item.unitPrice * item.quantity), 0) * 1.1).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-10 border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <User className="w-4 h-4 text-gray-400" />
                  <h4 className="tracking-label uppercase">Người liên hệ trực tiếp</h4>
              </div>
              <div className="space-y-4 pt-2">
                  <div>
                      <p className="breadcrumb-text uppercase text-xl mb-1">{quote.customerInfo.recipientName}</p>
                      {quote.customerInfo.companyName && (
                          <p className="meta-label uppercase text-[#B48F4E]">
                              {quote.customerInfo.companyName}
                          </p>
                      )}
                  </div>
                  <div className="space-y-3 pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-300" />
                          <span className="qty-label tracking-widest text-sm">{quote.customerInfo.recipientPhone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-300" />
                          <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase">{quote.customerInfo.email}</span>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-white p-10 border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <h4 className="tracking-label uppercase">Địa điểm nhận báo giá</h4>
              </div>
              <div className="space-y-6 pt-2">
                  <p className="qty-label font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4 lowercase first-letter:uppercase">
                      {quote.customerInfo.address}
                  </p>
                  {quote.customerInfo.taxCode && (
                      <div className="mt-10 p-6 bg-gray-50/50 border border-gray-100">
                          <p className="meta-label uppercase mb-2">Mã số thuế doanh nghiệp:</p>
                          <p className="qty-label text-xl tracking-[0.15em]">{quote.customerInfo.taxCode}</p>
                      </div>
                  )}
              </div>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-8 items-stretch">
          {quote.note && (
             <div className="p-10 bg-gray-50 border border-gray-100 flex flex-col justify-center">
                <p className="tracking-label uppercase mb-4 text-gray-900">Ghi chú từ SensorX</p>
                <p className="qty-label text-sm leading-relaxed italic font-medium text-gray-600">
                    "{quote.note}"
                </p>
             </div>
          )}
          
          {quote.response ? (
            <div className="p-10 bg-white border border-gray-100 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <span className="meta-label uppercase">Phản hồi từ bạn</span>
                  <span className="px-4 py-1 tracking-label text-[10px] uppercase bg-blue-50 text-blue-800 border-2 border-blue-100 font-bold">{quote.response.responseType}</span>
                </div>
                <p className="meta-label text-[13px] italic leading-relaxed py-3 px-4 bg-gray-50 border-l-4 border-gray-200 font-normal">
                    "{quote.response.feedback}"
                </p>
                <div className="flex gap-8">
                    <div className="flex-1">
                        <p className="meta-label uppercase text-gray-400 mb-1">Thanh toán</p>
                        <p className="breadcrumb-text uppercase text-xs">{quote.response.paymentMethod}</p>
                    </div>
                    <div className="flex-1">
                        <p className="meta-label uppercase text-gray-400 mb-1">Điều khoản</p>
                        <p className="breadcrumb-text uppercase text-xs">{quote.response.paymentTerm || 'Tiêu chuẩn'}</p>
                    </div>
                </div>
            </div>
          ) : (
            <div className="p-10 bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-center">
                <p className="meta-label uppercase text-gray-400">Chưa có phản hồi từ khách hàng</p>
            </div>
          )}
      </div>
    </div>
  );
}