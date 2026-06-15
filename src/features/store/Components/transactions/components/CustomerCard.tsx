import React from 'react';
import { User, Phone, Mail, MapPin, Scroll } from 'lucide-react';
import { cardClass } from '../Constants/ui.constant';
import { cn } from '@/shared/utils';

interface CustomerInfo {
  name?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
}

interface CustomerCardProps {
  customer: CustomerInfo | null;
  actionNode?: React.ReactNode;
}

export function CustomerCard({ customer, actionNode }: CustomerCardProps) {
  return (
    <div
      className={cn(
        cardClass,
        'overflow-hidden rounded-[22px] border-[#e6ebf1] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-8 transition-all duration-300 hover:shadow-md'
      )}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2 rounded-2xl border border-[#edf1f4] bg-[#f8fafc] px-4 py-3 tracking-label uppercase">
          <User className="w-4 h-4 text-gray-500" />
          Thông tin khách hàng
        </div>

        <div className="space-y-4">
          <p className="breadcrumb-text uppercase !text-lg font-bold">
            {customer?.name || customer?.companyName || '---'}
          </p>

          <div className="mt-4 space-y-3 rounded-2xl border border-[#edf1f4] bg-[#fbfcfd] p-4">
            <div className="flex items-center gap-3">
              <Scroll className="w-3.5 h-3.5 shrink-0 text-gray-300" />
              <span className="qty-label text-sm tracking-widest">
                {customer?.taxCode || 'Chưa cập nhật'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-3.5 h-3.5 shrink-0 text-gray-300" />
              <span className="qty-label text-sm tracking-widest">
                {customer?.phone || 'Chưa cập nhật'}
              </span>
            </div>

            {customer?.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 shrink-0 text-gray-300" />
                <span className="meta-label line-clamp-1 text-xs lowercase underline decoration-gray-100 underline-offset-4">
                  {customer.email}
                </span>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="mt-1 w-3.5 h-3.5 shrink-0 text-gray-300" />
              <span className="meta-label line-clamp-2 text-xs capitalize text-gray-600">
                {customer?.address || 'Chưa cập nhật địa chỉ'}
              </span>
            </div>
          </div>

          {actionNode && (
            <div className="mt-6 rounded-2xl border border-[#edf1f4] bg-[#f8fafc] p-4">
              {actionNode}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
