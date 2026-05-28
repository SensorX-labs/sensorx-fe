'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

import { ChangePasswordForm } from '@/features/system/auth/components/common/change-password-form';

export const SecurityTab: React.FC = () => {
  return (
    <div className="min-h-[600px] overflow-hidden border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-10 py-5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">
          Mật khẩu và bảo mật
        </h3>
      </div>

      <div className="mx-auto max-w-md px-10 py-10">
        <ChangePasswordForm
          className="max-w-none"
          title="Đổi mật khẩu"
          description="Cập nhật mật khẩu tài khoản khách hàng"
          redirectTo={null}
        />

        <div className="mt-12 flex items-start gap-4 border border-gray-100 bg-gray-50 p-4">
          <ShieldCheck className="shrink-0 text-brand-green" size={18} />
          <div className="space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900">
              Bảo mật tài khoản
            </p>
            <p className="text-[9px] uppercase tracking-widest leading-relaxed text-gray-400">
              SensorX khuyến nghị sử dụng mật khẩu mạnh bao gồm chữ hoa, chữ thường và ký số.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
