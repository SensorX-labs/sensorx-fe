'use client';

import React from 'react';
import { UserSearch, Mail, Phone, CheckCircle2, UserCircle } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import { BaseSelectionModal } from './base-selection-modal';
import StaffService, { LoadMoreStaff } from '@/features/user/staff/services/staff.service';

interface SaleStaffSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (staff: LoadMoreStaff) => void;
}

/**
 * Sub-component để hiển thị từng dòng nhân viên
 */
const StaffItemRow = ({
  staff: s,
  onSelect
}: {
  staff: LoadMoreStaff,
  onSelect: (s: LoadMoreStaff) => void
}) => (
  <div
    onClick={() => onSelect(s)}
    className="group bg-white p-4 rounded border border-slate-200/60 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 cursor-pointer transition-all duration-200 flex items-center justify-between w-full"
  >
    <div className="flex items-center gap-4 min-w-0 flex-1">
      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-emerald-100 transition-colors">
        <UserCircle className="w-7 h-7 text-slate-300 group-hover:text-emerald-400 transition-colors" />
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-3 mb-1.5">
          <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{s.name}</h4>
          <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] uppercase font-black tracking-widest px-2 py-0.5 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">{s.code}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5 shrink-0">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 lowercase font-medium">{s.email}</span>
          </div>
          {s.phone && (
            <>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300 shrink-0" />
              <div className="flex items-center gap-1.5 shrink-0">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600">{s.phone}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>

    <div className="shrink-0 pl-4 border-l border-slate-100 group-hover:border-emerald-100 transition-colors flex items-center h-full">
      <Button variant="ghost" className="h-9 px-4 rounded font-black text-[10px] uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
        <CheckCircle2 className="w-4 h-4 mr-2" /> Chọn
      </Button>
    </div>
  </div>
);

export function SaleStaffSelectionDialog({ isOpen, onOpenChange, onSelect }: SaleStaffSelectionDialogProps) {
  return (
    <BaseSelectionModal<LoadMoreStaff>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Chọn nhân viên"
      description="Tìm kiếm nhân viên bán hàng để bàn giao xử lý RFQ"
      searchPlaceholder="Nhập tên, mã nhân viên, email hoặc số điện thoại..."
      icon={UserSearch}
      onSelect={onSelect}
      itemKey={(s) => s.id}
      fetchData={(params) => StaffService.getLoadMoreStaff({ ...params, pageSize: 6, isDescending: true })}
      renderItem={(s, handleSelect) => <StaffItemRow key={s.id} staff={s} onSelect={handleSelect} />}
      emptyTitle="Không tìm thấy nhân viên"
    />
  );
}
