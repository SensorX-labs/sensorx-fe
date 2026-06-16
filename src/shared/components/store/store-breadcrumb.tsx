'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface StoreBreadcrumbProps {
    items: BreadcrumbItem[];
    backLink?: string;
    backLabel?: string;
    showBack?: boolean;
}

export const StoreBreadcrumb: React.FC<StoreBreadcrumbProps> = ({
    items,
    backLink = "/shop",
    backLabel = "Tiếp tục mua sắm",
    showBack = true
}) => {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs tracking-widest font-bold uppercase text-gray-400 overflow-x-auto whitespace-nowrap">
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.href ? (
                                <Link href={item.href} className="hover:text-brand-green transition-all">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-gray-900 border-b border-gray-900 pb-0.5">
                                    {item.label}
                                </span>
                            )}
                            {index < items.length - 1 && <ChevronRight size={14} />}
                        </React.Fragment>
                    ))}
                </div>
                {showBack && (
                    <Link
                        href={backLink}
                        className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-all self-start sm:self-auto"
                    >
                        <ArrowLeft size={16} />
                        {backLabel}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default StoreBreadcrumb;
