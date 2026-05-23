import React from 'react';
import { Headset, Phone, Mail, User } from 'lucide-react';

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
    <div className="p-8 bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md rounded-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-2 tracking-label uppercase border-b border-gray-50 pb-4">
          <Headset className="w-4 h-4 text-[#B48F4E]" />
          Nhân viên hỗ trợ
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {staff.avatarUrl ? (
              <img
                src={staff.avatarUrl}
                alt={staff.name}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <User className="w-8 h-8 text-gray-200" />
              </div>
            )}

            <div className="space-y-1">
              <p className="breadcrumb-text uppercase !text-lg font-bold">
                {staff.name}
              </p>
              <p className="meta-label uppercase text-[9px] font-bold text-[#B48F4E] tracking-[0.2em]">
                Technical Sales
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-3 border-t border-gray-50 mt-4">
            {staff.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />

                <span className="qty-label tracking-widest text-sm">
                  {staff.phone}
                </span>
              </div>
            )}

            {staff.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />

                <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase text-xs line-clamp-1">
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
