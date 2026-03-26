'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Address {
    street: string;
    ward: string;
    district: string;
    province: string;
}

interface AddressesTabProps {
    userName: string;
    userPhone: string;
    address: Address;
}

export const AddressesTab: React.FC<AddressesTabProps> = ({ userName, userPhone, address }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="tracking-title-lg">Địa chỉ giao hàng</h2>
                <button className="px-4 py-2 text-white text-xs font-semibold uppercase tracking-wider rounded-none transition-all duration-300" style={{ backgroundColor: 'var(--brand-green)' }}>
                    Thêm địa chỉ
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div
                    className="bg-white border border-gray-200 rounded-none p-6 relative hover:shadow-md transition-shadow duration-300"
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="inline-block px-2 py-1 text-white text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: 'var(--brand-green)' }}>
                            Chính
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <p className="text-sm font-medium tracking-wider text-gray-900 mb-2">
                        {userName}
                    </p>
                    <p className="text-sm tracking-wider text-gray-600 mb-2">
                        {address.street}
                    </p>
                    <p className="meta-label text-gray-600">
                        {address.ward}, {address.district}, {address.province}
                    </p>
                    <p className="meta-label text-gray-600 mt-3">
                        {userPhone}
                    </p>
                </div>
            </div>
        </div>
    );
};
