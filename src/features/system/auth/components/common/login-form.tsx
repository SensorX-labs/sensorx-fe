'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { loginSchema, LoginFormValues } from '../../schemas/login-schema';
import { AuthService } from '../../services/auth-service';

const authService = new AuthService();

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await authService.login(data);
      console.log("DEBUG - Login Response from API:", response);

      // Lấy token từ accessToken
      const token = response.accessToken;
      const refreshToken = response.refreshToken;

      // Lưu tokens và thông tin user vào cookie
      if (token) Cookies.set('token', token, { expires: 7, path: '/' });
      if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 30, path: '/' });
      if (response.user) Cookies.set('user', JSON.stringify(response.user), { expires: 7, path: '/' });

      toast.success('Đăng nhập thành công!');
      router.push('/');
    } catch {
      // Lỗi đã được xử lý bởi axios interceptor (hiển thị toast.error)
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold italic text-brand-green mb-2">
          My SensorX Account
        </h1>
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          Precision &amp; Luxury Redefined
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Email */}
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
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className={`w-full px-0 py-3 bg-transparent border-b focus:outline-none text-gray-900 placeholder-gray-400 transition-colors pr-8 ${
                errors.password
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
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
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500 tracking-widest">Hoặc đăng nhập với</span>
        </div>
      </div>

      {/* Social login */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-xs font-semibold tracking-wide uppercase">Facebook</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          <span className="text-xs font-semibold tracking-wide uppercase">Google</span>
        </button>
      </div>

      {/* Footer links */}
      <div className="mt-8 space-y-2 text-center">
        <div>
          <span className="text-xs text-gray-500">Chưa có tài khoản? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-xs text-blue-500 hover:text-blue-600 font-semibold tracking-wide"
          >
            Đăng ký ngay
          </button>
        </div>
        <div>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Quên mật khẩu?
          </a>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">Bảo mật cấp doanh nghiệp</p>
      </div>
    </div>
  );
};
