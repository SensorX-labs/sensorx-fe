'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, ChevronRight, Building, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useUser } from '@/shared/hooks/use-user';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';


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
    fetchCustomer();
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

      // Refresh customer data
      const updatedCustomer = await StoreCustomerService.getDetailCustomerByAccountId(user!.id);
      if (updatedCustomer) {
        setCustomerData(updatedCustomer);

        // Update user cookie for Header sync
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

      // Bắn event để Header đồng bộ lại ngay lập tức
      window.dispatchEvent(new Event('user-updated'));

      router.push('/');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-page-background">
      <StoreBreadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài khoản' }
        ]}
        backLink="/"
        backLabel="Quay lại trang chủ"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="tracking-title-xl mb-2">Tài khoản của tôi</h1>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            {/* User Header Info */}
            <div className="bg-white border border-gray-200 p-6 mb-4 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className={cn(
                  "w-24 h-24 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-brand-green/30 relative",
                  isUpdatingAvatar && "opacity-50"
                )}>
                  {isUpdatingAvatar ? (
                    <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
                  ) : customerData?.avatarUrl ? (
                    <img
                      src={customerData.avatarUrl}
                      alt={customerData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : customerData?.name ? (
                    <span className="text-2xl font-light tracking-widest text-gray-400 uppercase">
                      {customerData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  ) : (
                    <User size={40} className="text-gray-200" />
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  disabled={isUpdatingAvatar}
                  className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-brand-green hover:border-brand-green/30 transition-all shadow-sm disabled:opacity-50"
                  title="Cập nhật ảnh đại diện"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                </button>
              </div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-1">
                {customerData?.name || 'Khách hàng'}
              </h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest truncate w-full">
                {customerData?.email}
              </p>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'business', label: 'Thông tin doanh nghiệp', icon: Building },
                { id: 'security', label: 'Mật khẩu & Bảo mật', icon: Shield },
              ].map((item) => {
                const Icon = item.icon || ChevronRight;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wider rounded-none transition-all duration-300 border",
                      activeTab === item.id
                        ? "text-white border-[#2D5A27] shadow-md"
                        : "bg-[#F9FAFB] text-[#374151] border-gray-200 hover:border-gray-400 hover:bg-white"
                    )}
                    style={{ backgroundColor: activeTab === item.id ? '#2D5A27' : '' }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wider rounded-none border border-red-200 text-red-700 hover:bg-red-50 transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
                <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
              </button>
            </nav>
          </aside>

          <main className="lg:col-span-3">
            {activeTab === 'business' && (
              loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
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
