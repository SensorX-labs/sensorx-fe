'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Trash2, Eye, Edit, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
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
import { CustomerService } from '../../services/customer-service';
import { Customer } from '../../models/customer';
import { toast } from 'sonner';

export default function CustomersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const pageSize = 10;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const service = new CustomerService();
      const response = await service.getPagedCustomers({
        pageNumber: currentPage,
        pageSize: pageSize,
        searchTerm: searchTerm
      });
      
      if (response && response.items) {
        setCustomers(response.items);
        setTotalCount(response.totalCount || 0);
      }
    } catch (error: any) {
      console.error('>>> Lỗi khi fetch khách hàng:', error);
      toast.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Reset về trang 1 khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      const service = new CustomerService();
      await service.deleteCustomer(customerToDelete);
      toast.success('Xóa khách hàng thành công');
      fetchCustomers();
    } catch (error: any) {
      console.error('>>> Lỗi khi xóa khách hàng:', error);
      toast.error('Không thể xóa khách hàng');
    } finally {
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setCustomerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const stats = [
    { title: 'Tổng khách hàng', value: totalCount.toString(), icon: Users, color: 'admin-text-primary' },
    { title: 'Hoạt động', value: totalCount.toString(), icon: Users, color: 'text-green-500' },
    { title: 'Không hoạt động', value: '0', icon: Users, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4 border-b border-gray-100 bg-gray-50/30">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã khách hàng, mã số thuế, email, số điện thoại ..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="relative flex-1">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left px-6 py-4 tracking-label uppercase text-[11px] font-bold text-gray-500">Mã</th>
                <th className="text-left px-6 py-4 tracking-label uppercase text-[11px] font-bold text-gray-500">Tên công ty</th>
                <th className="text-left px-6 py-4 tracking-label uppercase text-[11px] font-bold text-gray-500">Email</th>
                <th className="text-left px-6 py-4 tracking-label uppercase text-[11px] font-bold text-gray-500">Điện thoại</th>
                <th className="text-left px-6 py-4 tracking-label uppercase text-[11px] font-bold text-gray-500">Địa chỉ</th>
                <th className="text-center px-6 py-4 tracking-label uppercase text-[11px] font-bold text-gray-500">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold">#{c.code || c.id?.substring(0, 8)}</td>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">{c.email}</td>
                  <td className="px-6 py-4">{c.phoneNumber || '---'}</td>
                  <td className="px-6 py-4 max-w-[200px] truncate">{c.address || '---'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => c.id && confirmDelete(c.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-12 h-12 text-gray-100" />
                      <p>Không tìm thấy khách hàng nào.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <span className="text-sm">
              Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} khách hàng
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = currentPage === pageNum;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 rounded ${isActive ? "bg-[var(--admin-primary)] text-white" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 rounded"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Khách hàng sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCustomer}
              className="bg-red-600 hover:bg-red-700"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
