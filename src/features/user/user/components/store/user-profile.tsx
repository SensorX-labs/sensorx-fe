'use client';

import React, { useState } from 'react';
import { User, LogOut, ChevronRight, Building, MapPin, Heart, FileText, ShoppingCart } from 'lucide-react';
import { cn } from '@/shared/utils';
import { ProfileTab } from './profile-tab';
import { BusinessTab } from './business-tab';
import { OrdersTab } from './orders-tab';
import { AddressesTab } from './addresses-tab';
import { MyQuotationsTab } from './my-quotations-tab';
import { OrderDetailView } from './order-detail-view';
import { QuotationDetailView } from '../../../../sales/quotation/components/store/quotation-detail-view';
import { RfqDetailView } from '../../../../sales/requestforquotation/components/store/rfq-detail-view';
import { MyRfqsTab } from './my-rfqs-tab';

interface UserData {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    address: {
        street: string;
        ward: string;
        district: string;
        province: string;
    };
}

interface BusinessData {
    companyName: string;
    taxId: string;
    businessType: string;
    businessAddress: {
        street: string;
        ward: string;
        district: string;
        province: string;
    };
    representativeName: string;
    representativePhone: string;
    representativeEmail: string;
}

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'completed' | 'pending' | 'cancelled';
    items: number;
}

export function UserProfile() {
    const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'orders' | 'quotations' | 'my-quotations' | 'addresses' | 'wishlist'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
    const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);

    // Mock user data
    const userData: UserData = {
        name: 'Nguyễn Văn A',
        email: 'nguyenvanа@email.com',
        phone: '0912345678',
        avatar: 'assets/images/avatar-placeholder.jpg',
        address: {
            street: '123 Đường ABC',
            ward: 'Phường 1',
            district: 'Quận 1',
            province: 'TP. Hồ Chí Minh',
        },
    };

    // Mock business data
    const businessData: BusinessData = {
        companyName: 'Công Ty TNHH SensorX',
        taxId: '0123456789',
        businessType: 'Xuất nhập khẩu linh kiện điện tử',
        businessAddress: {
            street: '456 Đường XYZ',
            ward: 'Phường 2',
            district: 'Quận 1',
            province: 'TP. Hồ Chí Minh',
        },
        representativeName: 'Nguyễn Văn A',
        representativePhone: '0912345678',
        representativeEmail: 'contact@sensorx.com',
    };

    // Mock orders data
    const orders: Order[] = [
        {
            id: 'ORD-001',
            date: '2024-12-15',
            total: 5250000,
            status: 'completed',
            items: 3,
        },
        {
            id: 'ORD-002',
            date: '2024-12-10',
            total: 2150000,
            status: 'completed',
            items: 2,
        },
        {
            id: 'ORD-003',
            date: '2024-12-05',
            total: 8750000,
            status: 'pending',
            items: 5,
        },
    ];

    return (
        <div className="min-h-screen bg-page-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* header */}
                <div className="mb-8">
                    <h1 className="tracking-title-xl mb-2">Tài khoản của tôi</h1>
                </div>

                <div className="grid grid-cols-4 gap-8">
                    {/* sidebar menu */}
                    <aside className="lg:col-span-1">
                        <nav className="space-y-2">
                            {[
                                { id: 'profile', label: 'Thông tin cá nhân', icon: User },
                                { id: 'business', label: 'Thông tin doanh nghiệp', icon: Building },
                                { id: 'quotations', label: 'Yêu cầu báo giá', icon: FileText },
                                { id: 'my-quotations', label: 'Báo giá của tôi', icon: FileText },
                                { id: 'orders', label: 'Đơn hàng của tôi', icon: ShoppingCart },
                                { id: 'addresses', label: 'Địa chỉ giao hàng', icon: MapPin },
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
                                        style={{
                                            backgroundColor: activeTab === item.id ? '#2D5A27' : ''
                                        }}
                                    >
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wider rounded-none border border-red-200 text-red-700 hover:bg-red-50 transition-all duration-300 mt-4">
                                <LogOut size={18} />
                                <span>Đăng xuất</span>
                            </button>
                        </nav>
                    </aside>

                    {/* main content */}
                    <main className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <ProfileTab
                                userData={userData}
                                isEditing={isEditing}
                                onEditChange={setIsEditing}
                            />
                        )}

                        {activeTab === 'business' && (
                            <BusinessTab
                                businessData={businessData}
                                isEditing={isEditing}
                                onEditChange={setIsEditing}
                            />
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
                                <RfqDetailView 
                                    onBack={() => setSelectedRfqId(null)} 
                                    rfqId={selectedRfqId}
                                />
                            ) : (
                                <MyRfqsTab onViewDetail={setSelectedRfqId} />
                            )
                        )}

                        {activeTab === 'my-quotations' && (
                            selectedQuotationId ? (
                                <QuotationDetailView 
                                    onBack={() => setSelectedQuotationId(null)} 
                                    quotationId={selectedQuotationId}
                                />
                            ) : (
                                <MyQuotationsTab onViewDetail={setSelectedQuotationId} />
                            )
                        )}

                        {activeTab === 'addresses' && (
                            <AddressesTab
                                userName={userData.name}
                                userPhone={userData.phone}
                                address={userData.address}
                            />
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
}
