'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Github, Chrome } from 'lucide-react';

interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSwitchToRegister,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold italic text-brand-green mb-2">
          My SensorX Account
        </h1>
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          Precision & Luxury Redefined
        </p>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const username = formData.get('username') as string;
          const password = formData.get('password') as string;
          onSubmit?.(username, password);
        }}
        className="space-y-6"
      >
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

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-semibold py-3 px-6 tracking-wider uppercase transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500 tracking-widest">Hoặc đăng nhập với</span>
        </div>
      </div>

        {/* đăng nhập bằng phương thức khác */}
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
          <a
            href="#"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Quên mật khẩu?
          </a>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Bảo mật cấp doanh nghiệp
        </p>
      </div>
    </div>
  );
};
