'use client';

import { Phone, MapPin, User, DollarSign, MessageSquare } from 'lucide-react';
import { QuoteCustomerResponse } from '../../../models/quote-detail-response';

interface CustomerResponseCardProps {
  customerFeedback?: QuoteCustomerResponse;
}

export function CustomerResponseCard({ customerFeedback }: CustomerResponseCardProps) {
  // Chỉ hiển thị nếu có dữ liệu phản hồi
  if (!customerFeedback) return null;

  const recipientName = customerFeedback.recipientName || '—';
  const recipientPhone = customerFeedback.recipientPhone || '—';
  const shippingAddress = customerFeedback.shippingAddress || '—';
  const paymentTerm = customerFeedback.paymentTerm || '—';
  const feedback = customerFeedback.feedback || '—';

  return (
    <div className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-gray-500" />
        <h4 className="text-sm font-semibold text-gray-900">Phản hồi từ khách hàng</h4>
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Người nhận</td>
            <td className="px-6 py-3 font-medium text-gray-900">{recipientName}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Số điện thoại</td>
            <td className="px-6 py-3 font-medium text-gray-900">{recipientPhone}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ giao hàng</td>
            <td className="px-6 py-3 font-medium text-gray-600 text-xs italic">{shippingAddress}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Hạn mức thanh toán</td>
            <td className="px-6 py-3 font-medium text-gray-900">{paymentTerm}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Ghi chú phản hồi</td>
            <td className="px-6 py-3 font-medium text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">{feedback}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
