'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { LogOut, Building, Shield, FileText, ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '@/shared/hooks/use-user';
import { CustomerService } from '@/features/user/customer/services/customer-service';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';
import { MyQuotationsTab } from '../../../../sales/quotation/components/store/my-quotations-tab';
import { OrderDetailView } from '../../../../sales/order/components/store/order-detail-view';
import { QuotationDetailView } from '../../../../sales/quotation/components/store/quotation-detail-view';
import { RfqDetailView } from '../../../../sales/requestforquotation/components/store/rfq-detail-view';
import { MyRfqsTab } from '../../../../sales/requestforquotation/components/store/my-rfqs-tab';
import { SecurityTab } from './security-tab';
import { AuthService } from '@/features/system/auth/services/auth-service';
import { ProfileTab } from '@/features/user/customer/components/store/profile-tab';
import { OrdersTab } from '@/features/sales/order/components/store/orders-tab';
import { CustomerDetail } from '@/features/user/customer/models/customer-detail';
import { MyInvoicesTab } from '@/features/sales/invoice/components/store/my-invoices-tab';
import { InvoiceDetailView } from '@/features/sales/invoice/components/store/invoice-detail-view';

const authService = new AuthService();
type ActiveTab = 'business' | 'orders' | 'invoices' | 'quotations' | 'my-quotations' | 'security';

const profileTabs: Array<{ id: ActiveTab; label: string; icon: React.ElementType }> = [
  { id: 'business', label: 'Thong tin doanh nghiep', icon: Building },
  { id: 'quotations', label: 'Yeu cau bao gia', icon: FileText },
  { id: 'my-quotations', label: 'Bao gia cua toi', icon: FileText },
  { id: 'orders', label: 'Don hang cua toi', icon: ShoppingCart },
  { id: 'invoices', label: 'Hoa don cua toi', icon: FileText },
  { id: 'security', label: 'Mat khau & Bao mat', icon: Shield },
];

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('business');
  const [customerData, setCustomerData] = useState<CustomerDetail>();
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const fetchCustomer = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await CustomerService.getDetailCustomerByAccountId(user.id);
      if (response) {
        setCustomerData(response);
      }
    } catch (error) {
      console.error('Fetch customer error:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

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
      toast.success('Da dang xuat thanh cong');
      router.push('/');
      setIsLoggingOut(false);
    }
  };

  const resetDetailSelection = () => {
    setSelectedOrderId(null);
    setSelectedInvoiceId(null);
    setSelectedQuotationId(null);
    setSelectedRfqId(null);
  };

  return (
    <div className="min-h-screen bg-page-background">
      <StoreBreadcrumb
        items={[
          { label: 'Trang chu', href: '/' },
          { label: 'Cua hang', href: '/shop' },
          { label: 'Tai khoan' }
        ]}
        backLink="/"
        backLabel="Quay lai trang chu"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="tracking-title-xl mb-2">Tai khoan cua toi</h1>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              {profileTabs.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      resetDetailSelection();
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
                <span>{isLoggingOut ? 'Dang dang xuat...' : 'Dang xuat'}</span>
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

            {activeTab === 'orders' && (
              selectedOrderId ? (
                <OrderDetailView orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
              ) : (
                <OrdersTab onViewDetail={setSelectedOrderId} />
              )
            )}

            {activeTab === 'invoices' && (
              selectedInvoiceId ? (
                <InvoiceDetailView invoiceId={selectedInvoiceId} onBack={() => setSelectedInvoiceId(null)} />
              ) : (
                <MyInvoicesTab onViewDetail={setSelectedInvoiceId} />
              )
            )}

            {activeTab === 'quotations' && (
              selectedRfqId ? (
                <RfqDetailView onBack={() => setSelectedRfqId(null)} rfqId={selectedRfqId} />
              ) : (
                <MyRfqsTab onViewDetail={setSelectedRfqId} customerId={customerData?.id} />
              )
            )}

            {activeTab === 'my-quotations' && (
              selectedQuotationId ? (
                <QuotationDetailView onBack={() => setSelectedQuotationId(null)} quotationId={selectedQuotationId} />
              ) : (
                <MyQuotationsTab onViewDetail={setSelectedQuotationId} customerId={customerData?.id} />
              )
            )}

            {activeTab === 'security' && <SecurityTab />}
          </main>
        </div>
      </div>
    </div>
  );
}
