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
      case 'danger': return <Trash2 className="w-6 h-6 text-rose-500" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'info': return <Info className="w-6 h-6 text-blue-500" />;
      default: return <HelpCircle className="w-6 h-6 text-emerald-500" />;
    }
  };

  const getVariantClasses = () => {
    switch (type) {
      case 'danger': return "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500";
      case 'warning': return "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500";
      case 'info': return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
      default: return "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "p-2 rounded-full",
              type === 'danger' && "bg-rose-50",
              type === 'warning' && "bg-amber-50",
              type === 'info' && "bg-blue-50",
              type === 'question' && "bg-emerald-50",
            )}>
              {getIcon()}
            </div>
            <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
          </div>
          {description && (
            <AlertDialogDescription className="text-slate-500 leading-relaxed">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel disabled={loading} className="rounded-lg border-slate-200">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className={cn(
              "rounded-lg font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50",
              getVariantClasses(),
              type === 'danger' && "shadow-rose-500/20",
              type === 'warning' && "shadow-amber-500/20",
              type === 'info' && "shadow-blue-500/20",
              type === 'question' && "shadow-emerald-500/20",
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
