'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    User, Phone, Mail, FileText, Loader2, Save, Lock,
    Edit2, X, Calendar, Clock, Briefcase, KeyRound, ShieldAlert,
    CreditCard, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn-ui/tabs';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { AdminPageContainer } from '@/shared/components/admin/layout';
import StaffService, { ProfileStaff, StaffStatus } from '../../services/staff.service';
import { cn } from '@/shared/utils';

const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(dateString));
};

const renderStatusBadge = (status?: StaffStatus) => {
    switch (status) {
        case StaffStatus.Active:
            return <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1.5">Đang làm việc</span>;
        case StaffStatus.Resigned:
            return <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-full flex items-center gap-1.5">Đã nghỉ việc</span>;
        case StaffStatus.OnLeave:
            return <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold rounded-full flex items-center gap-1.5">Vắng mặt</span>;
        default:
            return <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-500 text-xs font-bold rounded-full flex items-center gap-1.5">Chưa xác định</span>;
    }
};

export default function StaffProfile() {
    const [profile, setProfile] = useState<ProfileStaff | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [citizenId, setCitizenId] = useState('');
    const [biography, setBiography] = useState('');
    const [email, setEmail] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await StaffService.getProfile();
                if (data) {
                    setProfile(data);
                    resetForm(data);
                }
            } catch (error) {
                console.error('>>> Lỗi khi fetch profile:', error);
                toast.error('Không thể tải thông tin cá nhân.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const resetForm = (data: ProfileStaff) => {
        setName(data.name || '');
        setPhone(data.phone || '');
        setCitizenId(data.citizenId || '');
        setBiography(data.biography || '');
        setEmail(data.email || '');
    };

    const handleCancelEdit = () => {
        if (profile) resetForm(profile);
        setIsEditingProfile(false);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Họ tên không được để trống.');
            return;
        }

        setSaving(true);
        try {
            await StaffService.updateProfile({
                name,
                phone: phone || undefined,
                email: email || '',
                citizenId: citizenId || undefined,
                biography: biography || undefined
            });

            setProfile(prev => prev ? { ...prev, name, phone, citizenId, biography, email } : null);
            setIsEditingProfile(false);
            toast.success('Cập nhật hồ sơ thành công!');

            const userCookie = Cookies.get('user');
            if (userCookie) {
                try {
                    const parsedUser = JSON.parse(userCookie);
                    parsedUser.fullName = name;
                    Cookies.set('user', JSON.stringify(parsedUser), { expires: 7, path: '/' });
                    window.dispatchEvent(new Event('user-updated'));
                } catch (e) {
                    console.error('Lỗi parse cookie:', e);
                }
            }
        } catch (error) {
            console.error('Lỗi cập nhật hồ sơ:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUpdatingAvatar(true);
            await StaffService.updateStaffAvatar(file);

            const updatedProfile = await StaffService.getProfile();
            if (updatedProfile) {
                setProfile(updatedProfile);

                const userCookie = Cookies.get('user');
                if (userCookie) {
                    try {
                        const parsedUser = JSON.parse(userCookie);
                        parsedUser.avatarUrl = updatedProfile.avatarUrl;
                        Cookies.set('user', JSON.stringify(parsedUser), { expires: 7, path: '/' });
                        window.dispatchEvent(new Event('user-updated'));
                    } catch (err) {
                        console.error('Lỗi parse cookie:', err);
                    }
                }
                toast.success('Cập nhật ảnh đại diện thành công!');
            }
        } catch (error) {
            console.error("Update avatar error:", error);
            toast.error("Không thể cập nhật ảnh đại diện.");
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-2">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-slate-500 font-medium text-sm">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <AdminPageContainer>
            {/* Tối ưu vùng cuộn: Chỉ cho phép cuộn dọc form chi tiết khi view nhỏ, không tràn khung */}
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pb-6">
                <Tabs defaultValue="profile" className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">

                    {/* CỘT TRÁI: ĐỒNG BỘ ROUNDED-XL VÀ MÀU TÔNG CHUẨN */}
                    <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-100 flex flex-col gap-6 shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-3.5">
                            <div className="relative group shrink-0">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div className={cn(
                                    "w-24 h-24 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-200 relative shadow-inner",
                                    isUpdatingAvatar && "opacity-50"
                                )}>
                                    {isUpdatingAvatar ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                                    ) : profile?.avatarUrl ? (
                                        <img
                                            src={profile.avatarUrl}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-slate-400 uppercase tracking-wider">
                                            {(profile?.name || '').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) || 'NV'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    disabled={isUpdatingAvatar}
                                    className="absolute bottom-0 right-0 p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm disabled:opacity-50"
                                    title="Cập nhật ảnh đại diện"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                                </button>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 tracking-tight">{profile?.name || '---'}</h3>
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">{profile?.code || '---'}</p>
                            </div>

                            <div className="flex gap-2 justify-center">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600">
                                    {profile?.department || 'Chưa cập nhật'}
                                </span>
                                {renderStatusBadge(profile?.status)}
                            </div>
                        </div>

                        <div className="pt-5 border-t border-slate-100">
                            <TabsList className="flex flex-col w-full h-auto bg-transparent p-0 gap-1.5">
                                <TabsTrigger
                                    value="profile"
                                    className="w-full justify-start px-4 py-2.5 rounded-lg data-[state=active]:bg-indigo-50/60 data-[state=active]:text-indigo-600 text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm border border-transparent data-[state=active]:border-indigo-100/50"
                                >
                                    <User size={15} className="mr-2.5" /> Hồ sơ cá nhân
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="w-full justify-start px-4 py-2.5 rounded-lg data-[state=active]:bg-indigo-50/60 data-[state=active]:text-indigo-600 text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm border border-transparent data-[state=active]:border-indigo-100/50"
                                    onClick={() => setIsChangingPassword(false)}
                                >
                                    <Lock size={15} className="mr-2.5" /> Bảo mật & Tài khoản
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    {/* CỘT PHẢI: BỎ ÉP CHIỀU CAO H-FULL ĐỂ FORM CO GIÃN TỰ NHIÊN, CÂN XỨNG THỊ GIÁC */}
                    <div className="md:col-span-2">

                        {/* TAB 1: HỒ SƠ CÁ NHÂN */}
                        <TabsContent value="profile" className="mt-0 outline-none">
                            <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
                                <CardHeader className="bg-slate-50/70 border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Thông tin chi tiết</CardTitle>

                                    {!isEditingProfile ? (
                                        <Button onClick={() => setIsEditingProfile(true)} variant="outline" className="h-9 px-4 rounded-lg border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                            <Edit2 size={13} className="mr-1.5" /> Chỉnh sửa hồ sơ
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Button onClick={handleCancelEdit} variant="outline" className="h-9 px-4 rounded-lg border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">
                                                Hủy
                                            </Button>
                                            <Button onClick={handleUpdateProfile} disabled={saving} className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm">
                                                {saving ? <Loader2 size={13} className="mr-1.5 animate-spin" /> : <Save size={13} className="mr-1.5" />}
                                                Lưu thay đổi
                                            </Button>
                                        </div>
                                    )}
                                </CardHeader>

                                <CardContent className="p-6">
                                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

                                            {/* Nhóm Thông tin cá nhân */}
                                            <div className="space-y-4 sm:col-span-2">
                                                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1.5">Thông tin cá nhân</h4>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><User size={12} /> Họ và tên</label>
                                                {isEditingProfile ? (
                                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-800 transition-all" />
                                                ) : (
                                                    <input type="text" value={profile?.name || '---'} disabled className="w-full h-10 px-3 bg-slate-50/60 border border-slate-100 text-slate-500 rounded-lg text-sm cursor-not-allowed" />
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><CreditCard size={12} /> Số CCCD</label>
                                                {isEditingProfile ? (
                                                    <input type="text" value={citizenId} onChange={(e) => setCitizenId(e.target.value)} className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-800 transition-all" />
                                                ) : (
                                                    <input type="text" value={profile?.citizenId || '---'} disabled className="w-full h-10 px-3 bg-slate-50/60 border border-slate-100 text-slate-500 rounded-lg text-sm cursor-not-allowed" />
                                                )}
                                            </div>

                                            {/* Nhóm Thông tin liên hệ */}
                                            <div className="space-y-4 sm:col-span-2 pt-2">
                                                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1.5">Thông tin liên hệ</h4>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Phone size={12} /> Số điện thoại</label>
                                                {isEditingProfile ? (
                                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-800 transition-all" />
                                                ) : (
                                                    <input type="text" value={profile?.phone || '---'} disabled className="w-full h-10 px-3 bg-slate-50/60 border border-slate-100 text-slate-500 rounded-lg text-sm cursor-not-allowed" />
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Mail size={12} /> Email (Chứng từ / Báo giá)</label>
                                                {isEditingProfile ? (
                                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-800 transition-all" />
                                                ) : (
                                                    <input type="text" value={profile?.email || '---'} disabled className="w-full h-10 px-3 bg-slate-50/60 border border-slate-100 text-slate-500 rounded-lg text-sm cursor-not-allowed" />
                                                )}
                                            </div>

                                            {/* Ngày tham gia chuyển xuống góc dưới cùng hệ thống */}
                                            <div className="space-y-1.5 sm:col-span-2 pt-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Ngày gia nhập hệ thống SensorX</label>
                                                <input type="text" value={formatDate(profile?.joinDate)} disabled className="w-full h-10 px-3 bg-slate-100/70 border border-slate-200/60 text-slate-400 rounded-lg text-sm cursor-not-allowed font-medium" />
                                            </div>

                                            {/* Khối Tiểu sử chuyên môn */}
                                            <div className="space-y-1.5 sm:col-span-2 pt-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><FileText size={12} /> Tiểu sử chuyên môn & Kinh nghiệm</label>
                                                {isEditingProfile ? (
                                                    <textarea value={biography} onChange={(e) => setBiography(e.target.value)} placeholder="Nhập tiểu sử ngắn hoặc ghi chú chuyên môn..." rows={4} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-800 resize-none transition-all" />
                                                ) : (
                                                    <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-lg min-h-[90px] leading-relaxed text-sm text-slate-600">
                                                        {profile?.biography || <span className="italic text-slate-400">Chưa cập nhật dữ liệu tiểu sử chuyên môn.</span>}
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 2: BẢO MẬT & ĐỔI MẬT KHẨU */}
                        <TabsContent value="security" className="mt-0 outline-none">
                            <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
                                <CardHeader className="bg-slate-50/70 border-b border-slate-100 px-6 py-4">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Bảo mật tài khoản</CardTitle>
                                </CardHeader>

                                <CardContent className="p-6">
                                    {!isChangingPassword ? (
                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/40 gap-4">
                                                <div className="flex items-start gap-3.5">
                                                    <div className="p-2 bg-white border border-slate-100 rounded-lg text-slate-600 shadow-sm shrink-0">
                                                        <KeyRound size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-800">Mật khẩu xác thực</h4>
                                                        <p className="text-xs text-slate-400 mt-0.5">Khuyên dùng thay đổi định kỳ để bảo vệ dữ liệu khách hàng.</p>
                                                    </div>
                                                </div>
                                                <Button onClick={() => setIsChangingPassword(true)} className="rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold h-9 px-4 shadow-sm shrink-0">
                                                    Đổi mật khẩu mới
                                                </Button>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/40 gap-4">
                                                <div className="flex items-start gap-3.5">
                                                    <div className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 shadow-sm shrink-0">
                                                        <ShieldAlert size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-400">Xác thực OTP hai lớp (2FA)</h4>
                                                        <p className="text-xs text-slate-400 mt-0.5">Trạng thái bảo mật: <span className="font-bold text-rose-500">Chưa kích hoạt</span></p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" className="rounded-lg border-slate-200 text-slate-400 text-xs font-semibold h-9 px-4 bg-white cursor-not-allowed shrink-0" disabled>
                                                    Thiết lập bảo mật
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="max-w-md space-y-4 animate-in fade-in duration-300">
                                            <div className="flex items-center gap-2 text-slate-500 hover:text-slate-800 cursor-pointer mb-2" onClick={() => setIsChangingPassword(false)}>
                                                <ArrowLeft size={14} /> <span className="text-xs font-bold">Quay lại quản lý bảo mật</span>
                                            </div>

                                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.info("Tính năng đổi mật khẩu đang được cấu hình."); }}>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-600">Mật khẩu hiện tại</label>
                                                    <input type="password" placeholder="••••••••" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-600">Mật khẩu mới</label>
                                                    <input type="password" placeholder="••••••••" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-600">Xác nhận lại mật khẩu mới</label>
                                                    <input type="password" placeholder="••••••••" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm" />
                                                </div>

                                                <div className="flex items-center gap-2 pt-2">
                                                    <Button type="submit" className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold h-10 px-5 shadow-sm">
                                                        Xác nhận cập nhật mật khẩu
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </div>
                </Tabs>
            </div>
        </AdminPageContainer>
    );
}