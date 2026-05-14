'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { changePasswordSchema, ChangePasswordFormValues } from '@/features/system/auth/schemas/change-password-schema';
import { AuthService } from '@/features/system/auth/services/auth-service';

const authService = new AuthService();

export const ChangePasswordForm: React.FC = () => {
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

      toast.success('Mật khẩu đã được thay đổi thành công!');
      router.push('/profile');
    } catch {
      // Lỗi đã được xử lý bởi axios interceptor (hiển thị toast.error)
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold italic text-brand-green mb-2">
          Đổi mật khẩu
        </h1>
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          Vui lòng nhập thông tin mới
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Mật khẩu cũ */}
        <div>
          <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
            Mật khẩu cũ
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? 'text' : 'password'}
              {...register('oldPassword')}
              placeholder="••••••••"
              className={`w-full px-0 py-3 bg-transparent border-b focus:outline-none text-gray-900 placeholder-gray-400 transition-colors pr-8 ${
                errors.oldPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
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

        {/* Mật khẩu mới */}
        <div>
          <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              placeholder="••••••••"
              className={`w-full px-0 py-3 bg-transparent border-b focus:outline-none text-gray-900 placeholder-gray-400 transition-colors pr-8 ${
                errors.newPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
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

        {/* Xác nhận mật khẩu */}
        <div>
          <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              className={`w-full px-0 py-3 bg-transparent border-b focus:outline-none text-gray-900 placeholder-gray-400 transition-colors pr-8 ${
                errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
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

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-semibold py-3 px-6 tracking-wider uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Đang thay đổi...' : 'Đổi mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  );
};