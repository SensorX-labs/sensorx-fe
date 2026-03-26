'use client';

import React from 'react';
import { Mail, Phone, MapPin, Edit2 } from 'lucide-react';

interface UserData {
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        ward: string;
        district: string;
        province: string;
    };
}

interface ProfileTabProps {
    userData: UserData;
    isEditing: boolean;
    onEditChange: (value: boolean) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ userData, isEditing, onEditChange }) => {
    return (
        <div className="space-y-8">
            {/* thông tin cá nhân */}
            <div className="bg-white border border-gray-200 rounded-none p-8">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="tracking-title-lg">Thông tin cá nhân</h2>
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
                            Họ tên
                        </label>
                        <div
                            className={`px-4 py-3 border border-gray-200 tracking-wider text-sm ${
                                isEditing ? 'bg-gray-50' : 'bg-gray-100'
                            }`}
                        >
                            {userData.name}
                        </div>
                    </div>

                    <div>
                        <label className="block meta-label text-gray-600 mb-2">
                            Email
                        </label>
                        <div
                            className={`px-4 py-3 border border-gray-200 tracking-wider text-sm flex items-center gap-2 ${
                                isEditing ? 'bg-gray-50' : 'bg-gray-100'
                            }`}
                        >
                            <Mail size={16} />
                            {userData.email}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block meta-label text-gray-600 mb-2">
                            Số điện thoại
                        </label>
                        <div
                            className={`px-4 py-3 border border-gray-200 tracking-wider text-sm flex items-center gap-2 ${
                                isEditing ? 'bg-gray-50' : 'bg-gray-100'
                            }`}
                        >
                            <Phone size={16} />
                            {userData.phone}
                        </div>
                    </div>
                </div>
            </div>

            {/* địa chỉ cá nhân */}
            <div className="bg-white border border-gray-200 rounded-none p-8">
                <h2 className="tracking-title-lg mb-6">Địa chỉ cá nhân</h2>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border border-gray-200 bg-gray-50">
                        <MapPin size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium tracking-wider text-gray-900 mb-1">
                                {userData.address.street} - {userData.address.ward}
                            </p>
                            <p className="meta-label text-gray-600">
                                {userData.address.district}, {userData.address.province}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
