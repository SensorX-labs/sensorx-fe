import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Building, Save, X, Loader2, Info } from 'lucide-react';
import { CustomerService } from '@/features/user/customer/services/customer-service';
import { UpdateCustomerInfo } from '@/features/user/customer/models/update-customer-info';
import { toast } from 'sonner';
import { CustomerDetail } from '@/features/user/customer/models/Customer-detail';
import { FormField } from './form-field';

interface BusinessInfoSectionProps {
    customerData: CustomerDetail | null | undefined;
    onRefresh: () => void;
}

export function BusinessInfoSection({
    customerData,
    onRefresh
}: BusinessInfoSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<UpdateCustomerInfo>>({});

    useEffect(() => {
        if (customerData) {
            setFormData({
                id: customerData.id,
                name: customerData.name || '',
                taxCode: customerData.taxCode || '',
                email: customerData.email || '',
                phone: customerData.phone || '',
                address: customerData.address || ''
            });
        }
    }, [customerData]);

    const handleUpdate = async () => {
        if (!formData.id) return;
        try {
            setIsSubmitting(true);
            const response = await CustomerService.updateCustomerInfo(formData as UpdateCustomerInfo);
            if (response) {
                toast.success('Cập nhật hồ sơ doanh nghiệp thành công');
                setIsEditing(false);
                onRefresh();
            }
        } catch (error: any) {
            toast.error(error.message || 'Lỗi cập nhật thông tin');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300">
            {/* Header Section */}
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <Building className="text-emerald-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">Hồ sơ doanh nghiệp</h2>
                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Thông tin định danh & liên hệ chính thức</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 group"
                        >
                            Chỉnh sửa
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <X size={14} /> Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Lưu hồ sơ
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Essential Data */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 bg-emerald-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Định danh doanh nghiệp</h3>
                        </div>

                        <div className="space-y-6">
                            <FormField
                                label="Tên doanh nghiệp chính thức"
                                value={formData.name}
                                isEditing={isEditing}
                                icon={<Building size={16} />}
                                onChange={val => setFormData({ ...formData, name: val })}
                            />

                            <FormField
                                label="Mã số thuế"
                                value={formData.taxCode}
                                isEditing={isEditing}
                                icon={<Info size={16} />}
                                placeholder="Nhập mã số thuế..."
                                onChange={val => setFormData({ ...formData, taxCode: val })}
                            />

                            <div className="bg-slate-50/50 p-4 border border-slate-100 space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Email đăng ký hệ thống</label>
                                <div className="flex items-center gap-3 text-slate-900 font-semibold">
                                    <Mail size={16} className="text-slate-400" />
                                    <span className="text-sm">{formData.email}</span>
                                </div>
                                <p className="text-[9px] text-slate-400 italic mt-1">* Email được cố định theo tài khoản đăng ký</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact & Location */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 bg-emerald-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Liên lạc & Trụ sở</h3>
                        </div>

                        <div className="space-y-6">
                            <FormField
                                label="Số điện thoại tổng đài/doanh nghiệp"
                                value={formData.phone}
                                isEditing={isEditing}
                                icon={<Phone size={16} />}
                                placeholder="Ví dụ: 028..."
                                onChange={val => setFormData({ ...formData, phone: val })}
                            />

                            <div className="group">
                                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-wider">Địa chỉ trụ sở chính</label>
                                {isEditing ? (
                                    <div className="relative group">
                                        <div className="absolute top-4 left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <textarea
                                            value={formData.address || ''}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none"
                                            placeholder="Địa chỉ ghi trên giấy phép kinh doanh..."
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4 p-5 bg-emerald-50/30 border border-emerald-100/50">
                                        <div className="mt-1">
                                            <MapPin size={18} className="text-emerald-500" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
                                            {formData.address || 'Chưa cập nhật địa chỉ trụ sở'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
