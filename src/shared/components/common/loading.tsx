'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';

interface LoadingProps {
    className?: string;
    size?: number;
    label?: string;
}

/**
 * Spinner cơ bản với phong cách SensorX
 */
export const Spinner: React.FC<LoadingProps> = ({ className, size = 24, label }) => (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <Loader2 
            size={size} 
            className="animate-spin text-brand-green opacity-80" 
            strokeWidth={1.5}
        />
        {label && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 animate-pulse">
                {label}
            </span>
        )}
    </div>
);

/**
 * Khung xương (Skeleton) cơ bản
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("animate-pulse bg-gray-100 rounded-sm", className)} />
);

/**
 * Skeleton dành cho danh sách item (RFQ, Product, etc.)
 */
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <div className="space-y-4 w-full">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-48" />
                            <div className="flex gap-8">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-12">
                        <div className="space-y-2">
                            <Skeleton className="h-2 w-16 ml-auto" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

/**
 * Loading toàn màn hình (Full Page Overlay)
 */
export const PageLoading: React.FC = () => (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="relative">
            <div className="w-16 h-16 border-2 border-gray-100 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-t-2 border-brand-green rounded-full animate-spin" />
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">SensorX</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] animate-pulse">
                Đang khởi tạo dữ liệu
            </span>
        </div>
    </div>
);
