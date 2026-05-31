'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';
import { FileText, ShoppingBag, Package, ClipboardList, Receipt } from 'lucide-react';
import { cn } from '@/shared/utils';

// Các component con
import { MyRfqsTab } from './tab-my-rfqs';
import { MyQuotationsTab } from './tab-my-quotations';
import { OrdersTab } from './tab-my-orders';
import { TabInquiryCart } from './tab-inquiry-cart';
import { MyInvoicesTab } from '@/features/sales/invoice/components/store/my-invoices-tab';
import { InvoiceDetailView } from '@/features/sales/invoice/components/store/invoice-detail-view';

const TABS = [
  { id: 'inquiry-cart', label: 'Danh sách yêu cầu', icon: ClipboardList },
  { id: 'rfqs', label: 'Yêu cầu báo giá của tôi', icon: FileText },
  { id: 'quotes', label: 'Báo giá của tôi', icon: ShoppingBag },
  { id: 'orders', label: 'Đơn hàng của tôi', icon: Package },
  { id: 'invoices', label: 'Hóa đơn của tôi', icon: Receipt }
] as const;

type TabId = typeof TABS[number]['id'];

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as TabId;
  const activeTab: TabId = (tabFromUrl && TABS.some(t => t.id === tabFromUrl)) ? tabFromUrl : 'inquiry-cart';
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const handleTabChange = (tabId: TabId) => {
    setSelectedInvoiceId(null);
    router.replace(`/transactions?tab=${tabId}`, { scroll: false });
  };

  return (
      <div className="min-h-screen bg-[#ffffff] dark:bg-zinc-950 relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-[400px] left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[200px] right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.06] blur-[150px] pointer-events-none" />

        {/* Cinematic Banner */}
        <div className="relative py-16 bg-stone-950 overflow-hidden border-b border-stone-900">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
              alt="Transactions Header Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-[#042F2E]/90 to-transparent" />
          </div>

          {/* Floating glow orb */}
          <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[90px] -translate-y-1/2" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-4">
              <ClipboardList size={11} className="shrink-0" /> Tiến trình giao dịch
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              Giao dịch của tôi
            </h1>
            <p className="text-stone-300 text-xs md:text-sm font-sans max-w-md mt-3 leading-relaxed font-light">
              Theo dõi giỏ yêu cầu báo giá, danh sách RFQ, các báo giá phản hồi và tình trạng đơn hàng của bạn.
            </p>
          </div>
        </div>

        {/* Breadcrumb sub-bar */}
        <div className="bg-[#F9F9FB] dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StoreBreadcrumb
              items={[
                { label: 'Trang chủ', href: '/' },
                { label: 'Cửa hàng', href: '/shop' },
                { label: 'Giao dịch' }
              ]}
              backLink="/shop"
              backLabel="Tiếp tục mua sắm"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {/* Tabs Điều Hướng Chính */}
          <div className="flex items-center gap-6 border-b border-stone-200 dark:border-zinc-800 mb-10 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 pb-4 text-xs font-sans font-extrabold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 cursor-pointer",
                    isActive
                      ? "border-[#0D9488] text-[#0D9488] dark:text-emerald-400"
                      : "border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-white"
                  )}
                >
                  <Icon size={15} className="shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Nội dung Tab */}
          <main>
            {activeTab === 'inquiry-cart' && <TabInquiryCart />}
            {activeTab === 'rfqs' && <MyRfqsTab />}
            {activeTab === 'quotes' && <MyQuotationsTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'invoices' && (
              selectedInvoiceId ? (
                <InvoiceDetailView invoiceId={selectedInvoiceId} onBack={() => setSelectedInvoiceId(null)} />
              ) : (
                <MyInvoicesTab onViewDetail={(id) => setSelectedInvoiceId(id)} />
              )
            )}
          </main>
        </div>
      </div>
  );
}

export default function Transactions() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page-background" />}>
      <TransactionsContent />
    </Suspense>
  );
}