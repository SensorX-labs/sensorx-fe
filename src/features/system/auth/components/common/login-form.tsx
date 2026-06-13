'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, Cpu } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { loginSchema, LoginFormValues } from '../../schemas/login-schema';
import { AuthService } from '../../services/auth-service';

const authService = new AuthService();

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    try {
      const response = await authService.login(data);

      const token = response.accessToken;
      const refreshToken = response.refreshToken;

      if (token) Cookies.set('token', token, { expires: 7, path: '/' });
      if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 30, path: '/' });
      if (response.user) Cookies.set('user', JSON.stringify(response.user), { expires: 7, path: '/' });

      window.dispatchEvent(new Event('user-updated'));
      toast.success('Đăng nhập thành công!');

      const userRoles = response.user?.roles || [];
      const isCustomer = userRoles.includes('Customer') || userRoles.includes('0');

      if (redirect) router.push(redirect);
      else if (!isCustomer && userRoles.length > 0) router.push('/dashboard');
      else router.push('/shop');
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 mb-4 bg-[#0D9488]/10 px-3 py-1 rounded-full border border-[#0D9488]/20">
          <Cpu size={12} className="text-[#0D9488] dark:text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488] dark:text-emerald-400">Cổng đăng nhập</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tight leading-tight mb-2">
          Chào Mừng <br className="hidden sm:inline" /> Trở Lại
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 tracking-wide font-medium">Nhập thông tin tài khoản doanh nghiệp của bạn</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errorMsg && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>{errorMsg}</div>
          </div>
        )}
        {/* Email */}
        <div className="group">
          <label className={`block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-2 group-focus-within:text-[#0D9488] transition-colors ${errors.email ? 'text-red-500' : ''}`}>
            Email đăng nhập
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

        {/* Password */}
        <div className="group">
          <div className="flex items-center justify-between mb-2">
            <label className={`text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 group-focus-within:text-[#0D9488] transition-colors ${errors.password ? 'text-red-500' : ''}`}>
              Mật khẩu
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold text-[#0D9488] hover:text-[#0F766E] dark:text-emerald-400 uppercase tracking-widest transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0D9488] transition-colors">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className={`w-full pl-11 pr-12 py-3.5 bg-white dark:bg-zinc-950 border rounded-2xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-450 focus:outline-none transition-all duration-300 shadow-sm ${
                errors.password
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-stone-250 dark:border-stone-800 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-[11px] font-bold text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {isSubmitting ? (
              <><Loader2 size={16} className="animate-spin" /> Đang xử lý...</>
            ) : (
              <>Xác nhận đăng nhập <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200 dark:border-stone-800" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-stone-400 dark:text-stone-500">
          <span className="bg-[#F9F9FB] dark:bg-stone-900 px-3">Hoặc</span>
        </div>
      </div>

      {/* Social login */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-all cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">Facebook</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-all cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/205" width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">Google</span>
        </button>
      </div>

      {/* Switch Link */}
      <p className="mt-8 text-center text-xs text-stone-500 dark:text-stone-400">
        Chưa có tài khoản doanh nghiệp?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-[#0D9488] hover:text-[#0F766E] dark:text-emerald-400 font-bold uppercase tracking-wider transition-colors ml-1 cursor-pointer"
        >
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
};