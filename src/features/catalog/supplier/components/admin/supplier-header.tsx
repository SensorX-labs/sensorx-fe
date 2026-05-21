'use client';

import { Plus, Search } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';

interface SupplierHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export function SupplierHeader({
  searchTerm,
  onSearchChange,
  onCreateClick,
}: SupplierHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên hoặc mô tả..."
          className="pl-10"
        />
      </div>
      <Button className="admin-btn-primary rounded" onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Tạo nhà cung cấp
      </Button>
    </div>
  );
}
