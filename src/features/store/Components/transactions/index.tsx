'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';
import { FileText, ShoppingBag, Package, ClipboardList } from 'lucide-react';
import { cn } from '@/shared/utils';

// Các component con
import { MyRfqsTab } from './tab-my-rfqs';
import { MyQuotationsTab } from './tab-my-quotations';
import { OrdersTab } from './tab-my-orders';
import { TabInquiryCart } from './tab-inquiry-cart';

import { useUser } from '@/shared/hooks/use-user';
import { CustomerDetail, StoreCustomerService } from '../../services/store-customer.service';

const TABS = [
  { id: 'inquiry-cart', label: 'Danh sách yêu cầu', icon: ClipboardList },
  { id: 'rfqs', label: 'Yêu cầu báo giá của tôi', icon: FileText },
  { id: 'quotes', label: 'Báo giá của tôi', icon: ShoppingBag },
  { id: 'orders', label: 'Đơn hàng của tôi', icon: Package }
] as const;

type TabId = typeof TABS[number]['id'];

export default function Transactions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as TabId;
  const [activeTab, setActiveTab] = useState<TabId>(TABS.some(t => t.id === tabFromUrl) ? tabFromUrl : 'inquiry-cart');

  const { user } = useUser();
  const [customerData, setCustomerData] = useState<CustomerDetail>();

  useEffect(() => {
    if (tabFromUrl && TABS.some(t => t.id === tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, activeTab]);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!user?.id) return;
      try {
        const response = await StoreCustomerService.getDetailCustomerByAccountId(user.id);
        if (response) setCustomerData(response);
      } catch (error) {
        console.error("Fetch customer error:", error);
      }
    };
    fetchCustomer();
  }, [user?.id]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    router.push(`/transactions?tab=${tabId}`);
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-page-background" />}>
      <div className="min-h-screen bg-page-background">
        <StoreBreadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Cửa hàng', href: '/shop' },
            { label: 'Giao dịch' }
          ]}
          backLink="/shop"
          backLabel="Tiếp tục mua sắm"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="tracking-title-xl mb-2">Giao dịch của tôi</h1>
          </div>

          {/* Tabs Điều Hướng Chính */}
          <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 pb-4 text-sm font-bold tracking-widest uppercase whitespace-nowrap transition-all border-b-2",
                    isActive
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Nội dung Tab */}
          <main>
            {activeTab === 'inquiry-cart' && <TabInquiryCart />}
            {activeTab === 'rfqs' && <MyRfqsTab customerId={customerData?.id} />}
            {activeTab === 'quotes' && <MyQuotationsTab customerId={customerData?.id} />}
            {activeTab === 'orders' && <OrdersTab customerId={customerData?.id} />}
          </main>
        </div>
      </div>
    </Suspense>
  );
}