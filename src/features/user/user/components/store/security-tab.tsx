'use client';

import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, Lock, CheckCircle, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/utils';
import { ChangePasswordForm } from '@/features/system/auth/components/common/change-password-form';

export const SecurityTab: React.FC = () => {
    const [mode, setMode] = useState<'change' | 'forgot'>('change');
    const [step, setStep] = useState<'request' | 'verify'>('request');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form states
    const [email, setEmail] = useState('nguyenvanа@email.com');
    const [otp, setOtp] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
                setMode('change');
                setStep('request');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setOtp('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

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
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="mb-6">
                        <h2 className="tracking-title-lg mb-2">Thay đổi mật khẩu</h2>
                        <p className="subtitle-sm !mt-0 lowercase first-letter:uppercase">Hãy cập nhật mật khẩu định kỳ để bảo vệ tài khoản của bạn.</p>
                    </div>
                    <ChangePasswordForm />
                </div>
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                                            placeholder="Nhập mã OTP 6 số"
                                        />
                                    </div>
                                    <InputField
                                        icon={Lock}
                                        value={newPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                        placeholder="Mật khẩu mới"
                                        showToggle
                                    />
                                    <InputField
                                        icon={Lock}
                                        value={confirmPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                        placeholder="Xác nhận mật khẩu"
                                        showToggle
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

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType; showToggle?: boolean }> = ({ 
    icon: Icon, 
    type = 'password', 
    showToggle = false, 
    ...props 
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';

    return (
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />}
            <input
                type={isPasswordType && showToggle ? (showPassword ? 'text' : 'password') : type}
                className={cn(
                    "w-full py-3 border border-gray-200 bg-white focus:border-brand-green outline-none text-sm tracking-widest transition-all",
                    Icon ? "pl-11" : "px-4",
                    (isPasswordType && showToggle) ? "pr-11" : "pr-4"
                )}
                {...props}
            />
            {isPasswordType && showToggle && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            )}
        </div>
    );
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block tracking-label uppercase font-bold text-gray-900 mb-2">
        {children}
    </label>
);