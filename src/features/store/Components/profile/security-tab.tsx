'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle, KeyRound, AlertCircle, Eye, EyeOff, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/shared/utils';

export const SecurityTab: React.FC = () => {
    const [mode, setMode] = useState<'change' | 'forgot'>('change');
    const [step, setStep] = useState<'request' | 'verify'>('request');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPass, setShowPass] = useState(false);

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

    if (isSuccess) {
        return (
            <div className="bg-white border border-gray-200 p-12 flex flex-col items-center justify-center text-center min-h-[500px] animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="text-green-600 w-10 h-10" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-2">Cập nhật thành công</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest max-w-xs leading-loose">
                    Mật khẩu của bạn đã được thay đổi. Hệ thống sẽ tự động quay lại trang bảo mật sau vài giây.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 overflow-hidden min-h-[600px]">
            {/* Tab Header */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => { setMode('change'); setStep('request'); }}
                    className={cn(
                        "flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative",
                        mode === 'change' ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Đổi mật khẩu
                    {mode === 'change' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 animate-in slide-in-from-left duration-300" />}
                </button>
                <button
                    onClick={() => { setMode('forgot'); setStep('request'); }}
                    className={cn(
                        "flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative",
                        mode === 'forgot' ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Quên mật khẩu
                    {mode === 'forgot' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 animate-in slide-in-from-right duration-300" />}
                </button>
            </div>

            <div className="p-10 max-w-md mx-auto">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                        {mode === 'change' ? <Lock className="text-gray-300 w-6 h-6" /> : <Mail className="text-gray-300 w-6 h-6" />}
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-2">
                        {mode === 'change' ? 'Thay đổi mật khẩu' : step === 'request' ? 'Khôi phục mật khẩu' : 'Xác minh OTP'}
                    </h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-loose">
                        {mode === 'change' 
                            ? 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để cập nhật.' 
                            : step === 'request' 
                                ? 'Chúng tôi sẽ gửi mã xác minh đến email của bạn.' 
                                : `Mã xác minh đã được gửi đến ${email.replace(/(.{3}).*(@.*)/, "$1...$2")}`}
                    </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    {mode === 'change' ? (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Mật khẩu hiện tại</label>
                                <div className="relative">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all text-xs tracking-widest"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                                    >
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all text-xs tracking-widest"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all text-xs tracking-widest"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        step === 'request' ? (
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Địa chỉ Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all text-xs tracking-widest"
                                        placeholder="your@email.com"
                                        required
                                    />
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200" size={16} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Mã xác minh (OTP)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-10 py-4 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all text-2xl font-light tracking-[0.5em] text-center"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                    />
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200" size={18} />
                                </div>
                                <button type="button" className="text-[9px] font-bold uppercase tracking-widest text-brand-green mt-2 block mx-auto hover:underline">
                                    Gửi lại mã xác minh
                                </button>
                            </div>
                        )
                    )}

                    <button
                        type={mode === 'change' || (mode === 'forgot' && step === 'verify') ? "submit" : "button"}
                        onClick={mode === 'forgot' && step === 'request' ? handleSendCode : undefined}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50"
                    >
                        {isLoading ? (
                            <RefreshCw className="animate-spin" size={16} />
                        ) : (
                            <>
                                <span>{mode === 'change' ? 'Cập nhật mật khẩu' : step === 'request' ? 'Gửi mã xác minh' : 'Xác minh & Tiếp tục'}</span>
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 flex items-start gap-4 p-4 bg-gray-50 border border-gray-100">
                    <ShieldCheck className="text-brand-green flex-shrink-0" size={18} />
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900">Bảo mật tài khoản</p>
                        <p className="text-[9px] leading-relaxed text-gray-400 uppercase tracking-widest">
                            SensorX khuyến nghị sử dụng mật khẩu mạnh bao gồm chữ hoa, chữ thường và ký số.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};