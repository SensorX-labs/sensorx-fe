'use client';

import React from 'react';
import {
  ArrowLeft, Check, X, FileText, User, Building2,
  Mail, Phone, MapPin, Calendar, ShoppingCart,
  AlertCircle, ClipboardList, MessageSquare
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { MOCK_QUOTES } from '../../mocks/quote-mocks';
import { QuoteStatus } from '../../constants/quote-status';
import Link from 'next/link';

interface QuotationDetailProps {
  id: string;
  onBack: () => void;
}

const statusColor: Record<string, string> = {
  [QuoteStatus.DRAFT]:     'bg-gray-50 text-gray-500 border-gray-200',
  [QuoteStatus.PENDING]:   'bg-blue-50 text-blue-700 border-blue-200',
  [QuoteStatus.RETURNED]:  'bg-red-50 text-red-700 border-red-200',
  [QuoteStatus.APPROVED]:  'bg-green-50 text-green-700 border-green-200',
  [QuoteStatus.SENT]:      'bg-indigo-50 text-indigo-700 border-indigo-200',
  [QuoteStatus.ORDERED]:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  [QuoteStatus.EXPIRED]:   'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const statusLabel: Record<string, string> = {
  [QuoteStatus.DRAFT]:     'Nháp',
  [QuoteStatus.PENDING]:   'Chờ duyệt',
  [QuoteStatus.RETURNED]:  'Bị từ chối',
  [QuoteStatus.APPROVED]:  'Đã duyệt',
  [QuoteStatus.SENT]:      'Đã gửi',
  [QuoteStatus.ORDERED]:   'Đã sinh đơn',
  [QuoteStatus.EXPIRED]:   'Hết hạn',
};

export default function QuotationDetail({ id, onBack }: QuotationDetailProps) {
  const quote = MOCK_QUOTES.find(q => q.id === id);

  if (!quote) return <div className="p-6 text-gray-600">Không tìm thấy báo giá</div>;

  return (
    <div className="space-y-6 w-full">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 border border-gray-200 bg-white hover:bg-gray-100 rounded text-gray-600 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold admin-title uppercase">
              Chi tiết báo giá
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {quote.status === QuoteStatus.PENDING && (
            <>
              <Button variant="outline" className="rounded admin-btn-primary border-transparent">
                <Check className="w-4 h-4 mr-2" />
                Duyệt
              </Button>
              <Button variant="outline" className="rounded text-red-600 hover:bg-red-50 border-red-200">
                <X className="w-4 h-4 mr-2" />
                Từ chối
              </Button>
            </>
          )}
          {quote.status === QuoteStatus.APPROVED && (
            <Button variant="outline" className="rounded admin-btn-primary border-transparent">
              <FileText className="w-4 h-4 mr-2" />
              Gửi khách hàng
            </Button>
          )}
          <Link href="/sales/quotations">
            <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-1 space-y-6">

          {/* Thông tin chung */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Thông tin chung</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã báo giá</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{quote.code}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-0.5 rounded border text-xs font-medium ${statusColor[quote.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {statusLabel[quote.status] || quote.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Ngày tạo</td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {new Date(quote.quoteDate).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Thông tin khách hàng */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Thông tin khách hàng</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Công ty</td>
                  <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                    {quote.customerInfo.companyName}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Người liên hệ</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{quote.customerInfo.recipientName}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Mã số thuế</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{quote.customerInfo.taxCode}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Điện thoại</td>
                  <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                    {quote.customerInfo.recipientPhone}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                  <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                    {quote.customerInfo.email}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ</td>
                  <td className="px-6 py-3 font-medium text-gray-900 flex items-start gap-2">
                    {quote.customerInfo.address}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">

          {/* Danh sách hàng hóa */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-gray-400" />
              <h4 className="text-base font-medium text-gray-900">Danh mục hàng hóa báo giá</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium text-left w-12">STT</th>
                    <th className="px-6 py-3 font-medium text-left">Sản phẩm</th>
                    <th className="px-6 py-3 font-medium text-center w-28">Số lượng</th>
                    <th className="px-6 py-3 font-medium text-right w-32">Đơn giá</th>
                    <th className="px-6 py-3 font-medium text-right w-28">Thuế</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quote.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-3 text-gray-400 text-xs">{index + 1}</td>
                      <td className="px-6 py-3">
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-xs text-gray-400 mt-0.5">Mã: {item.productCode}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className="text-sm text-gray-900 font-medium">
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="text-sm text-gray-900 font-medium">
                          {item.unitPrice.toLocaleString('vi-VN')}đ
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="text-sm text-gray-900 font-medium">
                          {item.taxRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <h4 className="text-base font-medium text-gray-900">Ghi chú</h4>
            </div>
            <div className="p-6">
              {quote.note ? (
                <p className="text-sm text-gray-700 leading-relaxed">{quote.note}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">Không có ghi chú.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}