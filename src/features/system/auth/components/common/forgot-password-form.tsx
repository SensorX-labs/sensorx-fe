'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold italic text-brand-green mb-2">
          Quên Mật Khẩu
        </h1>
        <p className="text-sm text-gray-500">
          Nhập email đã đăng ký. Hệ thống sẽ tạo mật khẩu mới và gửi về hộp thư của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
            Email
          </label>

          <input
            type="email"
            {...register('email')}
            placeholder="johndoe@example.com"
            className={`w-full px-0 py-3 bg-transparent border-b focus:outline-none text-gray-900 placeholder-gray-400 transition-colors ${
              errors.email
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-semibold py-3 px-6 tracking-wider uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}

          {isSubmitting ? 'Đang gửi...' : 'Gửi Mật Khẩu Mới'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}