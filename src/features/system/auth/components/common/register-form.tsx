'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Building, ShieldCheck, Mail, Lock, Phone, MapPin, User, ArrowRight } from 'lucide-react';
import { AuthService } from '../../services/auth-service';
import { toast } from 'sonner';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

const authService = new AuthService();

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const taxCode = formData.get('taxCode') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('passwordConfirm') as string;

    if (password !== passwordConfirm) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        email,
        password,
        name,
        taxCode,
        phone: phone || null,
        address: address || null
      });
      toast.success("Đăng ký tài khoản thành công!");
      setTimeout(() => {
        onSwitchToLogin?.();
      }, 1500);
    } catch (error: any) {
      console.error(">>> Register Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full font-sans">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 mb-4 bg-[#0D9488]/10 px-3 py-1 rounded-full border border-[#0D9488]/20">
          <Building size={12} className="text-[#0D9488] dark:text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D9488] dark:text-emerald-400">Đăng ký doanh nghiệp</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tight leading-tight mb-2">
          Đăng Ký Tài Khoản
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 tracking-wide font-medium">Khởi tạo tài khoản SensorX B2B của bạn</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Doanh nghiệp */}
        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-1.5 group-focus-within:text-[#0D9488] transition-colors">
            Tên doanh nghiệp / Tổ chức <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0D9488] transition-colors">
              <Building size={15} />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Công ty TNHH SensorX"
              required
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10 rounded-2xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-450 focus:outline-none transition-all duration-300 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mã số thuế */}
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-1.5 group-focus-within:text-[#0D9488] transition-colors">
              Mã số thuế <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0D9488] transition-colors">
                <ShieldCheck size={15} />
              </div>
              <input
                type="text"
                name="taxCode"
                placeholder="0123456789"
                required
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10 rounded-2xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-450 focus:outline-none transition-all duration-300 shadow-sm"
              />
            </div>
          </div>

          {/* Điện thoại */}
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-1.5 group-focus-within:text-[#0D9488] transition-colors">
              Số điện thoại <span className="text-[9px] text-stone-450 dark:text-stone-550 normal-case font-normal">(tùy chọn)</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0D9488] transition-colors">
                <Phone size={15} />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="0912345678"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10 rounded-2xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-450 focus:outline-none transition-all duration-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-1.5 group-focus-within:text-[#0D9488] transition-colors">
            Địa chỉ trụ sở <span className="text-[9px] text-stone-450 dark:text-stone-550 normal-case font-normal">(tùy chọn)</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0D9488] transition-colors">
              <MapPin size={15} />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Số 123, Đường ABC, Hà Nội"
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10 rounded-2xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-450 focus:outline-none transition-all duration-300 shadow-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-1.5 group-focus-within:text-[#0D9488] transition-colors">
            Email đăng nhập <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0D9488] transition-colors">
              <Mail size={15} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="admin@sensorx.com"
              required
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10 rounded-2xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-450 focus:outline-none transition-all duration-300 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mật khẩu */}
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-1.5 group-focus-within:text-[#0D9488] transition-colors">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0D9488] transition-colors">
                <Lock size={15} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-12 py-3 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10 rounded-2xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-450 focus:outline-none transition-all duration-300 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#0D9488] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-1.5 group-focus-within:text-[#0D9488] transition-colors">
              Xác nhận <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#0D9488] transition-colors">
                <Lock size={15} />
              </div>
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                name="passwordConfirm"
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-12 py-3 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10 rounded-2xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-450 focus:outline-none transition-all duration-300 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#0D9488] transition-colors cursor-pointer"
              >
                {showPasswordConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-black uppercase tracking-[0.2em] py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Đang đăng ký...' : 'Đăng ký ngay'}
          </button>
        </div>
      </form>

      {/* Footer Switch */}
      <div className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <span>Đã có tài khoản doanh nghiệp? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#0D9488] hover:text-[#0F766E] dark:text-emerald-400 font-bold uppercase tracking-wider transition-colors ml-1 cursor-pointer"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};
