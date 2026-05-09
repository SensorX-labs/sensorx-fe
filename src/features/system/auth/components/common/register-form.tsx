'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
      // Chờ một chút rồi chuyển sang trang login
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
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold italic text-brand-green mb-2">
          Create Account
        </h1>
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          Đăng ký tài khoản doanh nghiệp SensorX
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        {/* Tên doanh nghiệp */}
        <div className="group">
          <label className="flex items-center gap-1 text-xs tracking-widest text-gray-500 uppercase mb-2 group-focus-within:text-brand-green transition-colors">
            Tên doanh nghiệp / Tổ chức <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Công ty TNHH SensorX"
            required
            className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-brand-green focus:outline-none text-gray-900 placeholder-gray-400 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mã số thuế */}
          <div className="group">
            <label className="flex items-center gap-1 text-xs tracking-widest text-gray-500 uppercase mb-2 group-focus-within:text-brand-green transition-colors">
              Mã số thuế <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="taxCode"
              placeholder="0123456789"
              required
              className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-brand-green focus:outline-none text-gray-900 placeholder-gray-400 transition-all duration-300"
            />
          </div>

          {/* Số điện thoại */}
          <div className="group">
            <label className="flex items-center gap-1 text-xs tracking-widest text-gray-500 uppercase mb-2 group-focus-within:text-brand-green transition-colors">
              Số điện thoại <span className="text-gray-400 lowercase italic">(tùy chọn)</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="0912345678"
              className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-brand-green focus:outline-none text-gray-900 placeholder-gray-400 transition-all duration-300"
            />
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="group">
          <label className="flex items-center gap-1 text-xs tracking-widest text-gray-500 uppercase mb-2 group-focus-within:text-brand-green transition-colors">
            Địa chỉ trụ sở <span className="text-gray-400 lowercase italic">(tùy chọn)</span>
          </label>
          <input
            type="text"
            name="address"
            placeholder="Số 123, Đường ABC, Quận XYZ, Hà Nội"
            className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-brand-green focus:outline-none text-gray-900 placeholder-gray-400 transition-all duration-300"
          />
        </div>

        {/* email */}
        <div className="group">
          <label className="flex items-center gap-1 text-xs tracking-widest text-gray-500 uppercase mb-2 group-focus-within:text-brand-green transition-colors">
            Email đăng nhập <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="admin@sensorx.com"
            required
            className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-brand-green focus:outline-none text-gray-900 placeholder-gray-400 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* mật khẩu */}
          <div className="group">
            <label className="flex items-center gap-1 text-xs tracking-widest text-gray-500 uppercase mb-2 group-focus-within:text-brand-green transition-colors">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                required
                className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-brand-green focus:outline-none text-gray-900 placeholder-gray-400 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-gray-400 hover:text-brand-green transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* xác nhận mật khẩu */}
          <div className="group">
            <label className="flex items-center gap-1 text-xs tracking-widest text-gray-500 uppercase mb-2 group-focus-within:text-brand-green transition-colors">
              Xác nhận <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                name="passwordConfirm"
                placeholder="••••••••"
                required
                className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-brand-green focus:outline-none text-gray-900 placeholder-gray-400 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-0 top-3 text-gray-400 hover:text-brand-green transition-colors"
              >
                {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold py-4 px-6 tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'Đang khởi tạo...' : 'Đăng ký ngay'}
          </button>
        </div>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500 tracking-widest">Hoặc đăng ký với</span>
        </div>
      </div>

      {/* phương thức đăng nhập khác */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-xs font-semibold tracking-wide uppercase">Facebook</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          <span className="text-xs font-semibold tracking-wide uppercase">Google</span>
        </button>
      </div>

      <div className="mt-8 text-center">
        <span className="text-xs text-gray-500">Đã có tài khoản? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-xs text-blue-500 hover:text-blue-600 font-semibold"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};
