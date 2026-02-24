'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Github, Chrome } from 'lucide-react';

interface RegisterFormProps {
  onSubmit?: (formData: Record<string, string | boolean>) => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold italic text-brand-green mb-2">
          Create Account
        </h1>
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          Tham gia cộng đồng SensorX
        </p>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data: Record<string, string | boolean> = {
            firstname: formData.get('firstname') as string,
            lastname: formData.get('lastname') as string,
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            passwordConfirm: formData.get('passwordConfirm') as string,
            acceptTerms: formData.get('acceptTerms') === 'on',
          };
          onSubmit?.(data);
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
              Tên
            </label>
            <input
              type="text"
              name="firstname"
              placeholder="Nguyễn"
              required
              className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
              Họ
            </label>
            <input
              type="text"
              name="lastname"
              placeholder="Văn A"
              required
              className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* username */}
        <div>
          <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="johndoe"
            required
            className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
          />
        </div>

        {/* mật khẩu */}
        <div>
          <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              required
              className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* xác nhận mật khẩu */}
        <div>
          <label className="block text-xs tracking-widest text-gray-500 uppercase mb-3">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              name="passwordConfirm"
              placeholder="••••••••"
              required
              className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-0 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* điều khoản */}
        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            name="acceptTerms"
            id="terms"
            required
            className="w-4 h-4 border-gray-300 rounded shrink-0"
          />
          <label htmlFor="terms" className="text-xs text-gray-600">
            Tôi đồng ý với{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Chính sách bảo mật
            </a>
          </label>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-semibold py-3 px-6 tracking-wider uppercase transition-colors"
          >
            Đăng ký
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
          <Github size={18} />
          <span className="text-xs font-semibold tracking-wide uppercase">GitHub</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <Chrome size={18} />
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
