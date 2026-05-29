import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Building, Save, X, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import StoreCustomerService, { CustomerDetail, UpdateCustomerInfo } from '@/features/store/services/store-customer.service';
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
            const response = await StoreCustomerService.updateCustomerInfo(formData as UpdateCustomerInfo);
            if (response) {
                setIsEditing(false);
                onRefresh();
                toast.success('Đã cập nhật hồ sơ doanh nghiệp thành công');
            }
        } catch (error: any) {
            toast.error(error.message || 'Lỗi cập nhật thông tin');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-md rounded-2xl overflow-hidden transition-all duration-300 font-sans border-l-4 border-l-[#0D9488]">
            {/* Header Section */}
            <div className="px-8 py-6 border-b border-stone-200 dark:border-zinc-800/80 bg-stone-100/40 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0D9488] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                        <Building size={22} />
                    </div>
                    <div>
                        <h2 className="text-sm font-heading font-extrabold tracking-wide text-stone-900 dark:text-white uppercase">Hồ sơ doanh nghiệp</h2>
                        <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-wider">Thông tin định danh & liên hệ chính thức</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-2.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Chỉnh sửa
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-gray-300 px-6 py-2.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                            >
                                <X size={14} /> Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                                className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Lưu hồ sơ
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-4 bg-[#0D9488]" />
                            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400">Định danh doanh nghiệp</h3>
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

                            <div className="bg-white dark:bg-zinc-950 p-5 border border-stone-200 dark:border-zinc-800 rounded-xl space-y-2 shadow-sm">
                                <label className="text-[10px] font-sans font-bold uppercase text-stone-500 tracking-wider">Email đăng ký hệ thống</label>
                                <div className="flex items-center gap-3 text-stone-900 dark:text-white font-semibold">
                                    <Mail size={16} className="text-stone-400 dark:text-zinc-550 shrink-0" />
                                    <span className="text-sm font-semibold">{formData.email}</span>
                                </div>
                                <p className="text-[9px] text-stone-400 italic mt-1">* Email được cố định theo tài khoản đăng ký</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-4 bg-[#0D9488]" />
                            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400">Liên lạc & Trụ sở</h3>
                        </div>

                        <div className="space-y-6">
                            <FormField
                                label="Số điện thoại doanh nghiệp"
                                value={formData.phone}
                                isEditing={isEditing}
                                icon={<Phone size={16} />}
                                placeholder="Ví dụ: 028..."
                                onChange={val => setFormData({ ...formData, phone: val })}
                            />

                            <div className="group">
                                <label className="block text-[10px] font-sans font-bold uppercase text-stone-500 mb-2 tracking-wider">Địa chỉ trụ sở chính</label>
                                {isEditing ? (
                                    <div className="relative group">
                                        <div className="absolute top-4 left-4 text-stone-400 dark:text-zinc-500 group-focus-within:text-[#0D9488] transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <textarea
                                            value={formData.address || ''}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="w-full bg-white dark:bg-zinc-950 pl-12 pr-4 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all resize-none rounded-xl border border-stone-250 dark:border-zinc-800 shadow-sm text-stone-900"
                                            placeholder="Địa chỉ ghi trên giấy phép kinh doanh..."
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4 p-5 bg-white dark:bg-zinc-900/50 border border-stone-200 dark:border-zinc-800 rounded-xl shadow-sm">
                                        <div className="mt-1">
                                            <MapPin size={18} className="text-[#0D9488]" />
                                        </div>
                                        <p className="text-sm font-semibold text-stone-850 dark:text-gray-150 leading-relaxed">
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
}
