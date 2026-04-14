'use client';

import React, { useState } from 'react';
import { ArrowLeft, Warehouse, MessageSquare, Save, Edit, X, Trash, Plus, Search } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn-ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/shadcn-ui/popover';
import Link from 'next/link';
import { TransferOrder } from '../../models/transfer-order';
import { TransferOrderItem } from '../../models/transfer-order-item';
import { TransferOrderStatus } from '../../enums/transfer-order-status';
import { MOCK_TRANSFER_ORDERS } from '../../mocks/transfer-order-mocks';
import { MOCK_WAREHOUSES } from '../../../warehouse/mocks/warehouse-mocks';
import { MOCK_PRODUCTS } from '@/features/catalog/product/mocks/product-mocks';
import { ActionType } from '@/shared/constants/action-type';

interface TransferOrderDetailProps {
  id: string;
  action?: string;
}

function SearchableProductSelect({ 
  defaultValue, 
  defaultLabel, 
  onSelect 
}: { 
  defaultValue?: string;
  defaultLabel?: string;
  onSelect: (prod: any) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCode, setSelectedCode] = React.useState(defaultValue || "");

  React.useEffect(() => {
    setSelectedCode(defaultValue || "");
  }, [defaultValue]);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.code?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedProduct = MOCK_PRODUCTS.find(p => p.code === selectedCode);
  const displayLabel = selectedProduct ? selectedProduct.name : (defaultLabel || defaultValue || "Chọn sản phẩm...");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-xs h-9 font-normal border-gray-300 rounded shadow-none">
          <div className="flex flex-col items-start overflow-hidden">
             <span className="truncate w-full font-semibold">{displayLabel}</span>
          </div>
          <Search className="h-3 w-3 opacity-50 ml-2 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 shadow-xl border-gray-200" align="start">
        <div className="p-2 border-b bg-gray-50/50">
           <Input 
              placeholder="Gõ tên hoặc mã sản phẩm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-xs focus:ring-1 focus:ring-brand-green border-gray-200"
              autoFocus
           />
        </div>
        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
           {filteredProducts.length === 0 ? (
             <div className="p-6 text-xs text-center text-gray-500 italic">Không tìm thấy sản phẩm phù hợp</div>
           ) : (
             filteredProducts.map(p => (
               <div 
                 key={p.id}
                 className="p-3 hover:bg-brand-green/5 cursor-pointer flex flex-col border-b border-gray-50 last:border-0 transition-colors"
                 onClick={() => {
                    setSelectedCode(p.code || "");
                    onSelect(p);
                    setOpen(false);
                 }}
               >
                 <span className="text-xs font-bold text-gray-900">{p.name}</span>
                 <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-500 uppercase font-medium bg-gray-100 px-1 rounded">Mã: {p.code}</span>
                    <span className="text-[10px] text-brand-green font-bold italic">{p.unit}</span>
                 </div>
               </div>
             ))
           )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function TransferOrderDetail({ id, action }: TransferOrderDetailProps) {
  const isCreate = action === ActionType.CREATE;
  const isEditing = action === ActionType.CREATE || action === 'edit';

  const mockOrder = isCreate
    ? null
    : MOCK_TRANSFER_ORDERS.find(o => o.id === id);

  const [isEditMode, setIsEditMode] = useState(isEditing);
  const [code, setCode] = useState(mockOrder?.code || '');
  const [sourceWarehouseId, setSourceWarehouseId] = useState(mockOrder?.sourceWarehouseId || '');
  const [destinationWarehouseId, setDestinationWarehouseId] = useState(mockOrder?.destinationWarehouseId || '');
  const [status, setStatus] = useState<TransferOrderStatus>(mockOrder?.status || TransferOrderStatus.PROCESSING);
  const [items, setItems] = useState<TransferOrderItem[]>(mockOrder?.items || []);
  const [notes, setNotes] = useState(mockOrder?.note || '');

  const getWarehouseName = (warehouseId: string) => {
    return MOCK_WAREHOUSES.find(w => w.id === warehouseId)?.name || warehouseId;
  };

  const handleAddItem = () => {
    const newItem: TransferOrderItem = {
      id: `${Date.now()}`,
      productId: '',
      productCode: '',
      productName: '',
      unit: '',
      quantity: 1,
      manufacturerName: '',
      note: '',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const data: TransferOrder = {
      id,
      code,
      sourceWarehouseId,
      destinationWarehouseId,
      status,
      note: notes,
      items,
    };
    console.log(isCreate ? 'Create transfer order:' : 'Update transfer order:', data);
    setIsEditMode(false);
  };

  const updateItem = (index: number, field: keyof TransferOrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase">
            Chi tiết lệnh điều chuyển
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <Button onClick={handleSave} className="rounded admin-btn-primary border-transparent">
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
              <Button variant="outline" onClick={() => setIsEditMode(false)} className="rounded text-gray-700 hover:bg-gray-50">
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(true)} className="rounded text-gray-700 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Link href="/supplychain/transferorder">
                <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Warehouse className="w-4 h-4" />
              <h4 className="text-sm font-medium">Thông tin phiếu</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] w-2/5 font-semibold">Mã phiếu</td>
                  <td className="px-6 py-3">
                    {isEditMode ? (
                      <Input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Tự động sinh"
                        className="h-9 text-sm border-gray-300 rounded"
                      />
                    ) : (
                      code || '---'
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Kho xuất</td>
                  <td className="px-6 py-3">
                    {isEditMode ? (
                      <Select value={sourceWarehouseId} onValueChange={setSourceWarehouseId}>
                        <SelectTrigger className="w-full h-9 text-sm border-gray-300 rounded">
                          <SelectValue placeholder="Chọn kho" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_WAREHOUSES.map(warehouse => (
                            <SelectItem key={warehouse.id} value={warehouse.id || ''}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      sourceWarehouseId ? getWarehouseName(sourceWarehouseId) : '---'
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Kho nhập</td>
                  <td className="px-6 py-3">
                    {isEditMode ? (
                      <Select value={destinationWarehouseId} onValueChange={setDestinationWarehouseId}>
                        <SelectTrigger className="w-full h-9 text-sm border-gray-300 rounded">
                          <SelectValue placeholder="Chọn kho" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_WAREHOUSES.map(warehouse => (
                            <SelectItem key={warehouse.id} value={warehouse.id || ''}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      destinationWarehouseId ? getWarehouseName(destinationWarehouseId) : '---'
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    {isEditMode ? (
                      <Select value={status} onValueChange={(value) => setStatus(value as TransferOrderStatus)}>
                        <SelectTrigger className="w-full h-9 text-sm border-gray-300 rounded">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TransferOrderStatus.PROCESSING}>Đang xử lý</SelectItem>
                          <SelectItem value={TransferOrderStatus.COMPLETED}>Đã xử lý</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${status === TransferOrderStatus.COMPLETED ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                        {status === TransferOrderStatus.COMPLETED ? 'Đã xử lý' : 'Đang xử lý'}
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Items Table */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Warehouse className="w-4 h-4" />
                <h4 className="text-sm font-medium">Sản phẩm điều chuyển</h4>
              </div>
              {isEditMode && (
                <Button
                  onClick={handleAddItem}
                  size="sm"
                  className="admin-btn-primary border-transparent text-xs"
                >
                  + Thêm sản phẩm
                </Button>
              )}
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 admin-table-th text-left text-xs">Sản phẩm</th>
                    <th className="px-4 py-3 w-20 admin-table-th text-left text-xs">ĐV</th>
                    <th className="px-4 py-3 w-16 admin-table-th text-center text-xs">SL</th>
                    <th className="px-4 py-3 admin-table-th text-left text-xs">Nhà SX</th>
                    <th className="px-4 py-3 admin-table-th text-left text-xs">Ghi chú</th>
                    {isEditMode && <th className="px-1 py-3 w-5" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        {isEditMode ? (
                          <div className="min-w-[200px]">
                            <SearchableProductSelect
                              defaultValue={item.productCode}
                              defaultLabel={item.productName}
                              onSelect={(prod) => {
                                updateItem(index, 'productCode', prod.code || '');
                                updateItem(index, 'productName', prod.name);
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="font-semibold text-gray-900">{item.productName}</div>
                            {item.productCode && <div className="text-xs mt-0.5 text-gray-500">Mã: {item.productCode}</div>}
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3">{item.unit || '---'}</td>
                      <td className="px-4 py-3 text-center">
                        {isEditMode ? (
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <span>{item.quantity}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.manufacturerName || ''}
                            onChange={(e) => updateItem(index, 'manufacturerName', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                            placeholder="Nhà SX"
                          />
                        ) : (
                          <span>{item.manufacturerName || '---'}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.note || ''}
                            onChange={(e) => updateItem(index, 'note', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                            placeholder="Ghi chú"
                          />
                        ) : (
                          <span className="text-xs">{item.note || '---'}</span>
                        )}
                      </td>
                      {isEditMode && (
                        <td className="px-1 py-3 text-center">
                          <Button
                            onClick={() => handleRemoveItem(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length === 0 && (
                <div className="py-8 text-center text-gray-500 text-sm">
                  Chưa có sản phẩm {isEditMode ? '- Nhấn "+ Thêm sản phẩm" để bắt đầu' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Ghi chú */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <h4 className="text-sm font-medium">Ghi chú</h4>
            </div>
            <div className="p-6">
              <textarea
                disabled={!isEditMode}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
