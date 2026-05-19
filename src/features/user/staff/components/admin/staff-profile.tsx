'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    User, Phone, Mail, FileText, Loader2, Save, Lock,
    Edit2, X, Calendar, Clock, Briefcase, KeyRound, ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn-ui/tabs';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { AdminPageContainer } from '@/shared/components/admin/layout';
import StaffService, { ProfileStaff, StaffStatus } from '../../services/staff.service';
import { cn } from '@/shared/utils';

// Helper function format ngày tháng
const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(dateString));
};

// Helper function render trạng thái
const renderStatusBadge = (status?: StaffStatus) => {
    switch (status) {
        case StaffStatus.Active:
            return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-sm border border-emerald-200">Đang làm việc</span>;
        case StaffStatus.Resigned:
            return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-sm border border-red-200">Đã nghỉ việc</span>;
        case StaffStatus.OnLeave:
            return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-sm border border-yellow-200">Vắng mặt</span>;
        default:
            return <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-sm border border-slate-200">Chưa xác định</span>;
    }
};

export default function StaffProfile() {
    const [profile, setProfile] = useState<ProfileStaff | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // States quản lý chế độ hiển thị
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Form states cho Profile
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

            // Refresh lại profile
            const updatedProfile = await StaffService.getProfile();
            if (updatedProfile) {
                setProfile(updatedProfile);

                // Đồng bộ sang Cookie của Header Admin
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
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="text-slate-500 font-medium text-sm">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <AdminPageContainer>
            <div className="flex flex-col h-full overflow-hidden pb-4">

                {/* Header Summary */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-5 rounded-md shadow-sm border border-slate-200 mb-6 shrink-0">
                    <div className="relative group shrink-0">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className={cn(
                            "w-20 h-20 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-300 relative",
                            isUpdatingAvatar && "opacity-50"
                        )}>
                            {isUpdatingAvatar ? (
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            ) : profile?.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xl font-bold text-slate-500 uppercase">
                                    {(profile?.name || '').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) || 'NV'}
                                </span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleAvatarClick}
                            disabled={isUpdatingAvatar}
                            className="absolute bottom-0 right-0 p-1 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm disabled:opacity-50"
                            title="Cập nhật ảnh đại diện"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 space-y-2">
                        <h1 className="text-xl font-bold text-slate-900">{profile?.name || '---'}</h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                <Briefcase size={14} className="text-slate-400" />
                                {profile?.department || 'Chưa cập nhật'}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                <FileText size={14} className="text-slate-400" />
                                Mã NV: <strong className="text-slate-900">{profile?.code || '---'}</strong>
                            </span>
                            <span className="text-slate-300">|</span>
                            {renderStatusBadge(profile?.status)}
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="profile" className="flex flex-col flex-1 min-h-0 w-full">
                    <TabsList className="bg-slate-100 p-1 mb-6 rounded-md border border-slate-200 w-full md:w-fit overflow-x-auto justify-start h-auto shrink-0">
                        <TabsTrigger value="profile" className="px-6 py-2 rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 font-semibold text-sm transition-all">
                            <User size={16} className="mr-2" /> Hồ sơ cá nhân
                        </TabsTrigger>
                        <TabsTrigger value="security" className="px-6 py-2 rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 font-semibold text-sm transition-all" onClick={() => setIsChangingPassword(false)}>
                            <Lock size={16} className="mr-2" /> Bảo mật
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: HỒ SƠ CÁ NHÂN */}
                    <TabsContent value="profile" className="mt-0 outline-none flex-1 min-h-0 overflow-hidden">
                        {/* Thêm overflow-hidden vào Card để nền xám của Header không bị lòi ra ngoài góc bo tròn */}
                        <Card className="rounded-md border-slate-200 shadow-sm bg-white flex flex-col h-full overflow-hidden">

                            {/* CardHeader được đổi sang nền xám (bg-slate-50), viền rõ hơn và thu hẹp padding dọc (py-3.5) */}
                            <CardHeader className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900 uppercase">Thông tin chi tiết</CardTitle>
                                </div>

                                {!isEditingProfile ? (
                                    <Button onClick={() => setIsEditingProfile(true)} variant="outline" className="h-9 px-4 rounded-md border-slate-300 bg-white text-sm font-medium">
                                        <Edit2 size={14} className="mr-2" /> Chỉnh sửa
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Button onClick={handleCancelEdit} variant="outline" className="h-9 px-4 rounded-md border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100">
                                            Hủy
                                        </Button>
                                        <Button onClick={handleUpdateProfile} disabled={saving} className="h-9 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium">
                                            {saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Save size={14} className="mr-2" />}
                                            Lưu thay đổi
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>

                            {/* Chỉnh lại padding top thành pt-4 thay vì padding đều để giảm khoảng cách với Header */}
                            <CardContent className="px-6 pt-4 pb-6 flex-1 overflow-y-auto pr-4">
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Cột 1: Thông tin cá nhân */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Thông tin cá nhân</h3>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase">Họ và tên</label>
                                                {isEditingProfile ? (
                                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm text-slate-900" />
                                                ) : (
                                                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900">{profile?.name || '---'}</div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase">Số CCCD</label>
                                                {isEditingProfile ? (
                                                    <input type="text" value={citizenId} onChange={(e) => setCitizenId(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm text-slate-900" />
                                                ) : (
                                                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900">{profile?.citizenId || '---'}</div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1"><Calendar size={12} /> Ngày tham gia</label>
                                                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-500 cursor-not-allowed">
                                                    {formatDate(profile?.joinDate)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cột 2: Thông tin liên hệ */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Thông tin liên hệ</h3>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase">Số điện thoại</label>
                                                {isEditingProfile ? (
                                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm text-slate-900" />
                                                ) : (
                                                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900">{profile?.phone || '---'}</div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                                    Email
                                                </label>

                                                {isEditingProfile ? (
                                                    <div>
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            placeholder="Nhập email hiển thị cho đối tác..."
                                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm text-slate-900"
                                                        />
                                                        <p className="text-[11px] text-slate-500 italic mt-1.5">
                                                            * Email này dùng để hiển thị trên báo giá/hợp đồng, không làm thay đổi tài khoản đăng nhập.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900">
                                                        {profile?.email || '---'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Khối Biography */}
                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Tiểu sử chuyên môn</label>
                                        {isEditingProfile ? (
                                            <textarea
                                                value={biography}
                                                onChange={(e) => setBiography(e.target.value)}
                                                placeholder="Nhập tiểu sử, kinh nghiệm làm việc..."
                                                rows={4}
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm text-slate-900 resize-y"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md min-h-[80px] flex items-start">
                                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed w-full">
                                                    {profile?.biography || <span className="italic text-slate-400">Chưa cập nhật tiểu sử chuyên môn.</span>}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB 2: BẢO MẬT & ĐỔI MẬT KHẨU */}
                    <TabsContent value="security" className="mt-0 outline-none flex-1 min-h-0 overflow-hidden">
                        <Card className="rounded-md border-slate-200 shadow-sm bg-white flex flex-col h-full overflow-hidden">

                            {/* Cập nhật UI Header tương tự cho Tab 2 */}
                            <CardHeader className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 shrink-0">
                                <CardTitle className="text-base font-bold text-slate-900 uppercase">Bảo mật tài khoản</CardTitle>
                            </CardHeader>

                            <CardContent className="px-6 pb-6 flex-1 pr-4">
                                {!isChangingPassword ? (
                                    <div className="max-w-2xl space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md bg-slate-50">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-white border border-slate-200 rounded-md text-slate-700 shadow-sm">
                                                    <KeyRound size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900">Mật khẩu đăng nhập</h4>
                                                    <p className="text-xs text-slate-500 mt-1">Nên thay đổi mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.</p>
                                                </div>
                                            </div>
                                            <Button onClick={() => setIsChangingPassword(true)} className="rounded-md bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium">
                                                Đổi mật khẩu
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md bg-slate-50">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-white border border-slate-200 rounded-md text-slate-700 shadow-sm">
                                                    <ShieldAlert size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900">Xác thực 2 lớp (2FA)</h4>
                                                    <p className="text-xs text-slate-500 mt-1">Trạng thái: <span className="font-semibold text-slate-700">Đang tắt</span></p>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="rounded-md border-slate-300 text-slate-700 text-sm font-medium bg-white" disabled>
                                                Thiết lập
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-xl">
                                        <div className="mb-6">
                                            <h3 className="text-sm font-bold text-slate-900">Đổi mật khẩu mới</h3>
                                            <p className="text-xs text-slate-500 mt-1">Vui lòng nhập mật khẩu hiện tại để xác thực.</p>
                                        </div>

                                        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); toast.info("API đổi mật khẩu đang được phát triển."); }}>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-700">Mật khẩu hiện tại</label>
                                                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-700">Mật khẩu mới</label>
                                                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-700">Xác nhận mật khẩu mới</label>
                                                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm" />
                                            </div>

                                            <div className="flex items-center gap-3 pt-2">
                                                <Button type="button" onClick={() => setIsChangingPassword(false)} variant="outline" className="rounded-md border-slate-300 text-slate-700 text-sm font-medium bg-white hover:bg-slate-50">
                                                    Quay lại
                                                </Button>
                                                <Button type="submit" className="rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium">
                                                    Cập nhật mật khẩu
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminPageContainer>
    );
}