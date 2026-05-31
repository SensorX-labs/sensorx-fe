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
        <div className="group font-sans">
            <label className="block text-[10px] font-sans font-bold uppercase text-slate-500 mb-2 tracking-wider">{label}</label>
            {isEditing ? (
                <div className="relative group">
                    {icon && (
                        <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-secondary transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        type="text"
                        value={value || ''}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={cn(
                            "w-full bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 py-3.5 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all rounded-xl shadow-sm",
                            icon ? "pl-12 pr-4" : "px-4"
                        )}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-zinc-900/50 border border-stone-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow transition-all duration-300">
                    {icon && <div className="text-stone-400 dark:text-zinc-550 shrink-0">{icon}</div>}
                    <p className="text-sm font-semibold text-stone-900 dark:text-gray-150">{value || '—'}</p>
                </div>
            )}
        </div>
    );
};
