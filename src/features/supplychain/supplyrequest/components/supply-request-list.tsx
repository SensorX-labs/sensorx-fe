'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ClipboardList,
  Filter,
  Download,
  Eye
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
import { MOCK_SUPPLY_REQUESTS } from '../mocks/supply-request-mocks';
import { SupplyRequestStatus } from '../enums/supply-request-status';
import { MOCK_WAREHOUSES } from '../../warehouse/mocks/warehouse-mocks';

export function SupplyRequestList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRequests = MOCK_SUPPLY_REQUESTS.filter(req => 
    req.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = MOCK_WAREHOUSES.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  const handleEdit = (id: string) => {
    console.log('Edit supply request:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete supply request:', id);
  };

  const handleViewDetails = (id: string) => {
    console.log('View supply request details:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Yêu cầu cấp hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các yêu cầu bổ sung hàng hóa cho kho bãi.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 text-xs border-gray-200">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button className="h-9 text-xs bg-brand-green hover:bg-brand-green/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tạo Yêu Cầu
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Tìm kiếm theo mã yêu cầu hoặc ghi chú..." 
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
              <TableHead className="w-[120px] text-[11px] uppercase tracking-wider font-bold">Mã Yêu Cầu</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-bold">Kho Nhận</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-bold">Ghi chú</TableHead>
              <TableHead className="w-[120px] text-[11px] uppercase tracking-wider font-bold text-center">Số Loại Hàng</TableHead>
              <TableHead className="w-[150px] text-[11px] uppercase tracking-wider font-bold">Trạng thái</TableHead>
              <TableHead className="w-[80px] text-right text-[11px] uppercase tracking-wider font-bold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-xs text-brand-green font-bold uppercase">{req.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-semibold text-gray-700">{getWarehouseName(req.warehouseId)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600 truncate block max-w-[250px]">{req.note || '---'}</span>
                  </TableCell>
                  <TableCell className="text-center text-xs font-medium text-gray-700">
                     {req.items.length} 
                  </TableCell>
                  <TableCell>
                    {req.status === SupplyRequestStatus.COMPLETED ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
                         Đã xử lý
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-yellow-50 text-yellow-700 border border-yellow-100">
                         Chờ xử lý
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                         <DropdownMenuItem onClick={() => handleViewDetails(req.id!)} className="text-xs cursor-pointer">
                          <Eye className="w-3.5 h-3.5 mr-2 text-gray-500" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(req.id!)} className="text-xs cursor-pointer">
                          <Edit className="w-3.5 h-3.5 mr-2 text-gray-500" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(req.id!)} className="text-xs cursor-pointer text-red-600 focus:text-red-700">
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
                <TableCell colSpan={6} className="h-32 text-center text-gray-500 text-xs italic">
                   <div className="flex flex-col items-center justify-center space-y-2">
                       <ClipboardList className="w-8 h-8 text-gray-300" />
                       <p>Không tìm thấy yêu cầu nào.</p>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            Tổng số: {filteredRequests.length} yêu cầu
          </p>
        </div>
      </div>
    </div>
  );
}
