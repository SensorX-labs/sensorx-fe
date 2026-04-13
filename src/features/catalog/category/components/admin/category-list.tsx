'use client';

import React, { useState } from 'react';
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical,
  ChevronRight,
  Package
} from 'lucide-react';
import { MOCK_CATEGORIES } from '../../mocks/category-mocks';
import { ProductCategory } from '../../models/product-category';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/shadcn-ui/dialog";
import { Input } from "@/shared/components/shadcn-ui/input";



export default function CategoryList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreate = () => {
    // Logic xử lý tạo mới ở đây
    console.log('Creating category:', newCategoryName);
    setIsModalOpen(false);
    setNewCategoryName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-4">
        <Button 
          className="admin-btn-primary flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <FolderTree className="w-4 h-4" />
          Tạo danh mục
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="tracking-title text-xl">Tạo danh mục mới</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="tracking-label">Tên danh mục</label>
              <Input 
                placeholder="Nhập tên danh mục..." 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="focus-visible:ring-blue-500/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded text-sm font-semibold" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button className="admin-btn-primary" onClick={handleCreate}>Tạo mới</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white rounded">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 admin-table-th">Tên danh mục</th>
                <th className="text-left px-6 py-3 admin-table-th">Mô tả</th>
                <th className="text-center px-6 py-3 admin-table-th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CATEGORIES.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-admin-surface transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold admin-text-primary">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {cat.description}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
