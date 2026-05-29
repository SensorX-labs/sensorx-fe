import React, { useState, useEffect } from 'react';
import { Truck, Save, X, Loader2, MapPin } from 'lucide-react';
import AdministrativeService, { Province, Ward } from '@/shared/services/administrative.service';
import { toast } from 'sonner';
import StoreCustomerService, { UpdateShippingInfo, ShippingInfo } from '@/features/store/services/store-customer.service';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/shadcn-ui/select';
import { FormField } from './form-field';

interface ShippingInfoSectionProps {
    customerId: string | undefined;
    shippingInfo: ShippingInfo | null | undefined;
    onRefresh: () => void;
}

export function ShippingInfoSection({
    customerId,
    shippingInfo,
    onRefresh
}: ShippingInfoSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [provinceId, setProvinceId] = useState<string | null>(null);
    const [wardId, setWardId] = useState<string | null>(null);
    const [streetInput, setStreetInput] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    function getProvinceName(id: string | null | undefined) {
        return provinces.find(p => p.id === id)?.name;
    }

    function getWardName(id: string | null | undefined) {
        return wards.find(w => w.id === id)?.name;
    }

    // Populate form from shippingInfo
    useEffect(() => {
        if (shippingInfo) {
            setProvinceId(shippingInfo.provinceId || null);
            setWardId(shippingInfo.wardId || null);
            setReceiverName(shippingInfo.receiverName || '');
            setReceiverPhone(shippingInfo.receiverPhone || '');
            let street = shippingInfo.shippingAddress || '';
            if (street.toLowerCase().endsWith('việt nam')) {
                street = street.replace(/,\s*Việt Nam\s*$/i, '');
                const parts = street.split(',').map(s => s.trim());
                let removeCount = 0;
                if (shippingInfo.provinceId) removeCount++;
                if (shippingInfo.wardId) removeCount++;
                if (parts.length > removeCount) {
                    street = parts.slice(0, parts.length - removeCount).join(', ');
                }
            }
            setStreetInput(street);
        } else if (shippingInfo) {
            setProvinceId(null);
            setWardId(null);
            setReceiverName('');
            setReceiverPhone('');
            setStreetInput('');
        }
    }, [shippingInfo]);

    // Load provinces once
    useEffect(() => {
        AdministrativeService.getListProvince().then(setProvinces).catch(console.error);
    }, []);

    // Load wards whenever province changes
    useEffect(() => {
        if (provinceId) {
            AdministrativeService.getListWardForProvince(provinceId).then(setWards).catch(console.error);
        } else {
            setWards([]);
        }
    }, [provinceId]);

    function handleCancel() {
        if (shippingInfo) {
            setProvinceId(shippingInfo.provinceId || null);
            setWardId(shippingInfo.wardId || null);
            setReceiverName(shippingInfo.receiverName || '');
            setReceiverPhone(shippingInfo.receiverPhone || '');
            let street = shippingInfo.shippingAddress || '';
            if (street.toLowerCase().endsWith('việt nam')) {
                street = street.replace(/,\s*Việt Nam\s*$/i, '');
                const parts = street.split(',').map(s => s.trim());
                let removeCount = 0;
                if (shippingInfo.provinceId) removeCount++;
                if (shippingInfo.wardId) removeCount++;
                if (parts.length > removeCount) {
                    street = parts.slice(0, parts.length - removeCount).join(', ');
                }
            }
            setStreetInput(street);
        } else {
            setProvinceId(null);
            setWardId(null);
            setReceiverName('');
            setReceiverPhone('');
            setStreetInput('');
        }
        setIsEditing(false);
    };

    async function handleUpdate() {
        if (!customerId) return;
        try {
            setIsSubmitting(true);

            const parts: string[] = [];
            if (streetInput.trim()) parts.push(streetInput.trim());
            const wName = getWardName(wardId);
            const pName = getProvinceName(provinceId);
            if (wName) parts.push(wName);
            if (pName) parts.push(pName);
            parts.push('Việt Nam');

            const payload: UpdateShippingInfo = {
                id: customerId,
                provinceId,
                wardId,
                shippingAddress: parts.join(', '),
                receiverName,
                receiverPhone,
            } as UpdateShippingInfo;

            const response = await StoreCustomerService.updateShippingInfo(payload);
            if (response) {
                setIsEditing(false);
                onRefresh();
                toast.success('Đã cập nhật cấu hình giao hàng');
            }
        } catch (error: any) {
            toast.error(error.message || 'Lỗi cập nhật');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-md rounded-2xl overflow-hidden font-sans border-l-4 border-l-[#0D9488]">
            {/* Header */}
            <div className="px-8 py-6 border-b border-stone-200 dark:border-zinc-800/80 bg-stone-100/40 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0D9488] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                        <Truck size={22} />
                    </div>
                    <div>
                        <h2 className="text-sm font-heading font-extrabold tracking-wide text-stone-900 dark:text-white uppercase">Thông tin giao hàng</h2>
                        <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-wider">Cấu hình kho/văn phòng nhận hàng hóa</p>
                    </div>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-2.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Thay đổi thông tin
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
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
                            Lưu cấu hình
                        </button>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-8 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Contact */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-[#0D9488]" />
                            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400">Nhân sự nhận hàng</h3>
                        </div>
                        <div className="space-y-6">
                            <FormField
                                label="Họ tên người nhận"
                                value={receiverName}
                                isEditing={isEditing}
                                placeholder="Nhập tên người chịu trách nhiệm..."
                                onChange={setReceiverName}
                            />
                            <FormField
                                label="Số điện thoại nhận hàng"
                                value={receiverPhone}
                                isEditing={isEditing}
                                placeholder="Số điện thoại liên lạc..."
                                onChange={setReceiverPhone}
                            />
                        </div>
                    </div>

                    {/* Right: Geographic */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-[#0D9488]" />
                            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400">Vị trí địa lý & Chi tiết</h3>
                        </div>

                        {isEditing ? (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-sans font-bold uppercase text-stone-500 mb-2 tracking-wider">Tỉnh / Thành phố</label>
                                        <Select
                                            value={provinceId || undefined}
                                            onValueChange={(val) => { setProvinceId(val); setWardId(null); }}
                                        >
                                            <SelectTrigger className="w-full h-[52px] bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 rounded-xl font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] shadow-sm">
                                                <SelectValue placeholder="Chọn Tỉnh/Thành" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px] bg-white dark:bg-zinc-950 border border-stone-200">
                                                {provinces.map(p => (
                                                    <SelectItem key={p.id} value={p.id} className="cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-900">{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-sans font-bold uppercase text-stone-500 mb-2 tracking-wider">Phường / Xã</label>
                                        <Select
                                            value={wardId || undefined}
                                            onValueChange={setWardId}
                                            disabled={!provinceId}
                                        >
                                            <SelectTrigger className="w-full h-[52px] bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 rounded-xl font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] shadow-sm">
                                                <SelectValue placeholder="Chọn Phường/Xã" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px] bg-white dark:bg-zinc-950 border border-stone-200">
                                                {wards.map(w => (
                                                    <SelectItem key={w.id} value={w.id} className="cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-900">{w.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-sans font-bold uppercase text-stone-500 tracking-wider">Số nhà, Tên đường</label>
                                        <span className="text-[9px] font-bold text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded uppercase">Lưu ý: Không điền lại Phường/Tỉnh</span>
                                    </div>
                                    <textarea
                                        value={streetInput}
                                        onChange={e => setStreetInput(e.target.value)}
                                        rows={2}
                                        className="w-full bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 px-5 py-4 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all resize-none rounded-xl shadow-sm"
                                        placeholder="Ví dụ: 123 Đường Song Hành..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="group">
                                <label className="block text-[10px] font-sans font-bold uppercase text-stone-500 mb-2 tracking-wider">Địa chỉ giao hàng hiện tại</label>
                                <div className="flex items-start gap-4 p-5 bg-white dark:bg-zinc-900/50 border border-stone-200 dark:border-zinc-800 rounded-xl shadow-sm animate-in fade-in duration-300">
                                    <div className="mt-1">
                                        <MapPin size={18} className="text-[#0D9488] shrink-0" />
                                    </div>
                                    <p className="text-sm font-semibold text-stone-850 dark:text-gray-150 leading-relaxed">
                                        {shippingInfo?.shippingAddress || 'Chưa cập nhật địa chỉ giao hàng'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
