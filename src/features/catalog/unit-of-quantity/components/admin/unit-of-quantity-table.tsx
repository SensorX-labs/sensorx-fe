'use client';

import { useState } from 'react';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { UnitOfQuantity } from '../../models';
import { UnitOfQuantityDeleteDialog } from './unit-of-quantity-delete-dialog';

interface UnitOfQuantityTableProps {
  loading: boolean;
  units: UnitOfQuantity[];
  onEdit: (unit: UnitOfQuantity) => void;
  onRefresh: () => void;
}

export function UnitOfQuantityTable({
  loading,
  units,
  onEdit,
  onRefresh,
}: UnitOfQuantityTableProps) {
  const [deletingUnit, setDeletingUnit] = useState<UnitOfQuantity | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteClick = (unit: UnitOfQuantity) => {
    setDeletingUnit(unit);
    setIsDeleteOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Tên đơn vị tính
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Mô tả
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Ngày tạo
            </th>
            <th className="w-32 px-6 py-4 text-center"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : units.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                Không tìm thấy đơn vị tính nào
              </td>
            </tr>
          ) : (
            units.map(unit => (
              <tr key={unit.id} className="group hover:bg-slate-50/80">
                <td className="px-6 py-4 font-bold text-slate-900">{unit.name}</td>
                <td className="max-w-md px-6 py-4 text-slate-500">
                  {unit.description?.trim() || (
                    <span className="italic text-slate-350">Chưa có mô tả</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                  {new Date(unit.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => onEdit(unit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => handleDeleteClick(unit)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <UnitOfQuantityDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        unitId={deletingUnit?.id ?? null}
        unitName={deletingUnit?.name ?? null}
        onSuccess={() => {
          setIsDeleteOpen(false);
          onRefresh();
        }}
      />
    </div>
  );
}
