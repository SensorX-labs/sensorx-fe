'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  Loader2,
  Send,
} from 'lucide-react';

import { cn } from '@/shared/utils';
import {
  StoreRFQService,
  MyRfqDetail,
  MyRfqDetailCustomer,
} from '../../services/store-rfq.service';

import { RfqStatus } from '../../constants/rfq-status';

export function RfqDetailView({
  onBack,
  rfqId,
}: {
  onBack: () => void;
  rfqId?: string;
}) {
  const [rfq, setRfq] = useState<MyRfqDetail | null>(null);
  const [customer, setCustomer] =
    useState<MyRfqDetailCustomer | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const fetchDetail = async () => {
    if (!rfqId) return;

    try {
      setLoading(true);

      const rfqData =
        await StoreRFQService.getMyRFQDetail(rfqId);

      if (rfqData) {
        setRfq(rfqData);

        if (rfqData.customer) {
          setCustomer(rfqData.customer);
        }
      }
    } catch (error) {
      console.error('Failed to fetch detail data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [rfqId]);

  const handleSendRFQ = async () => {
    if (!rfqId) return;

    try {
      setIsSending(true);

      const success =
        await StoreRFQService.sendRFQ(rfqId);

      if (success) {
        localStorage.removeItem('activeRFQId');
        onBack();
      }
    } catch (error) {
      console.error('Failed to send RFQ:', error);
    } finally {
      setIsSending(false);
    }
  };

  const statusConfig: any = {
    [RfqStatus.Draft]: {
      label: 'Bản nháp',
      className:
        'bg-gray-50 text-gray-700 border-gray-200',
    },

    [RfqStatus.Pending]: {
      label: 'Đang chờ xử lý',
      className:
        'bg-yellow-50 text-yellow-700 border-yellow-200',
    },

    [RfqStatus.Accepted]: {
      label: 'Đã tiếp nhận',
      className:
        'bg-blue-50 text-blue-700 border-blue-200',
    },

    [RfqStatus.Responded]: {
      label: 'Đã phản hồi',
      className:
        'bg-green-50 text-green-700 border-green-200',
    },

    [RfqStatus.Converted]: {
      label: 'Đã chuyển đổi',
      className:
        'bg-green-50 text-green-700 border-green-200',
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-10 h-10 text-gray-300 animate-spin" />

        <p className="meta-label uppercase tracking-widest text-gray-400">
          Đang tải chi tiết yêu cầu...
        </p>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <FileText className="w-16 h-16 text-gray-100" />

        <p className="meta-label uppercase tracking-widest text-gray-400">
          Không tìm thấy thông tin yêu cầu này
        </p>

        <button
          onClick={onBack}
          className="btn-tracking border border-gray-900 px-8 py-3 uppercase text-[10px] font-bold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const config = statusConfig[rfq.status] || {
    label: 'Yêu cầu báo giá',
    className:
      'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="meta-label uppercase text-gray-400 mb-2">
            Chi tiết yêu cầu
          </p>

          <h1 className="tracking-title-xl">
            {rfq.code}
          </h1>
        </div>

        <div
          className={cn(
            'px-5 py-2 border tracking-label text-[10px] uppercase font-bold',
            config.className
          )}
        >
          {config.label}
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 bg-gray-50/30 border-b border-gray-100">
              <h3 className="tracking-title uppercase text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                Danh sách sản phẩm yêu cầu
              </h3>
            </div>

            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 uppercase">
                  <th className="px-8 py-4 tracking-label border-r border-gray-100 w-[60%]">
                    Thông tin sản phẩm
                  </th>

                  <th className="px-8 py-4 tracking-label border-r border-gray-100 text-center w-[20%]">
                    ĐVT
                  </th>

                  <th className="px-8 py-4 tracking-label text-center w-[20%]">
                    Số lượng
                  </th>
                </tr>
              </thead>

              <tbody>
                {(rfq.items || []).map((item, idx) => (
                  <tr
                    key={`${item.productCode}-${idx}`}
                    className={cn(
                      'border-b border-gray-50 last:border-0 transition-colors duration-200 hover:bg-gray-50/60',
                      idx % 2 === 1 && 'bg-gray-50/30'
                    )}
                  >
                    <td className="px-8 py-5">
                      <p className="breadcrumb-text uppercase font-bold">
                        {item.productName}
                      </p>

                      <div className="mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 meta-label uppercase !text-[9px] font-bold tracking-widest">
                          {item.productCode}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-center meta-label uppercase">
                      {item.unit}
                    </td>

                    <td className="px-8 py-5 text-center qty-label font-bold text-lg">
                      {item.quantity}
                    </td>
                  </tr>
                ))}

                {(!rfq.items ||
                  rfq.items.length === 0) && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-8 py-12 text-center meta-label uppercase italic text-gray-300"
                      >
                        Chưa có thông tin sản phẩm
                        trong yêu cầu này
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="space-y-6 sticky top-28">
          {/* THÔNG TIN KHÁCH HÀNG */}
          <div className="p-8 bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md rounded-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4">
                <User className="w-4 h-4 text-gray-400" />
                Thông tin khách hàng
              </div>

              <div className="space-y-4">
                <p className="breadcrumb-text uppercase !text-lg font-bold">
                  {customer?.name || rfq.recipientName}
                </p>

                {rfq.companyName && (
                  <p className="meta-label uppercase text-[#B48F4E] font-bold">
                    {rfq.companyName}
                  </p>
                )}

                <div className="pt-2 space-y-3 border-t border-gray-50 mt-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />

                    <span className="qty-label tracking-widest text-sm">
                      {customer?.phone || rfq.recipientPhone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />

                    <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase text-xs line-clamp-1">
                      {customer?.email || rfq.email}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-3.5 h-3.5 text-gray-300 mt-1 shrink-0" />

                    <span className="meta-label capitalize text-xs text-gray-600 line-clamp-2">
                      {customer?.address ||
                        rfq.address ||
                        'Chưa cập nhật địa chỉ'}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                {rfq.status === RfqStatus.Draft && (
                  <button
                    onClick={handleSendRFQ}
                    disabled={isSending}
                    className={cn(
                      'w-full h-12 mt-6',
                      'rounded-xl',

                      'bg-gray-900',
                      'text-white',

                      'border border-gray-900',

                      'flex items-center justify-center gap-3',

                      'transition-all duration-300 ease-out',

                      'hover:-translate-y-0.5',
                      'hover:shadow-lg',

                      // KHÔNG đổi sang background variable nữa
                      'hover:bg-gray-800',

                      // khóa màu chữ/icon
                      'hover:text-white',

                      // giữ border ổn định
                      'hover:border-gray-800',

                      'disabled:opacity-60',
                      'disabled:cursor-not-allowed',

                      'group'
                    )}
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white pt-0.5">
                          Gửi yêu cầu báo giá
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}