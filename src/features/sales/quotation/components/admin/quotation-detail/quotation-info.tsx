import React from 'react';
import Link from 'next/link';
import { Link2, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import {
  CustomerInfoCard,
  CustomerResponseCard,
  SenderInfoCard
} from '../quotation-shared';
import { GetDetailQuoteByIdResponse } from '../../../models/quote-detail-response';

interface QuotationInfoProps {
  quoteDetail: GetDetailQuoteByIdResponse;
}

export function QuotationInfo({ quoteDetail }: QuotationInfoProps) {
  return (
    <div className="md:col-span-1 space-y-6">
      {/* Thông tin chung */}
      <div className="border border-gray-200 bg-white rounded shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-gray-400" />
          <h4 className="text-sm font-medium uppercase tracking-wider">Thông tin báo giá</h4>
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã báo giá</td>
              <td className="px-6 py-3 font-bold">{quoteDetail.code || '—'}</td>
            </tr>
            <tr>
              <td className="px-6 py-3 admin-text-primary font-semibold">Trạng thái</td>
              <td className="px-6 py-3">
                <span className={cn("px-2.5 py-0.5 rounded border text-xs font-medium", "bg-gray-100 text-gray-600 border-gray-200")}>
                  {quoteDetail.status}
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 admin-text-primary font-semibold">Ngày báo giá</td>
              <td className="px-6 py-3">
                {quoteDetail.quoteDate ? new Date(quoteDetail.quoteDate).toLocaleDateString('vi-VN') : '—'}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 admin-text-primary font-semibold">Từ RFQ</td>
              <td className="px-6 py-3">
                {quoteDetail.rfqId ? (
                  <Link href={`/sales/rfqs/${quoteDetail.rfqId}`} className="text-blue-600 hover:underline">
                    {quoteDetail.rfqId}
                  </Link>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lý do từ chối (nếu có) */}
      {quoteDetail.reasonReject && (
        <div className="border border-red-200 bg-red-50 rounded shadow-sm p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-red-600">Lý do từ chối</div>
            <div className="text-sm text-red-700 mt-1 whitespace-pre-wrap">{quoteDetail.reasonReject}</div>
          </div>
        </div>
      )}

      <CustomerInfoCard customerInfo={quoteDetail.customer} />

      {/* Card feedback khách chỉ hiển thị nếu có phản hồi */}
      {quoteDetail.customerFeedback && (quoteDetail.customerFeedback.responseType || quoteDetail.customerFeedback.feedback) && (
        <CustomerResponseCard customerFeedback={quoteDetail.customerFeedback} />
      )}

      {quoteDetail.sender && <SenderInfoCard senderInfo={quoteDetail.sender} />}
    </div>
  );
}
