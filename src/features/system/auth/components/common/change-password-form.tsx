'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
  description = 'Vui lòng nhập thông tin mới',
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
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-semibold italic text-brand-green">
          {title}
        </h1>
        <p className="text-xs uppercase tracking-widest text-gray-400">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <label className="mb-3 block text-xs uppercase tracking-widest text-gray-500">
            Mật khẩu cũ
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? 'text' : 'password'}
              {...register('oldPassword')}
              placeholder="••••••••"
              className={cn(
                'w-full border-b bg-transparent px-0 py-3 pr-8 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none',
                errors.oldPassword
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              )}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-0 top-3 text-gray-400 hover:text-gray-600"
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.oldPassword.message}</p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-xs uppercase tracking-widest text-gray-500">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              placeholder="••••••••"
              className={cn(
                'w-full border-b bg-transparent px-0 py-3 pr-8 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none',
                errors.newPassword
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              )}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-0 top-3 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-xs uppercase tracking-widest text-gray-500">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              className={cn(
                'w-full border-b bg-transparent px-0 py-3 pr-8 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none',
                errors.confirmPassword
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 bg-brand-green px-6 py-3 font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};
