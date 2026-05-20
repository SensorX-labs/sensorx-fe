'use client';

import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, ClipboardList } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn-ui/popover';
import { Calendar } from '@/shared/components/shadcn-ui/calendar';
import { statusColor, statusLabel } from './constants';

interface GeneralInfoCardProps {
  code?: string;
  status?: string;
  quoteDate: Date;
  onDateChange?: (date: Date) => void;
  disabled?: boolean;
}

export function GeneralInfoCard({
  code,
  status,
  quoteDate,
  onDateChange,
  disabled = false,
}: GeneralInfoCardProps) {
  return (
    <div className="border border-gray-200 bg-white rounded">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
        <ClipboardList size={16} className="text-gray-400" />
        <h4 className="text-sm font-medium text-gray-900">Thông tin chung</h4>
      </div>
      <div className="p-6 space-y-5">
        {code && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Mã báo giá</label>
            <p className="text-sm font-bold text-gray-900 tracking-tight">{code || '—'}</p>
          </div>
        )}
        {status && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Trạng thái</label>
            <div>
              <span className={cn("px-2.5 py-1 rounded border text-xs font-bold uppercase", statusColor[status] || 'bg-gray-100 text-gray-600 border-gray-200')}>
                {statusLabel[status] || status}
              </span>
            </div>
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500">Ngày báo giá</label>
          {disabled ? (
            <p className="text-sm font-medium text-gray-900">
              {quoteDate ? format(quoteDate, "dd/MM/yyyy", { locale: vi }) : '—'}
            </p>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-10 border-gray-200 rounded disabled:opacity-100", !quoteDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  {quoteDate ? format(quoteDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={quoteDate}
                  onSelect={(date) => date && onDateChange?.(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}
