'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Warehouse as WarehouseIcon,
  Filter,
  Download
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/components/shadcn-ui/table";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn-ui/dropdown-menu";
import { MOCK_WAREHOUSES } from '../mocks/warehouse-mocks';

export function WarehouseList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredWarehouses = MOCK_WAREHOUSES.filter(wh => 
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log('Edit warehouse:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete warehouse:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý Kho Bãi</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh mục các kho bãi trong hệ thống cung ứng.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 text-xs border-gray-200">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button className="h-9 text-xs bg-brand-green hover:bg-brand-green/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Kho Mới
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Tìm kiếm kho bãi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs border-gray-200 focus:ring-brand-green"
            />
          </div>
          <Button variant="ghost" className="h-9 px-3 text-gray-500">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[100px] text-[11px] uppercase tracking-wider font-bold">Mã Kho</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-bold">Tên Kho</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-bold">Trạng thái</TableHead>
              <TableHead className="w-[80px] text-right text-[11px] uppercase tracking-wider font-bold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWarehouses.length > 0 ? (
              filteredWarehouses.map((wh) => (
                <TableRow key={wh.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-xs text-gray-900 uppercase">{wh.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-brand-green/10 flex items-center justify-center text-brand-green">
                        <WarehouseIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{wh.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-100">
                      Đang hoạt động
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleEdit(wh.id!)} className="text-xs cursor-pointer">
                          <Edit className="w-3.5 h-3.5 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(wh.id!)} className="text-xs cursor-pointer text-red-600 focus:text-red-700">
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-500 text-xs italic">
                  Không tìm thấy kho bãi nào phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            Tổng số: {filteredWarehouses.length} kho bãi
          </p>
        </div>
      </div>
    </div>
  );
}
