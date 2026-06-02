'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

import { ChangePasswordForm } from '@/features/system/auth/components/common/change-password-form';

export const SecurityTab: React.FC = () => {
  return (
    <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-md rounded-2xl overflow-hidden font-sans border-l-4 border-l-[#0D9488] select-none min-h-[600px]">
      <div className="border-b border-stone-200 dark:border-zinc-800/80 px-10 py-6 bg-stone-100/40">
        <h3 className="text-sm font-heading font-extrabold uppercase tracking-wider text-stone-900 dark:text-white">
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

        <div className="bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm mt-12 flex items-start gap-4">
          <ShieldCheck className="shrink-0 text-[#0D9488]" size={18} />
          <div className="space-y-1">
            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-900 dark:text-white">
              Bảo mật tài khoản
            </p>
            <p className="text-[9px] uppercase tracking-widest leading-relaxed text-stone-400 dark:text-zinc-550">
              SensorX khuyến nghị sử dụng mật khẩu mạnh bao gồm chữ hoa, chữ thường và ký số.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
