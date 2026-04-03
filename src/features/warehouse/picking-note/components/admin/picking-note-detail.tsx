'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ActionType } from '@/shared/constants/action-type';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Plus, 
  Warehouse, 
  Calendar, 
  User, 
  Package,
  FileText,
  Info
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import Link from 'next/link';

interface LineItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  notes: string;
}

interface PickingNoteData {
  id: string;
  code: string;
  date: string;
  createdBy: string;
  warehouse: string;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  items: LineItem[];
  createdAt: string;
  updatedAt: string;
}

interface PickingNoteDetailProps {
  id: string;
  initialData?: PickingNoteData;
}

const statusColor: Record<string, string> = {
  'draft': 'bg-gray-50 text-gray-700 border-gray-200',
  'confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
  'completed': 'bg-green-50 text-green-700 border-green-200',
  'cancelled': 'bg-red-50 text-red-700 border-red-200',
};

const statusLabel: Record<string, string> = {
  'draft': 'Nháp',
  'confirmed': 'Xác nhận',
  'completed': 'Hoàn thành',
  'cancelled': 'Đã hủy',
};

export function PickingNoteDetail({ id, initialData }: PickingNoteDetailProps) {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');
  
  const isCreate = actionParam === ActionType.CREATE;
  
  const defaultData: PickingNoteData = {
    id: '',
    code: '',
    date: new Date().toISOString().split('T')[0],
    createdBy: '-----',
    warehouse: '',
    status: 'draft',
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [action, setAction] = useState<ActionType>(
    (actionParam as ActionType) || ActionType.DETAIL
  );

  const [formData, setFormData] = useState<PickingNoteData>(initialData || defaultData);

  useEffect(() => {
    if (!isCreate) {
      if (actionParam === ActionType.UPDATE) setAction(ActionType.UPDATE);
      else setAction(ActionType.DETAIL);
    }
  }, [actionParam, isCreate]);

  const isEditing = action === ActionType.CREATE || action === ActionType.UPDATE;

  const handleSave = () => {
    setAction(ActionType.DETAIL);
  };

  const handleCancel = () => {
    if (action === ActionType.CREATE) {
      window.history.back();
    } else {
      setFormData(initialData || defaultData);
      setAction(ActionType.DETAIL);
    }
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      productCode: '',
      productName: '',
      quantity: 1,
      notes: ''
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const removeItem = (itemId: string) => {
    setFormData({ ...formData, items: formData.items.filter(i => i.id !== itemId) });
  };

  const updateItem = (itemId: string, field: keyof LineItem, value: any) => {
    setFormData({
      ...formData,
      items: formData.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
    });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header section - Clean & Simple */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold admin-title uppercase">
            {action === ActionType.CREATE ? 'Tạo phiếu soạn kho' : action === ActionType.UPDATE ? 'Chỉnh sửa phiếu soạn kho' : 'Chi tiết phiếu soạn kho'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" className="rounded admin-btn-primary border-transparent" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
              {action !== ActionType.CREATE && (
                <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              )}
            </>
          ) : (
            <>
              {formData.status === 'draft' && (
                <>
                  <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50" onClick={() => setAction(ActionType.UPDATE)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button variant="outline" className="rounded text-red-600 hover:bg-red-50 border-red-200">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </Button>
                </>
              )}
            </>
          )}
          <Link href="/warehouse/picking-note">
            <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: General Info - Following Product Detail style */}
        <div className="md:col-span-1 space-y-6">
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
               <Info className="w-4 h-4 text-gray-400" />
               <h4 className="text-sm font-medium text-gray-900">Thông tin cơ bản</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã phiếu</td>
                  <td className="px-6 py-3">
                    <span className="text-gray-900 font-medium">{formData.code || (isCreate ? 'Auto-generated' : id)}</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Kho hàng</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <select 
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--brand-green-500)]"
                        value={formData.warehouse}
                        onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                      >
                         <option value="">-- Chọn kho --</option>
                         <option value="Kho 1">Kho 1</option>
                         <option value="Kho 2">Kho 2</option>
                      </select>
                    ) : (
                      <span className="text-gray-900 font-medium">{formData.warehouse || '--'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Ngày soạn</td>
                  <td className="px-6 py-3">
                     {isEditing ? (
                       <input 
                         type="date"
                         className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--brand-green-500)]"
                         value={formData.date}
                         onChange={(e) => setFormData({...formData, date: e.target.value})}
                       />
                     ) : (
                        <span className="text-gray-900 font-medium">{new Date(formData.date).toLocaleDateString('vi-VN')}</span>
                     )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Người lập</td>
                  <td className="px-6 py-3">
                    <span className="text-gray-900 font-medium">{formData.createdBy}</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-0.5 rounded border text-xs font-medium ${statusColor[formData.status]}`}>
                      {statusLabel[formData.status]}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Line Items - Following Product Detail Reference style */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <h4 className="text-base font-medium text-gray-900">Danh sách hàng hóa</h4>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addItem} className="rounded admin-btn-primary border-transparent h-8">
                  <Plus className="w-4 h-4 mr-1" /> Thêm hàng
                </Button>
              )}
            </div>
            <div className="p-0">
              {formData.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">Mã SP</th>
                        <th className="px-6 py-3 font-medium">Tên SP</th>
                        <th className="px-6 py-3 font-medium text-right w-[100px]">Số lượng</th>
                        {isEditing && <th className="px-6 py-3 font-medium text-center w-[80px]">Xóa</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3">
                            {isEditing ? (
                              <input 
                                className="w-full border-gray-200 border rounded p-1 text-sm focus:border-[var(--brand-green-500)] outline-none"
                                value={item.productCode}
                                onChange={(e) => updateItem(item.id, 'productCode', e.target.value)}
                              />
                            ) : (
                               <span className="font-semibold admin-text-primary">{item.productCode}</span>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            {isEditing ? (
                              <input 
                                className="w-full border-gray-200 border rounded p-1 text-sm focus:border-[var(--brand-green-500)] outline-none"
                                value={item.productName}
                                onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                              />
                            ) : (
                               <span className="text-gray-900">{item.productName}</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-right">
                            {isEditing ? (
                               <input 
                                 type="number"
                                 className="w-full border-gray-200 border rounded p-1 text-sm text-right focus:border-[var(--brand-green-500)] outline-none"
                                 value={item.quantity}
                                 onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                               />
                            ) : (
                               <span className="font-bold text-gray-900">{item.quantity}</span>
                            )}
                          </td>
                          {isEditing && (
                            <td className="px-6 py-3 text-center">
                               <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-red-400 hover:text-red-600 rounded">
                                  <Trash2 className="w-4 h-4" />
                               </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-10">
                     <p className="text-xs font-bold text-gray-500 uppercase">
                        Sản phẩm: <span className="text-gray-900 ml-1">{formData.items.length}</span>
                     </p>
                     <p className="text-xs font-bold text-gray-500 uppercase">
                        Tổng lượng: <span className="text-[var(--brand-green-600)] ml-1">{formData.items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                     </p>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400 italic">
                   Chưa có hàng hóa trong danh sách
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}