'use client';

import React from 'react';
import { User } from 'lucide-react';

interface CustomerInfoCardProps {
  customerInfo?: any;
}

export function CustomerInfoCard({ customerInfo }: CustomerInfoCardProps) {
  const companyName = customerInfo?.companyName || '—';
  const phone = customerInfo?.recipientPhone || customerInfo?.phone || '—';
  const email = customerInfo?.email || '—';
  const address = customerInfo?.shippingAddress || customerInfo?.address || '—';

  return (
    <div className="border border-gray-200 bg-white rounded">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
        <User size={16} className="text-gray-400" />
        <h4 className="text-sm font-medium text-gray-900">Thông tin khách hàng</h4>
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Công ty</td>
            <td className="px-6 py-3 font-medium text-gray-900">{companyName}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Số điện thoại</td>
            <td className="px-6 py-3 font-medium text-gray-900">{phone}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
            <td className="px-6 py-3 font-medium text-gray-900">{email}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ</td>
            <td className="px-6 py-3 font-medium text-gray-600 text-xs italic">{address}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
