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

export function CustomerCard({
  customer,
  actionNode,
}: CustomerCardProps) {
  return (
    <div className={cn(cardClass, "p-8 transition-all duration-300 hover:shadow-md")}>
      <div className="space-y-6">
        <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4">
          <User className="w-4 h-4 text-gray-400" />
          Thông tin khách hàng
        </div>

        <div className="space-y-4">
          <p className="breadcrumb-text uppercase !text-lg font-bold">
            {customer?.name || customer?.companyName || '---'}
          </p>

          <div className="pt-2 space-y-3 border-t border-gray-50 mt-4">
            <div className="flex items-center gap-3">
              <Scroll className="w-3.5 h-3.5 text-gray-300 shrink-0" />

              <span className="qty-label tracking-widest text-sm">
                {customer?.taxCode || 'Chưa cập nhật'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />

              <span className="qty-label tracking-widest text-sm">
                {customer?.phone || 'Chưa cập nhật'}
              </span>
            </div>

            {customer?.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />

                <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase text-xs line-clamp-1">
                  {customer.email}
                </span>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="w-3.5 h-3.5 text-gray-300 mt-1 shrink-0" />

              <span className="meta-label capitalize text-xs text-gray-600 line-clamp-2">
                {customer?.address || 'Chưa cập nhật địa chỉ'}
              </span>
            </div>
          </div>

          {actionNode && (
            <div className="mt-6 pt-5 border-t border-gray-200">
              {actionNode}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
