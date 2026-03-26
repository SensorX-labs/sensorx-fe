'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Edit2 } from 'lucide-react';

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

interface BusinessTabProps {
    businessData: BusinessData;
    isEditing: boolean;
    onEditChange: (value: boolean) => void;
}

export const BusinessTab: React.FC<BusinessTabProps> = ({ businessData, isEditing, onEditChange }) => {
    return (
        <div className="space-y-8">

            {/* thông tin cơ bản của doanh nghiệp */}
            <div className="bg-white border border-gray-200 rounded-none p-8">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="tracking-title-lg">Thông tin doanh nghiệp</h2>
                    <button
                        onClick={() => onEditChange(!isEditing)}
                        className="flex items-center gap-2 px-4 py-2 text-white text-xs font-semibold uppercase tracking-wider rounded-none transition-all duration-300"
                        style={{
                            backgroundColor: 'var(--brand-green)',
                        }}
                    >
                        <Edit2 size={16} />
                        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block meta-label text-gray-600 mb-2">
                            Tên công ty
                        </label>
                        <div
                            className={`px-4 py-3 border border-gray-200 tracking-wider text-sm ${isEditing ? 'bg-gray-50' : 'bg-gray-100'}`}
                        >
                            {businessData.companyName}
                        </div>
                    </div>

                    <div>
                        <label className="block meta-label text-gray-600 mb-2">
                            Mã số thuế
                        </label>
                        <div
                            className={`px-4 py-3 border border-gray-200 tracking-wider text-sm ${isEditing ? 'bg-gray-50' : 'bg-gray-100'}`}
                        >
                            {businessData.taxId}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block meta-label text-gray-600 mb-2">
                            Ngành kinh doanh
                        </label>
                        <div
                            className={`px-4 py-3 border border-gray-200 tracking-wider text-sm ${isEditing ? 'bg-gray-50' : 'bg-gray-100'}`}
                        >
                            {businessData.businessType}
                        </div>
                    </div>
                </div>
            </div>

            {/* địa chỉ công ty */}
            <div className="bg-white border border-gray-200 rounded-none p-8">
                <h2 className="tracking-title-lg mb-6">Địa chỉ công ty</h2>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border border-gray-200 bg-gray-50">
                        <MapPin size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium tracking-wider text-gray-900 mb-1">
                                {businessData.businessAddress.street} - {businessData.businessAddress.ward}
                            </p>
                            <p className="meta-label text-gray-600">
                                {businessData.businessAddress.district}, {businessData.businessAddress.province}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* thông tin của người đại diện công ty */}
            <div className="bg-white border border-gray-200 rounded-none p-8">
                <h2 className="tracking-title-lg mb-6">Thông tin đại diện</h2>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block meta-label text-gray-600 mb-2">
                            Họ tên đại diện
                        </label>
                        <div
                            className={`px-4 py-3 border border-gray-200 tracking-wider text-sm flex items-center gap-2 ${isEditing ? 'bg-gray-50' : 'bg-gray-100'}`}
                        >
                            <User size={16} />
                            {businessData.representativeName}
                        </div>
                    </div>

                    <div>
                        <label className="block meta-label text-gray-600 mb-2">
                            Email
                        </label>
                        <div
                            className={`px-4 py-3 border border-gray-200 tracking-wider text-sm flex items-center gap-2 ${isEditing ? 'bg-gray-50' : 'bg-gray-100'}`}
                        >
                            <Mail size={16} />
                            {businessData.representativeEmail}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block meta-label text-gray-600 mb-2">
                            Số điện thoại
                        </label>
                        <div
                            className={`px-4 py-3 border border-gray-200 tracking-wider text-sm flex items-center gap-2 ${isEditing ? 'bg-gray-50' : 'bg-gray-100'}`}
                        >
                            <Phone size={16} />
                            {businessData.representativePhone}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
