'use client';

import React, { useState, useEffect } from 'react';
import { User, LogOut, ChevronRight, Building, MapPin, Shield, FileText, ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '@/shared/hooks/use-user';
import { CustomerService } from '@/features/user/customer/services/customer-service';

import { ProfileTab } from './profile-tab';
import { OrdersTab } from './orders-tab';
import { AddressesTab } from './addresses-tab';
import { MyQuotationsTab } from '../../../../sales/quotation/components/store/my-quotations-tab';
import { OrderDetailView } from '../../../../sales/order/components/store/order-detail-view';
import { QuotationDetailView } from '../../../../sales/quotation/components/store/quotation-detail-view';
import { RfqDetailView } from '../../../../sales/requestforquotation/components/store/rfq-detail-view';
import { MyRfqsTab } from '../../../../sales/requestforquotation/components/store/my-rfqs-tab';
import { SecurityTab } from './security-tab';

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'completed' | 'pending' | 'cancelled';
    items: number;
}

export function UserProfile() {
    const [activeTab, setActiveTab] = useState<'business' | 'orders' | 'quotations' | 'my-quotations' | 'addresses' | 'security'>('business');
    const [customerData, setCustomerData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
    const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);

    const { user } = useUser();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const fetchCustomer = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const response = await CustomerService.getDetailCustomerByAccountId(user.id);
            if (response.isSuccess) {
                setCustomerData(response.value);
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

    const handleLogout = async () => {
        const match = document.cookie.match(/(^| )refreshToken=([^;]+)/);
        const refreshToken = match ? decodeURIComponent(match[2]) : undefined;

        try {
            setIsLoggingOut(true);
            await fetch('http://localhost:5053/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            Cookies.remove('token', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            Cookies.remove('user', { path: '/' });
            toast.success('Đã đăng xuất thành công');
            router.push('/');
            setIsLoggingOut(false);
        }
    };

    // Mock orders data
    const orders: Order[] = [
        { id: 'ORD-001', date: '2024-12-15', total: 5250000, status: 'completed', items: 3 },
        { id: 'ORD-002', date: '2024-12-10', total: 2150000, status: 'completed', items: 2 },
        { id: 'ORD-003', date: '2024-12-05', total: 8750000, status: 'pending', items: 5 },
    ];

    return (
        <div className="min-h-screen bg-page-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="tracking-title-xl mb-2">Tài khoản của tôi</h1>
                </div>

                <div className="grid grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                        <nav className="space-y-2">
                            {[
                                { id: 'business', label: 'Thông tin doanh nghiệp', icon: Building },
                                { id: 'quotations', label: 'Yêu cầu báo giá', icon: FileText },
                                { id: 'my-quotations', label: 'Báo giá của tôi', icon: FileText },
                                { id: 'orders', label: 'Đơn hàng của tôi', icon: ShoppingCart },
                                { id: 'addresses', label: 'Địa chỉ giao hàng', icon: MapPin },
                                { id: 'security', label: 'Mật khẩu & Bảo mật', icon: Shield },
                            ].map((item) => {
                                const Icon = item.icon || ChevronRight;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id as any);
                                            setSelectedOrderId(null);
                                            setSelectedQuotationId(null);
                                            setSelectedRfqId(null);
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
                                    isEditing={isEditing}
                                    onEditChange={setIsEditing}
                                    onRefresh={fetchCustomer}
                                />
                            )
                        )}

                        {activeTab === 'orders' && (
                            selectedOrderId ? (
                                <OrderDetailView onBack={() => setSelectedOrderId(null)} />
                            ) : (
                                <OrdersTab orders={orders} onViewDetail={setSelectedOrderId} />
                            )
                        )}

                        {activeTab === 'quotations' && (
                            selectedRfqId ? (
                                <RfqDetailView onBack={() => setSelectedRfqId(null)} rfqId={selectedRfqId} />
                            ) : (
                                <MyRfqsTab onViewDetail={setSelectedRfqId} />
                            )
                        )}

                        {activeTab === 'my-quotations' && (
                            selectedQuotationId ? (
                                <QuotationDetailView onBack={() => setSelectedQuotationId(null)} quotationId={selectedQuotationId} />
                            ) : (
                                <MyQuotationsTab onViewDetail={setSelectedQuotationId} />
                            )
                        )}

                        {activeTab === 'addresses' && (
                            <AddressesTab 
                                userName={customerData?.name || ''} 
                                userPhone={customerData?.phone || ''} 
                                address={{
                                    street: customerData?.address || '',
                                    ward: '', district: '', province: ''
                                }} 
                            />
                        )}

                        {activeTab === 'security' && <SecurityTab />}
                    </main>
                </div>
            </div>
        </div>
    );
}
