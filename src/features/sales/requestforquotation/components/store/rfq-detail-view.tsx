'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  MapPin,
  ChevronLeft,
  Download,
  Phone,
  Mail,
  User,
  Package,
  Loader2
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { RfqStatus } from '@/features/sales/requestforquotation/constants/rfq-status';
import RFQServices from '../../services/rfq-services';
import { RfqDetail } from '../../models/rfq-detail-response';
import CustomerService from '@/features/user/customer/services/customer-service';
import { Customer } from '@/features/user/customer/models/customer';

export function RfqDetailView({ onBack, rfqId }: { onBack: () => void, rfqId?: string }) {
  const [rfq, setRfq] = useState<RfqDetail | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!rfqId) return;
      try {
        setLoading(true);
        // 1. Lấy chi tiết RFQ
        const response = await RFQServices.getDetailRFQ(rfqId);
        if (response.isSuccess && response.value) {
          const rfqData = response.value;
          setRfq(rfqData);

          // 2. Lấy thông tin khách hàng theo customerId từ RFQ
          if (rfqData.customerId) {
            const customerResponse = await CustomerService.getCustomerById(rfqData.customerId);
            if (customerResponse.isSuccess && customerResponse.value) {
                setCustomer(customerResponse.value);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch detail data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [rfqId]);

  const statusConfig: any = {
    [RfqStatus.PENDING]: { label: 'Đang chờ xử lý', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    [RfqStatus.ACCEPTED]: { label: 'Đã tiếp nhận', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    [RfqStatus.CONVERTED]: { label: 'Đã báo giá', className: 'bg-green-50 text-green-700 border-green-200' },
    [RfqStatus.REJECTED]: { label: 'Từ chối', className: 'bg-red-50 text-red-700 border-red-200' },
    [RfqStatus.DRAFT]: { label: 'Bản nháp', className: 'bg-gray-50 text-gray-700 border-gray-200' },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-10 h-10 text-gray-300 animate-spin" />
        <p className="meta-label uppercase tracking-widest text-gray-400">Đang tải chi tiết yêu cầu...</p>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <FileText className="w-16 h-16 text-gray-100" />
        <p className="meta-label uppercase tracking-widest text-gray-400">Không tìm thấy thông tin yêu cầu này</p>
        <button onClick={onBack} className="btn-tracking border border-gray-900 px-8 py-3 uppercase text-[10px] font-bold">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const config = statusConfig[rfq.status] || { label: 'Yêu cầu báo giá', className: 'bg-gray-50 text-gray-700 border-gray-200' };

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
      </div>

      <div className="w-full space-y-10">
        <div className="bg-white border border-gray-100 shadow-sm">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="meta-label uppercase text-gray-400 mb-2">Chi tiết yêu cầu</p>
                <h2 className="tracking-title-xl">{rfq.code}</h2>
              </div>
              <div className={cn("px-5 py-2 border tracking-label text-[10px] uppercase font-bold", config.className)}>
                {config.label}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pb-10">
            <div className="px-8 py-6 bg-gray-50/30">
              <h3 className="tracking-title uppercase text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                Danh sách sản phẩm yêu cầu
              </h3>
            </div>
            
            <table className="w-full text-left border-collapse table-fixed border-t border-b border-gray-100">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 uppercase">
                  <th className="px-8 py-4 tracking-label border-r border-gray-100 w-[60%]">Thông tin sản phẩm</th>
                  <th className="px-8 py-4 tracking-label border-r border-gray-100 text-center w-[20%]">ĐVT</th>
                  <th className="px-8 py-4 tracking-label text-center w-[20%]">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {(rfq.items || []).map((item, idx) => (
                  <tr key={`${item.productCode}-${idx}`} className={cn("border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors", idx % 2 === 1 && "bg-gray-50/30")}>
                    <td className="px-8 py-5">
                      <p className="breadcrumb-text uppercase font-bold">{item.productName}</p>
                      <div className="mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 meta-label uppercase !text-[9px] font-bold tracking-widest">{item.productCode}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center meta-label uppercase">{item.unit}</td>
                    <td className="px-8 py-5 text-center qty-label font-bold text-lg">{item.quantity}</td>
                  </tr>
                ))}
                {(!rfq.items || rfq.items.length === 0) && (
                    <tr key="empty-row">
                        <td colSpan={3} className="px-8 py-12 text-center meta-label uppercase italic text-gray-300">Chưa có thông tin sản phẩm trong yêu cầu này</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="p-10 bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="space-y-6">
              <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4">
                <User className="w-4 h-4 text-gray-400" />
                Thông tin khách hàng
              </div>
              <div className="space-y-4">
                <p className="breadcrumb-text uppercase !text-xl font-bold">
                  {customer?.name || rfq.recipientName}
                </p>
                {rfq.companyName && (
                  <p className="meta-label uppercase text-[#B48F4E] font-bold">
                    {rfq.companyName}
                  </p>
                )}
                <div className="pt-2 space-y-3 border-t border-gray-50 mt-6">
                  <div className="flex items-center gap-3">
                    <Phone className="w-3.5 h-3.5 text-gray-300" />
                    <span className="qty-label tracking-widest">
                      {customer?.phoneNumber || rfq.recipientPhone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-3.5 h-3.5 text-gray-300" />
                    <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase">
                      {customer?.email || rfq.email}
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
                  {customer?.address || rfq.address}
                </p>
                {(customer?.taxCode || rfq.taxCode) && (
                  <div className="pt-10 border-t border-gray-50">
                    <div className="bg-gray-50 p-6 border border-gray-100">
                      <p className="meta-label uppercase mb-2 text-gray-400">Mã số thuế doanh nghiệp:</p>
                      <p className="qty-label tracking-[0.1em] !text-xl font-bold">
                        {customer?.taxCode || rfq.taxCode}
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
