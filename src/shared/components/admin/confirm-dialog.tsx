'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/shadcn-ui/alert-dialog";
import { AlertTriangle, Info, Trash2, HelpCircle } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type ConfirmType = 'danger' | 'warning' | 'info' | 'question';

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = 'question',
  loading = false,
}: ConfirmDialogProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'danger': return <Trash2 className="w-5 h-5 text-rose-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info': return <Info className="w-5 h-5 text-sky-600" />;
      default: return <HelpCircle className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getVariantClasses = () => {
    switch (type) {
      case 'danger': return "bg-rose-500 hover:bg-rose-600 focus:ring-rose-500 shadow-rose-500/20";
      case 'warning': return "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 shadow-amber-500/20";
      case 'info': return "bg-sky-500 hover:bg-sky-600 focus:ring-sky-500 shadow-sky-500/20";
      default: return "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500 shadow-emerald-500/20";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-10 h-10 rounded flex items-center justify-center shrink-0 border",
              type === 'danger' && "bg-rose-50 border-rose-100",
              type === 'warning' && "bg-amber-50 border-amber-100",
              type === 'info' && "bg-sky-50 border-sky-100",
              type === 'question' && "bg-emerald-50 border-emerald-100",
            )}>
              {getIcon()}
            </div>
            <AlertDialogTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">
              {title}
            </AlertDialogTitle>
          </div>
          {description && (
            <AlertDialogDescription className="text-slate-500 leading-relaxed">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel disabled={loading} className="rounded border-slate-200">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className={cn(
              "rounded px-6 font-black uppercase tracking-widest text-[10px] text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 h-10",
              getVariantClasses()
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </div>
            ) : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
