import React from 'react';
import { cn } from '@/shared/utils';

interface FormFieldProps {
    label: string;
    value: string | null | undefined;
    isEditing: boolean;
    onChange: (val: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}

export function FormField({
    label,
    value,
    isEditing,
    onChange,
    placeholder,
    icon
}: FormFieldProps) {
    return (
        <div className="group">
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-wider">{label}</label>
            {isEditing ? (
                <div className="relative group">
                    {icon && (
                        <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        type="text"
                        value={value || ''}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={cn(
                            "w-full bg-white border border-slate-200 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all",
                            icon ? "pl-12 pr-4" : "px-4"
                        )}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-50 border border-slate-100">
                    {icon && <div className="text-slate-400">{icon}</div>}
                    <p className="text-sm font-bold text-slate-900">{value || '—'}</p>
                </div>
            )}
        </div>
    );
};
