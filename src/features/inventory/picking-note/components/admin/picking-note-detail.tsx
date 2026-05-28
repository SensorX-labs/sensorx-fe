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
import { PickingNoteService } from '../../services/picking-note-service';
import { toast } from 'sonner';
import { Loader2, Search } from 'lucide-react';
import { ProductService } from '@/features/catalog/product/services/product-service';
import { ProductLoadMoreForModal } from '@/features/catalog/product/models/product-load-more';
import StockOutService from '@/features/inventory/stockout/services/stock-out-service';
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import { Input } from '@/shared/components/shadcn-ui/input';
import Cookies from 'js-cookie';

interface LineItem {
  id: string; // Temp frontend ID
  productId?: string; // Backend Guid
  productCode: string;
  productName: string;
  unit?: string;
  manufactureName?: string;
  quantity: number;
  notes: string;
}

interface PickingNoteData {
  id: string;
  code: string;
  date: string;
  createdBy: string;
  warehouse: string;
  warehouseId?: string;
  status: 'Pending' | 'Picking' | 'Completed' | 'Canceled' | 'Cancelled' | 'draft' | 'confirmed' | 'completed' | 'cancelled';
  items: LineItem[];
  createdAt: string;
  updatedAt: string;
  transferOrderCode?: string;
  linkedTransferOrderId?: string;
}

interface PickingNoteDetailProps {
  id: string;
  initialData?: PickingNoteData;
}

const statusColor: Record<string, string> = {
  'Pending': 'bg-gray-50 text-gray-700 border-gray-200',
  'Picking': 'bg-blue-50 text-blue-700 border-blue-200',
  'Completed': 'bg-green-50 text-green-700 border-green-200',
  'Canceled': 'bg-red-50 text-red-700 border-red-200',
  'Cancelled': 'bg-red-50 text-red-700 border-red-200',
  'draft': 'bg-gray-50 text-gray-700 border-gray-200',
  'confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
  'completed': 'bg-green-50 text-green-700 border-green-200',
  'cancelled': 'bg-red-50 text-red-700 border-red-200',
};

const statusLabel: Record<string, string> = {
  'Pending': 'Chờ xử lý',
  'Picking': 'Đang soạn hàng',
  'Completed': 'Hoàn thành',
  'Canceled': 'Đã hủy',
  'Cancelled': 'Đã hủy',
  'draft': 'Nháp',
  'confirmed': 'Xác nhận',
  'completed': 'Hoàn thành',
  'cancelled': 'Đã hủy',
};

