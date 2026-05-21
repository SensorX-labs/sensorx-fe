'use client';

import { User } from 'lucide-react';
import { SenderInfoResponse } from '../../../models/quote-detail-response';

interface SenderInfoCardProps {
  senderInfo?: SenderInfoResponse;
}

export function SenderInfoCard({ senderInfo }: SenderInfoCardProps) {
  if (!senderInfo) return null;

  const name = senderInfo.name || '—';
  const email = senderInfo.email || '—';
  const phone = senderInfo.phone || '—';

  return (
    <div className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
        <User className="w-4 h-4 text-gray-500" />
        <h4 className="text-sm font-semibold text-gray-900">Người lập báo giá</h4>
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Họ tên</td>
            <td className="px-6 py-3 font-medium text-gray-900">{name}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
            <td className="px-6 py-3 font-medium text-gray-900">{email}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Số điện thoại</td>
            <td className="px-6 py-3 font-medium text-gray-900">{phone}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
