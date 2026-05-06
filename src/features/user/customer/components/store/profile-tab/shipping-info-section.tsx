import React, { useState, useEffect } from 'react';
import { Truck, Save, X, Loader2, MapPin } from 'lucide-react';
import { CustomerService } from '@/features/user/customer/services/customer-service';
import AdministrativeService, { Province, Ward } from '@/shared/services/administrative-service';
import { UpdateShippingInfo } from '@/features/user/customer/models/update-shipping-info';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/shadcn-ui/select';
import { FormField } from './form-field';
import { ShippingInfo } from '../../../models/customer-detail';

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
            // For street input, strip the province/ward/country suffix if previously formatted
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
            // If customer exists but no shippingInfo, reset fields
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
        // Reset form to original shippingInfo values
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

            // Build full address: "123 Đường Song Hành, Phường Vỹ Dạ, Thành phố Huế, Việt Nam"
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

            const response = await CustomerService.updateShippingInfo(payload);
            if (response) {
                setIsEditing(false);
                onRefresh();
            }
        } catch (error: any) {
            toast.error(error.message || 'Lỗi cập nhật');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 flex items-center justify-center border border-orange-100">
                        <Truck className="text-orange-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">Thông tin giao hàng</h2>
                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Cấu hình kho/văn phòng nhận hàng hóa</p>
                    </div>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
                    >
                        Thay đổi thông tin
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <X size={14} /> Hủy
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={isSubmitting}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-500/20"
                        >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Lưu cấu hình
                        </button>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Contact */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-orange-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nhân sự nhận hàng</h3>
                        </div>
                        <div className="space-y-6">
                            <FormField
                                label="Họ tên người nhận"
                                value={receiverName}
                                isEditing={isEditing}
                                placeholder="Nhập tên người chịu trách nhiệm nhận hàng..."
                                onChange={setReceiverName}
                            />
                            <FormField
                                label="Số điện thoại nhận hàng"
                                value={receiverPhone}
                                isEditing={isEditing}
                                placeholder="Số điện thoại liên lạc tại kho..."
                                onChange={setReceiverPhone}
                            />
                        </div>
                    </div>

                    {/* Right: Geographic */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-orange-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vị trí địa lý & Chi tiết</h3>
                        </div>

                        {isEditing ? (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {/* Province + Ward side by side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-wider">Tỉnh / Thành phố</label>
                                        <Select
                                            value={provinceId || undefined}
                                            onValueChange={(val) => { setProvinceId(val); setWardId(null); }}
                                        >
                                            <SelectTrigger className="w-full h-[52px] border-slate-200 font-medium">
                                                <SelectValue placeholder="Chọn Tỉnh/Thành" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {provinces.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-wider">Phường / Xã</label>
                                        <Select
                                            value={wardId || undefined}
                                            onValueChange={setWardId}
                                            disabled={!provinceId}
                                        >
                                            <SelectTrigger className="w-full h-[52px] border-slate-200 font-medium">
                                                <SelectValue placeholder="Chọn Phường/Xã" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {wards.map(w => (
                                                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Street */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Số nhà, Tên đường</label>
                                        <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 uppercase">Lưu ý: Không điền lại Phường/Tỉnh</span>
                                    </div>
                                    <textarea
                                        value={streetInput}
                                        onChange={e => setStreetInput(e.target.value)}
                                        rows={2}
                                        className="w-full bg-white border border-slate-200 px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all resize-none"
                                        placeholder="Ví dụ: 123 Đường Song Hành..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-wider">Địa chỉ giao hàng hiện tại</label>
                                <div className="flex items-start gap-4 p-5 bg-orange-50/30 border border-orange-100/50 animate-in fade-in duration-300">
                                    <div className="mt-1">
                                        <MapPin size={18} className="text-orange-500" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
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