function SearchableProductSelect({ defaultValue, defaultLabel, onSelect }: { defaultValue?: string, defaultLabel?: string, onSelect: (prod: any) => void }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<ProductLoadMoreForModal[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

  const fetchProducts = React.useCallback(async (term: string) => {
    setLoading(true);
    try {
      const result = await ProductService.getLoadMore({
        searchTerm: term,
        pageSize: 10,
        sortByName: true,
        isDescending: false,
      });
      setProducts(result.items || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      fetchProducts(searchTerm);
    }
  }, [open, searchTerm, fetchProducts]);

  const displayLabel = selectedProduct ? selectedProduct.name : (defaultLabel || defaultValue || "Chọn sản phẩm...");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-xs h-9 font-normal border-gray-300 rounded shadow-none">
          <div className="flex flex-col items-start overflow-hidden text-left">
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
          {loading ? (
            <div className="p-6 text-xs text-center text-gray-500">Đang tải...</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-xs text-center text-gray-500 italic">Không tìm thấy sản phẩm phù hợp</div>
          ) : (
            products.map(p => (
              <div
                key={p.id}
                className="p-3 hover:bg-brand-green/5 cursor-pointer flex flex-col border-b border-gray-50 last:border-0 transition-colors"
                onClick={() => {
                  setSelectedProduct(p);
                  onSelect(p);
                  setOpen(false);
                }}
              >
                <span className="text-xs font-bold text-gray-900">{p.name}</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-500 uppercase font-medium bg-gray-100 px-1 rounded">Mã: {p.code}</span>
                  <span className="text-[10px] text-brand-green font-bold italic">{p.supplierName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function PickingNoteDetail({ id, initialData }: PickingNoteDetailProps) {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');

  const isCreate = actionParam === ActionType.CREATE;
  const [loading, setLoading] = useState(false);
  const [stockOutLoading, setStockOutLoading] = useState(false);
  const [stockOutNote, setStockOutNote] = useState("");

  const [formData, setFormData] = useState<PickingNoteData>(initialData || {
    id: '',
    code: '',
    date: new Date().toISOString(),
    createdBy: '',
    warehouse: '',
    status: 'Pending' as any,
    items: [],
    createdAt: '',
    updatedAt: '',
  });

  const [action, setAction] = useState<ActionType>(
    (actionParam as ActionType) || ActionType.DETAIL
  );

  useEffect(() => {
    if (id && !isCreate) {
      setLoading(true);
      PickingNoteService.getById(id)
        .then(data => {
          if (data) {
            setFormData({
              id: data.id,
              code: data.code,
              date: data.createdAt,
              createdBy: 'Admin',
              warehouse: 'Kho chính', // Mock for now if not in DTO
              warehouseId: data.warehouseId,
              status: data.status as any,
              items: data.items.map((i: any) => ({
                id: i.productId,
                productCode: i.productCode,
                productName: i.productName,
                unit: i.unit,
                manufactureName: i.manufactureName,
                quantity: i.quantity,
                notes: i.note
              })),
              createdAt: data.createdAt,
              updatedAt: data.createdAt,
              transferOrderCode: data.transferOrderCode,
              linkedTransferOrderId: data.linkedTransferOrderId
            });
          }
        })
        .catch(err => {
          toast.error("Không thể tải thông tin phiếu soạn kho");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isCreate]);

  useEffect(() => {
    if (formData.status === "Completed" && formData.code && !stockOutNote) {
      setStockOutNote(formData.code);
    }
  }, [formData.status, formData.code, stockOutNote]);

  const handleStartPicking = async () => {
    try {
      await PickingNoteService.startPicking(id);
      toast.success("Đã bắt đầu soạn hàng");
      window.location.reload();
    } catch (error) {
      // The Axios interceptor already displays the error toast.
      console.error("Start picking error:", error);
    }
  };

  const handleCreateSupplyRequest = () => {
    const warehouseId = formData.warehouseId || Cookies.get('warehouseId') || '';
    const itemsShortage = formData.items.map(item => ({
      productId: item.id,
      productCode: item.productCode,
      productName: item.productName,
      requiredQuantity: item.quantity
    }));
    
    window.location.href = `/warehouse/supply-requests/new?pickingNoteId=${id}&pickingNoteCode=${formData.code}&warehouseId=${warehouseId}&items=${encodeURIComponent(JSON.stringify(itemsShortage))}`;
  };

  const handleCompletePicking = async () => {
    try {
      await PickingNoteService.completePicking(id);
      toast.success("Đã hoàn thành soạn hàng");
      window.location.reload();
    } catch (error) {
      toast.error("Lỗi khi hoàn thành soạn hàng");
    }
  };

  const handleCreateStockOut = async () => {
    setStockOutLoading(true);
    try {
      await StockOutService.create(id, stockOutNote);
      toast.success("Tạo phiếu xuất kho thành công!");
      window.location.href = "/warehouse/stockout";
    } catch (error) {
      console.error("Error creating stock out:", error);
      toast.error("Không thể tạo phiếu xuất kho hoặc phiếu đã được xuất");
    } finally {
      setStockOutLoading(false);
    }
  };

  const handleCancelPicking = async () => {
    try {
      await PickingNoteService.cancelPicking(id, "Người dùng hủy");
      toast.success("Đã hủy phiếu soạn hàng");
      window.location.reload();
    } catch (error) {
      toast.error("Lỗi khi hủy phiếu soạn hàng");
    }
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: 'temp_' + Date.now().toString(),
      productCode: '',
      productName: '',
      quantity: 1,
      notes: ''
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };

  const removeItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setFormData({
      ...formData,
      items: formData.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const handleSave = async () => {
    try {
      if (action === ActionType.CREATE) {
        const payload = {
          documentType: "Manual",
          description: "Tạo thủ công",
          deliveryInfo: {
            receiverName: "N/A",
            receiverPhone: "N/A",
            deliveryAddress: "N/A",
            companyName: "N/A",
            taxCode: "N/A"
          },
          items: formData.items
            .filter(item => item.productId)
            .map(item => ({
              productId: item.productId,
              productCode: item.productCode,
              productName: item.productName,
              unit: item.unit || "Cái",
              quantity: item.quantity,
              manufactureName: item.manufactureName || "N/A",
              note: item.notes
            }))
        };
        await PickingNoteService.createPickingNote(payload);
        toast.success("Tạo phiếu soạn hàng thành công");
        window.location.href = "/warehouse/picking-note";
      }
    } catch (error) {
      toast.error("Lỗi khi lưu phiếu soạn hàng");
    }
  };

  const isEditing = action === ActionType.CREATE || action === ActionType.UPDATE;

  return (
    <div className="space-y-6 w-full relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      )}
      {/* Header section - Clean & Simple */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold admin-title uppercase">
            {action === ActionType.CREATE ? 'Tạo phiếu soạn kho' : action === ActionType.UPDATE ? 'Chỉnh sửa phiếu soạn kho' : 'Chi tiết phiếu soạn kho'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              {formData.status === 'Pending' && (
                <>
                  <Button onClick={handleStartPicking} className="bg-blue-600 hover:bg-blue-700 text-white rounded">
                    Bắt đầu soạn
                  </Button>
                  <Button onClick={handleCreateSupplyRequest} className="bg-orange-600 hover:bg-orange-700 text-white rounded">
                    Yêu cầu cung ứng
                  </Button>
                </>
              )}
              {formData.status === 'Picking' && (
                <Button onClick={handleCompletePicking} className="bg-green-600 hover:bg-green-700 text-white rounded">
                  Hoàn thành soạn
                </Button>
              )}
              {(formData.status === 'Pending' || formData.status === 'Picking') && (
                <Button onClick={handleCancelPicking} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 rounded">
                  Hủy phiếu
                </Button>
              )}
              {(formData.status === 'Completed' || formData.status === 'completed') && (
                <Button
                  onClick={handleCreateStockOut}
                  disabled={stockOutLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded gap-2"
                >
                  {stockOutLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Package className="w-4 h-4" />
                  )}
                  Xuất kho
                </Button>
              )}
            </>
          )}
          {isEditing && (
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded">
              <Save className="w-4 h-4 mr-2" />
              Lưu phiếu
            </Button>
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
                        onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                {formData.transferOrderCode && (
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Mã điều chuyển</td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/warehouse/transfer-orders?search=${formData.transferOrderCode}`}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        {formData.transferOrderCode}
                      </Link>
                    </td>
                  </tr>
                )}
                {formData.status === 'Completed' && (
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold">Ghi chú xuất kho</td>
                    <td className="px-6 py-3">
                      <textarea
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500 font-medium"
                        rows={3}
                        placeholder="Nhập ghi chú khi xuất kho..."
                        value={stockOutNote}
                        onChange={(e) => setStockOutNote(e.target.value)}
                      />
                    </td>
                  </tr>
                )}
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
                          <td className="px-6 py-3" colSpan={2}>
                            {isEditing ? (
                              <SearchableProductSelect
                                defaultValue={item.productCode}
                                defaultLabel={item.productName}
                                onSelect={(prod) => {
                                  updateItem(item.id, 'productId', prod.id);
                                  updateItem(item.id, 'productCode', prod.code || '');
                                  updateItem(item.id, 'productName', prod.name);
                                  updateItem(item.id, 'unit', prod.unitOfQuantityName || 'Cái');
                                  updateItem(item.id, 'manufactureName', prod.supplierName || 'N/A');
                                }}
                              />
                            ) : (
                              <div className="flex flex-col">
                                <span className="font-semibold admin-text-primary">{item.productCode}</span>
                                <span className="text-gray-900">{item.productName}</span>
                              </div>
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
