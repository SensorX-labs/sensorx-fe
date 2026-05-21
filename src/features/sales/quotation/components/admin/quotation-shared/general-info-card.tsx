'use client';

import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ClipboardList } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { statusColor, statusLabel } from './constants';
import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';

interface GeneralInfoCardProps {
  code: string;
  status: QuoteStatus;
  createAt: Date;
  quoteDate?: Date;
}

export function GeneralInfoCard({
  code,
  status,
  createAt,
  quoteDate
}: GeneralInfoCardProps) {
  return (
    <div className="border border-gray-200 bg-white rounded">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
        <ClipboardList className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-medium text-gray-900">Thông tin chung</h4>
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã báo giá</td>
            <td className="px-6 py-3 font-medium text-gray-900">{code || '—'}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Trạng thái</td>
            <td className="px-6 py-3">
              <span className={cn("px-2.5 py-0.5 rounded border text-xs font-medium", statusColor[status] || 'bg-gray-100 text-gray-600 border-gray-200')}>
                {statusLabel[status] || status}
              </span>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Ngày tạo</td>
            <td className="px-6 py-3 font-medium text-gray-900">
              {createAt ? format(createAt, "dd/MM/yyyy", { locale: vi }) : '—'}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 admin-text-primary font-semibold">Ngày báo giá</td>
            <td className="px-6 py-3 font-medium text-gray-900">
              {quoteDate ? format(quoteDate, "dd/MM/yyyy", { locale: vi }) : '—'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
