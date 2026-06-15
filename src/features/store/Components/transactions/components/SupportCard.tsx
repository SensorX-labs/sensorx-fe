import React from 'react';
import { Headset, Phone, Mail, User } from 'lucide-react';
import { cardClass } from '../Constants/ui.constant';
import { cn } from '@/shared/utils';

interface StaffInfo {
  name: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}

interface SupportCardProps {
  staff: StaffInfo;
}

export function SupportCard({ staff }: SupportCardProps) {
  return (
    <div
      className={cn(
        cardClass,
        'overflow-hidden rounded-[22px] border-[#e6ebf1] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-8 transition-all duration-300 hover:shadow-md'
      )}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2 rounded-2xl border border-[#f0e6d2] bg-[#fbf7ef] px-4 py-3 tracking-label uppercase">
          <Headset className="w-4 h-4 text-[#B48F4E]" />
          Nhân viên hỗ trợ
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {staff.avatarUrl ? (
              <img
                src={staff.avatarUrl}
                alt={staff.name}
                className="h-16 w-16 rounded-xl border border-gray-100 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                <User className="h-8 w-8 text-gray-200" />
              </div>
            )}

            <div className="space-y-1">
              <p className="breadcrumb-text uppercase !text-lg font-bold">
                {staff.name}
              </p>
              <p className="meta-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#B48F4E]">
                Technical Sales
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-2xl border border-[#edf1f4] bg-[#fbfcfd] p-4">
            {staff.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                <span className="qty-label text-sm tracking-widest">
                  {staff.phone}
                </span>
              </div>
            )}

            {staff.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                <span className="meta-label line-clamp-1 text-xs lowercase underline decoration-gray-100 underline-offset-4">
                  {staff.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
