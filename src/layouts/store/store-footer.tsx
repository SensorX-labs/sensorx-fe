'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const StoreFooter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800">
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* đăng ký email nhận tin nhắn */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
                Đăng ký nhận tin
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Đăng ký để nhận thông tin cập nhật, ưu đãi độc quyền và nhiều hơn nữa.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@cuaban.com"
                  required
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 text-sm focus:outline-none focus:border-brand-green transition-colors text-white placeholder-zinc-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black text-xs font-semibold tracking-widest uppercase hover:bg-zinc-200 transition-colors"
                >
                  Đăng ký
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-brand-green mt-2">Cảm ơn bạn đã đăng ký!</p>
              )}
            </div>

            {/* thông tin liên hệ */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
                Dịch vụ khách hàng
              </h3>
              <div className="space-y-3 text-sm text-zinc-400">
                <p>
                  <a className="hover:text-white transition-colors">
                    +84 382 116 944
                  </a>
                </p>
                <p>
                  <a href="mailto:support@sensorx.com" className="hover:text-white transition-colors">
                    support@sensorx.com
                  </a>
                </p>
                <p>Thứ Hai - Thứ Sáu: 9:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* công ty */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
              Công ty
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Báo chí
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Phát triển bền vững
                </Link>
              </li>
            </ul>
          </div>

          {/* sản phẩm */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
              Sản phẩm
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/category/sensors" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Cảm biến
                </Link>
              </li>
              <li>
                <Link href="/category/systems" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Hệ thống
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Hàng mới về
                </Link>
              </li>
            </ul>
          </div>

          {/* hỗ trợ */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
              Hỗ trợ
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Thông tin vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Đổi trả hàng
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* pháp lý */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
              Pháp lý
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Chính sách Cookie
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Sơ đồ trang
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* mạng xã hội */}
          <div className="flex gap-6">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white">
              Theo dõi chúng tôi
            </h4>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="text-zinc-400 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="text-zinc-400 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-zinc-400 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* bản quyền */}
          <div className="text-xs text-zinc-500">
            <p>&copy; 2026 SensorX. Bảo lưu mọi quyền.</p>
            <p className="mt-2">Thiết kế tỉ mỉ. Xây dựng bằng tâm huyết.</p>
          </div>
        </div>

        <div className="mt-24 pb-12 text-center">
          <h2 className="text-[10rem] font-bold tracking-[0.2em] text-white opacity-10 select-none leading-none">
            SENSORX
          </h2>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
