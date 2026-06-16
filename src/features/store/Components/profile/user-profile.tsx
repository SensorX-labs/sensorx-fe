'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, ChevronRight, Building, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useUser } from '@/shared/hooks/use-user';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';
import Image from 'next/image';

import { SecurityTab } from './security-tab';
import { AuthService } from '@/features/system/auth/services/auth-service';
import { ProfileTab } from './profile-tab';
import StoreCustomerService, { CustomerDetail } from '../../services/store-customer.service';

const authService = new AuthService();

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<'business' | 'security'>('business');
  const [customerData, setCustomerData] = useState<CustomerDetail>();
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const fetchCustomer = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await StoreCustomerService.getDetailCustomerByAccountId(user.id);
      if (response) {
        setCustomerData(response);
      }
    } catch (error) {
      console.error("Fetch customer error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUpdatingAvatar(true);
      await StoreCustomerService.updateCustomerAvatar(file);

      const updatedCustomer = await StoreCustomerService.getDetailCustomerByAccountId(user!.id);
      if (updatedCustomer) {
        setCustomerData(updatedCustomer);

        const userCookie = Cookies.get('user');
        if (userCookie) {
          const userData = JSON.parse(userCookie);
          userData.avatarUrl = updatedCustomer.avatarUrl;
          Cookies.set('user', JSON.stringify(userData), { expires: 7, path: '/' });
          window.dispatchEvent(new Event('user-updated'));
        }
      }
    } catch (error) {
      console.error("Update avatar error:", error);
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleLogout = async () => {
    const match = document.cookie.match(/(^| )refreshToken=([^;]+)/);
    const refreshToken = match ? decodeURIComponent(match[2]) : undefined;

    try {
      setIsLoggingOut(true);
      await authService.logout(refreshToken);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('token', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('user', { path: '/' });

      window.dispatchEvent(new Event('user-updated'));

      router.push('/');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-zinc-950 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[400px] left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[200px] right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.06] blur-[150px] pointer-events-none" />

      {/* Cinematic Banner */}
      <div className="relative py-12 sm:py-14 lg:py-16 bg-stone-950 overflow-hidden border-b border-stone-900">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop"
            alt="Profile Header Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-[#042F2E]/90 to-transparent" />
        </div>

        {/* Floating glow orb */}
        <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[90px] -translate-y-1/2" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-4">
            <Building size={11} className="shrink-0" /> Cổng thông tin doanh nghiệp
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            TÀI KHOẢN CỦA TÔI
          </h1>
          <p className="text-stone-300 text-xs md:text-sm font-sans max-w-md mt-3 leading-relaxed font-light">
            Quản lý hồ sơ công ty, thông tin giao nhận hàng hóa và thiết lập bảo mật hệ thống.
          </p>
        </div>
      </div>

      {/* Breadcrumb sub-bar */}
      <div className="bg-[#F9F9FB] dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoreBreadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Tài khoản' }
            ]}
            backLink="/"
            backLabel="Quay lại trang chủ"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 select-none relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <aside className="lg:col-span-1 flex flex-col gap-4">
            {/* User Header Info Card */}
            <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 sm:p-6 flex flex-col items-center text-center shadow-md rounded-2xl border-t-4 border-t-[#0D9488]">
              <div className="relative group mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className={cn(
                  "w-24 h-24 rounded-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#0D9488] relative shadow-inner",
                  isUpdatingAvatar && "opacity-50"
                )}>
                  {isUpdatingAvatar ? (
                    <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
                  ) : customerData?.avatarUrl ? (
                    <Image
                      src={customerData.avatarUrl}
                      alt={customerData.name}
                      fill
                      className="w-full h-full object-cover"
                    />
                  ) : customerData?.name ? (
                    <span className="text-2xl font-heading font-bold tracking-widest text-stone-400 dark:text-zinc-550 uppercase">
                      {customerData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  ) : (
                    <User size={40} className="text-stone-300 dark:text-zinc-700" />
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  disabled={isUpdatingAvatar}
                  className="absolute bottom-0 right-0 p-2 bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-full text-stone-400 hover:text-[#0D9488] dark:hover:text-secondary hover:border-[#0D9488]/55 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  title="Cập nhật ảnh đại diện"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                </button>
              </div>
              <h2 className="text-xs font-heading font-extrabold uppercase tracking-[0.2em] text-stone-900 dark:text-white mb-1">
                {customerData?.name || 'Khách hàng'}
              </h2>
              <p className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest truncate w-full">
                {customerData?.email}
              </p>
            </div>

            <nav className="space-y-2 lg:sticky lg:top-24">
              {[
                { id: 'business', label: 'Thông tin doanh nghiệp', icon: Building },
                { id: 'security', label: 'Mật khẩu & Bảo mật', icon: Shield },
              ].map((item) => {
                const Icon = item.icon || ChevronRight;
                const isActive = activeTab === item.id;
                return (
                    <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as 'business' | 'security');
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all duration-300 border cursor-pointer shadow-sm",
                      isActive
                        ? "text-white bg-[#0D9488] border-[#0D9488] shadow-md hover:bg-[#0F766E]"
                        : "bg-[#F9F9FB] dark:bg-zinc-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700"
                    )}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-xs font-sans font-bold uppercase tracking-wider rounded-xl border border-red-200 text-red-700 bg-white hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                {isLoggingOut ? <Loader2 size={16} className="animate-spin shrink-0" /> : <LogOut size={16} className="shrink-0" />}
                <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
              </button>
            </nav>
          </aside>

          <main className="lg:col-span-3 min-w-0">
            {activeTab === 'business' && (
              loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <ProfileTab
                  customerData={customerData}
                  onRefresh={fetchCustomer}
                />
              )
            )}

            {activeTab === 'security' && <SecurityTab />}
          </main>
        </div>
      </div>
    </div>
  );
}
