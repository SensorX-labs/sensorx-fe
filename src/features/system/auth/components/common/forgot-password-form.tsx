'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { forgotPasswordSchema, ForgotPasswordFormValues } from '../../schemas/forgot-password-schema';
import { AuthService } from '../../services/auth-service';

const authService = new AuthService();

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await authService.forgotPassword(data);
    reset();
  };

  return (
    <div className="w-full font-sans">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 mb-4 bg-[#0D9488]/10 px-3 py-1 rounded-full border border-[#0D9488]/20">
          <KeyRound size={12} className="text-[#0D9488] dark:text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488] dark:text-emerald-400">Khôi phục mật khẩu</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tight leading-tight mb-2">
          Quên Mật Khẩu
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 tracking-wide font-medium">Nhập email đã đăng ký để nhận thông tin mật khẩu mới</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Email */}
        <div className="group">
          <label className={`block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-2 group-focus-within:text-[#0D9488] transition-colors ${errors.email ? 'text-red-500' : ''}`}>
            Email khôi phục
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0D9488] transition-colors">
              <Mail size={16} />
            </div>
            <input
              type="email"
              {...register('email')}
              placeholder="name@company.com"
              className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-950 border rounded-2xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-450 focus:outline-none transition-all duration-300 shadow-sm ${
                errors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-stone-250 dark:border-stone-800 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-[11px] font-bold text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-black uppercase tracking-[0.2em] py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi mật khẩu mới'}
          </button>
        </div>
      </form>

      {/* Switch Link */}
      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#0D9488] hover:text-[#0F766E] dark:text-emerald-400 font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} /> Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}