'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Building, FileText, User, Save, X, Loader2 } from 'lucide-react';
import { CustomerService } from '@/features/user/customer/services/customer-service';
import { toast } from 'sonner';

interface CustomerData {
    id: string;
    name: string;
    phone: string;
    email: string;
    taxCode: string;
    address: string;
    wardId?: string | null;
    shippingAddress: string;
    receiverName: string;
    receiverPhone: string;
}

interface ProfileTabProps {
    customerData: CustomerData | null;
    isEditing: boolean;
    onEditChange: (value: boolean) => void;
    onRefresh: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ customerData, isEditing, onEditChange, onRefresh }) => {
    const initialFormState: CustomerData = {
        id: '',
        name: '',
        phone: '',
        email: '',
        taxCode: '',
        address: '',
        shippingAddress: '',
        receiverName: '',
        receiverPhone: '',
        wardId: null
    };

    const [formData, setFormData] = useState<CustomerData>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (customerData) {
            setFormData({
                ...initialFormState,
                ...customerData
            });
        }
    }, [customerData]);

    const handleUpdate = async () => {
        if (!formData || !formData.id) return;
        try {
            setIsSubmitting(true);
            const dataToSend = {
                ...formData,
                wardId: formData.wardId || null
            };
            const response = await CustomerService.updateCustomer(dataToSend);
            if (response.isSuccess) {
                toast.success('Cập nhật thông tin doanh nghiệp thành công');
                onEditChange(false);
                onRefresh();
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi cập nhật');
            }
        } catch (error: any) {
            toast.error(error.message || 'Lỗi kết nối server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header thông tin doanh nghiệp */}
            <div className="bg-white border border-gray-200 rounded-none p-8">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <Building className="text-brand-green" size={24} />
                        <h2 className="tracking-title-lg uppercase">Hồ sơ doanh nghiệp</h2>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => onEditChange(true)}
                            className="bg-brand-green hover:bg-brand-green-hover text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                        >
                            Chỉnh sửa thông tin
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEditChange(false)}
                                className="border border-gray-300 text-gray-600 px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <X size={14} /> Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                                className="bg-brand-green hover:bg-brand-green-hover text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Lưu thay đổi
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Thông tin pháp lý */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-l-2 border-brand-green pl-3">Thông tin cơ bản</h3>
                        
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 transition-colors group-focus-within:text-brand-green">Tên doanh nghiệp</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-semibold text-gray-900 px-1">{formData.name || '—'}</p>
                                )}
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 transition-colors group-focus-within:text-brand-green">Mã số thuế</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.taxCode || ''}
                                        onChange={e => setFormData({ ...formData, taxCode: e.target.value })}
                                        className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-semibold text-gray-900 px-1">{formData.taxCode || '—'}</p>
                                )}
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">Email liên hệ (Đăng ký)</label>
                                <div className="flex items-center gap-2 px-1 py-1">
                                    <Mail size={14} className="text-gray-400" />
                                    <p className="text-sm text-gray-600">{formData.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-l-2 border-brand-green pl-3">Địa chỉ & Liên lạc</h3>
                        
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 transition-colors group-focus-within:text-brand-green">Số điện thoại doanh nghiệp</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.phone || ''}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 px-1">
                                        <Phone size={14} className="text-gray-400" />
                                        <p className="text-sm font-semibold text-gray-900">{formData.phone || '—'}</p>
                                    </div>
                                )}
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 transition-colors group-focus-within:text-brand-green">Địa chỉ trụ sở</label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.address || ''}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        rows={2}
                                        className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all resize-none"
                                    />
                                ) : (
                                    <div className="flex items-start gap-2 px-1">
                                        <MapPin size={14} className="text-gray-400 mt-1" />
                                        <p className="text-sm text-gray-600 italic leading-relaxed">{formData.address || '—'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-l-2 border-orange-400 pl-3 mb-6">Thông tin nhận hàng mặc định</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 transition-colors group-focus-within:text-brand-green">Người nhận hàng</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.receiverName || ''}
                                    onChange={e => setFormData({ ...formData, receiverName: e.target.value })}
                                    className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold text-gray-900 px-1">{formData.receiverName || '—'}</p>
                            )}
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 transition-colors group-focus-within:text-brand-green">SĐT nhận hàng</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.receiverPhone || ''}
                                    onChange={e => setFormData({ ...formData, receiverPhone: e.target.value })}
                                    className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                                />
                            ) : (
                                <p className="text-sm font-semibold text-gray-900 px-1">{formData.receiverPhone || '—'}</p>
                            )}
                        </div>

                        <div className="md:col-span-3 group">
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 transition-colors group-focus-within:text-brand-green">Địa chỉ giao hàng chi tiết</label>
                            {isEditing ? (
                                <textarea
                                    value={formData.shippingAddress || ''}
                                    onChange={e => setFormData({ ...formData, shippingAddress: e.target.value })}
                                    rows={2}
                                    className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all resize-none"
                                />
                            ) : (
                                <p className="text-sm text-gray-600 italic px-1">{formData.shippingAddress || '—'}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
