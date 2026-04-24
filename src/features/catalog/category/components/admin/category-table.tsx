import React from 'react';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Category } from '../../../models/category-model';
import { HighlightText } from './category-utils';

interface CategoryTableProps {
  loading: boolean;
  categories: Category[];
  searchTerm: string;
  matchingIds: string[];
  currentMatchIndex: number;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryTable({
  loading,
  categories,
  searchTerm,
  matchingIds,
  currentMatchIndex,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
            <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px]">Tên danh mục</th>
            <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px]">Danh mục cha</th>
            <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px]">Mô tả</th>
            <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px]">Ngày tạo</th>
            <th className="px-6 py-4 tracking-label uppercase font-semibold text-center w-32"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                Không tìm thấy danh mục nào
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-900">
                  <HighlightText
                    text={cat.name}
                    highlight={searchTerm}
                    isActive={matchingIds[currentMatchIndex] === cat.id}
                  />
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {cat.parentName ? (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium border border-blue-100">
                      {cat.parentName}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Gốc</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                  <HighlightText
                    text={cat.description || '-'}
                    highlight={searchTerm}
                    isActive={matchingIds[currentMatchIndex] === cat.id}
                  />
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {new Date(cat.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => onEdit(cat)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(cat.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
