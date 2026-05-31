'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, KeyRound, Lock, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { cn } from '@/shared/utils/cn';
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from '@/features/system/auth/schemas/change-password-schema';
import { AuthService } from '@/features/system/auth/services/auth-service';

const authService = new AuthService();

interface ChangePasswordFormProps {
  className?: string;
  title?: string;
  description?: string;
  redirectTo?: string | null;
  submitLabel?: string;
  submittingLabel?: string;
  onSuccess?: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  className,
  title = 'Đổi mật khẩu',
  description = 'Vui lòng nhập thông tin mật khẩu mới',
  redirectTo = '/profile',
  submitLabel = 'Đổi mật khẩu',
  submittingLabel = 'Đang thay đổi...',
  onSuccess,
}) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      toast.success('Mật khẩu đã được thay đổi thành công.');
      onSuccess?.();
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch {
      // Error toast is handled by axios interceptor.
    }
  };

  return (
    <div className={cn('w-full max-w-md', className)}>
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-4 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <KeyRound size={12} className="text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Thay đổi bảo mật</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight mb-2">
          {title}
        </h1>
        <p className="text-xs text-gray-500 dark:text-stone-400 tracking-wide">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Old Password */}
        <div className="group">
          <label className={cn(
            "block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-stone-400 mb-2 group-focus-within:text-emerald-500 transition-colors",
            errors.oldPassword && "text-red-500"
          )}>
            Mật khẩu cũ
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
              <Lock size={16} />
            </div>
            <input
              type={showOldPassword ? 'text' : 'password'}
              {...register('oldPassword')}
              placeholder="••••••••"
              className={cn(
                'w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-stone-900/50 border rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-stone-500 focus:outline-none transition-all duration-300',
                errors.oldPassword
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-gray-200 dark:border-stone-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
              )}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-stone-200"
            >
              {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="mt-1.5 text-[11px] font-bold text-red-500">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="group">
          <label className={cn(
            "block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-stone-400 mb-2 group-focus-within:text-emerald-500 transition-colors",
            errors.newPassword && "text-red-500"
          )}>
            Mật khẩu mới
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
              <Lock size={16} />
            </div>
            <input
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              placeholder="••••••••"
              className={cn(
                'w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-stone-900/50 border rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-stone-500 focus:outline-none transition-all duration-300',
                errors.newPassword
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-gray-200 dark:border-stone-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
              )}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-stone-200"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1.5 text-[11px] font-bold text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="group">
          <label className={cn(
            "block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-stone-400 mb-2 group-focus-within:text-emerald-500 transition-colors",
            errors.confirmPassword && "text-red-500"
          )}>
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
              <Lock size={16} />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              className={cn(
                'w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-stone-900/50 border rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-stone-500 focus:outline-none transition-all duration-300',
                errors.confirmPassword
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-gray-200 dark:border-stone-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-stone-200"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-[11px] font-bold text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-[0.2em] py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};
