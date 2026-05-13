'use client';

import React, { useState } from 'react';
import { Mail, ShieldCheck, Lock, CheckCircle, KeyRound, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils';

export const SecurityTab: React.FC = () => {
    const [mode, setMode] = useState<'change' | 'forgot'>('change');
    const [step, setStep] = useState<'request' | 'verify'>('request');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('nguyenvanа@email.com');
    const [otp, setOtp] = useState('');

    const handleSendCode = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('verify');
        }, 800);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 1000);
    };

    const resetStates = () => {
        setIsSuccess(false);
        setStep('request');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
    };

    // Common components to reduce repetition
    const InputField = ({ icon: Icon, type = 'password', ...props }: any) => (
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />}
            <input
                type={type}
                className={cn(
                    "w-full py-3 border border-gray-200 bg-white focus:border-brand-green outline-none text-sm tracking-widest transition-all",
                    Icon ? "pl-11 pr-4" : "px-4"
                )}
                {...props}
            />
        </div>
    );

    const Label = ({ children }: { children: React.ReactNode }) => (
        <label className="block tracking-label uppercase font-bold text-gray-900 mb-2">
            {children}
        </label>
    );

    if (isSuccess) {
        return (
            <div className="bg-white border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6 rounded-full">
                    <CheckCircle className="text-brand-green w-8 h-8" />
                </div>
                <h2 className="tracking-title-lg mb-2">Cập nhật thành công</h2>
                <p className="meta-label text-gray-500 mb-8 lowercase first-letter:uppercase">
                    {mode === 'change' ? 'Mật khẩu của bạn đã được thay đổi thành công.' : 'Mật khẩu mới của bạn đã có hiệu lực. Hãy sử dụng nó cho các lần đăng nhập sau.'}
                </p>
                <button
                    onClick={resetStates}
                    className="btn-tracking inline-flex items-center gap-2 px-8 py-3 bg-brand-green text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-brand-green-hover hover:shadow-lg"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 p-8 max-w-2xl mx-auto min-h-[500px]">
            <div className="flex gap-8 border-b border-gray-100 mb-10">
                <button
                    onClick={() => { setMode('change'); resetStates(); }}
                    className={cn(
                        "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                        mode === 'change' ? "text-brand-green" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Đổi mật khẩu
                    {mode === 'change' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-brand-green" />}
                </button>
                <button
                    onClick={() => { setMode('forgot'); resetStates(); }}
                    className={cn(
                        "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                        mode === 'forgot' ? "text-brand-green" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Tôi quên mật khẩu
                    {mode === 'forgot' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-brand-green" />}
                </button>
            </div>

            {mode === 'change' ? (
                <form onSubmit={handleUpdatePassword} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="mb-6">
                        <h2 className="tracking-title-lg mb-2">Thay đổi mật khẩu</h2>
                        <p className="subtitle-sm !mt-0 lowercase first-letter:uppercase">Hãy cập nhật mật khẩu định kỳ để bảo vệ tài khoản của bạn.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Label>Mật khẩu hiện tại</Label>
                            <InputField
                                icon={Lock}
                                required
                                value={currentPassword}
                                onChange={(e: any) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <Label>Mật khẩu mới</Label>
                            <InputField
                                icon={KeyRound}
                                required
                                value={newPassword}
                                onChange={(e: any) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <Label>Xác nhận mật khẩu mới</Label>
                            <InputField
                                icon={ShieldCheck}
                                required
                                value={confirmPassword}
                                onChange={(e: any) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                        className="btn-tracking w-full py-4 bg-brand-green text-white text-[10px] font-bold uppercase transition-all hover:bg-brand-green-hover disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="meta-label text-red-500 flex items-center gap-2">
                            <AlertCircle size={14} /> Mật khẩu xác nhận không khớp
                        </p>
                    )}
                </form>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="mb-10">
                        <h2 className="tracking-title-lg mb-2">Quên mật khẩu</h2>
                        <p className="subtitle-sm !mt-0 lowercase first-letter:uppercase">Lấy lại quyền truy cập tài khoản bằng cách xác thực qua Email.</p>
                    </div>

                    <div className="space-y-8">
                        <div className={cn("space-y-4 transition-all duration-500", step === 'verify' && "pb-6 border-b border-gray-100")}>
                            <Label>1. Nhập Email khôi phục</Label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <InputField
                                        type="email"
                                        value={email}
                                        onChange={(e: any) => setEmail(e.target.value)}
                                        disabled={step === 'verify'}
                                        placeholder="Email của bạn"
                                    />
                                </div>
                                {step === 'request' && (
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        disabled={isLoading || !email}
                                        className="btn-tracking px-6 bg-brand-green text-white text-[10px] items-center flex gap-2 uppercase transition-all hover:bg-brand-green-hover"
                                    >
                                        {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                                    </button>
                                )}
                                {step === 'verify' && (
                                    <button
                                        type="button"
                                        onClick={() => setStep('request')}
                                        className="tracking-label text-brand-green hover:underline uppercase font-bold"
                                    >
                                        Thay đổi
                                    </button>
                                )}
                            </div>
                        </div>

                        <form 
                            onSubmit={handleUpdatePassword}
                            className={cn(
                                "space-y-8 transition-all overflow-hidden",
                                step === 'request' ? "max-h-0 pointer-events-none opacity-0" : "max-h-[600px] opacity-100"
                            )}
                        >
                            <div className="space-y-4">
                                <Label>2. Xác thực & Thiết lập mật khẩu mới</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <InputField
                                            icon={ShieldCheck}
                                            type="text"
                                            value={otp}
                                            onChange={(e: any) => setOtp(e.target.value)}
                                            placeholder="Nhập mã OTP 6 số"
                                        />
                                    </div>
                                    <InputField
                                        icon={Lock}
                                        value={newPassword}
                                        onChange={(e: any) => setNewPassword(e.target.value)}
                                        placeholder="Mật khẩu mới"
                                    />
                                    <InputField
                                        icon={Lock}
                                        value={confirmPassword}
                                        onChange={(e: any) => setConfirmPassword(e.target.value)}
                                        placeholder="Xác nhận mật khẩu"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.length < 4 || !newPassword || newPassword !== confirmPassword}
                                className="btn-tracking w-full py-4 bg-brand-green text-white text-[10px] font-bold uppercase transition-all hover:bg-brand-green-hover disabled:bg-gray-200 disabled:text-gray-400"
                            >
                                {isLoading ? 'Đang thực hiện...' : 'Khôi phục mật khẩu'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
