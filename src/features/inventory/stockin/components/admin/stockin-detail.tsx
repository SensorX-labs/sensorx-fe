'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Package, Warehouse, Calendar,
  DollarSign, MessageSquare, Save, Edit, X, Trash,
  ClipboardList, Search
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/shadcn-ui/select";
import Link from 'next/link';
import { ActionType } from '@/shared/constants/action-type';
import { StockInService } from '../../services/stock-in-service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ProductService } from '@/features/catalog/product/services/product-service';
import { ProductLoadMoreForModal } from '@/features/catalog/product/models/product-load-more';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { createStockIn, getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { useUser } from '@/shared/hooks/use-user';

interface StockInDetailProps {
  id?: string;
  onBack?: () => void;
}

interface StockInItem {
  id: string; // Frontend temp ID
  productId?: string; // Backend Guid
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  floor?: string;
  brandZone?: string;
  rackCode?: string;
}

interface StockInData {
  id: string;
  code: string;
  date: string;
  supplier: string;
  warehouse: string;
  status: 'draft' | 'pending' | 'completed';
  items: StockInItem[];
  note: string;
  transferOrderCode?: string;
}

const statusColor: Record<string, string> = {
  'draft': 'bg-gray-100 text-gray-600 border-gray-200',
  'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'completed': 'bg-green-50 text-green-700 border-green-200',
};

const statusLabel: Record<string, string> = {
  'draft': 'Nháp',
  'pending': 'Chờ xác nhận',
  'completed': 'Hoàn thành',
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
                    console.log("=== Đã chọn sản phẩm ===", p);
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

export default function StockInDetail({ id }: StockInDetailProps) {
  const { user } = useUser();
  const isWarehouseStaff = user?.role === 'WarehouseStaff';
  const searchParams = useSearchParams();
  const router = useRouter();
  const actionParam = searchParams.get('action') as ActionType | null;

  const [action, setAction] = useState<ActionType>(
    actionParam || ActionType.DETAIL
  );
  const [isEditing, setIsEditing] = useState(action === ActionType.CREATE);
  const [loading, setLoading] = useState(false);

  const [stockInData, setStockInData] = useState<StockInData>({
    id: id || '',
    code: '',
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    warehouse: '',
    status: 'draft',
    items: [],
    note: '',
  });

  const [linkedTransferOrderCode, setLinkedTransferOrderCode] = useState('');

  const [items, setItems] = useState<StockInItem[]>([]);
  const [supplier, setSupplier] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [deliveredBy, setDeliveredBy] = useState('');
  const [warehouseKeeper, setWarehouseKeeper] = useState('');
  const [note, setNote] = useState('');
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('');

  useEffect(() => {
    const fetchW = async () => {
      try {
        const list = await getWarehouses();
        setWarehouses(list || []);
        if (isWarehouseStaff && user?.warehouseId) {
          setSelectedWarehouseId(user.warehouseId);
        } else {
          const savedId = Cookies.get('warehouseId');
          if (savedId && list.some((w: any) => w.id === savedId)) {
            setSelectedWarehouseId(savedId);
          } else if (list.length > 0) {
            setSelectedWarehouseId(list[0].id || '');
          }
        }
      } catch (err) {
        console.error("Failed to load warehouses:", err);
      }
    };
    fetchW();
  }, [isWarehouseStaff, user?.warehouseId]);

  useEffect(() => {
    if (id && id !== 'undefined' && action !== ActionType.CREATE) {
      setLoading(true);
      StockInService.getById(id, selectedWarehouseId || undefined)
        .then(data => {
          if (data) {
            setStockInData(data);
            const mappedItems = (data.items || []).map((item: any) => ({
              ...item,
              id: item.id || item.productId || Math.random().toString(),
              unitPrice: item.unitPrice || 0,
              taxRate: item.taxRate || 0,
            }));
            setItems(mappedItems);
            setDeliveredBy(data.deliveredBy || '');
            setWarehouseKeeper(data.warehouseKeeper || '');
            setNote(data.description || '');
          }
        })
        .catch(err => {
          console.error("Error fetching stock in detail:", err);
          toast.error("Không thể tải thông tin phiếu nhập kho");
        })
        .finally(() => setLoading(false));
    }
  }, [id, action, selectedWarehouseId]);

  const handleSave = async () => {
    try {
      if (action === ActionType.CREATE) {
        const filteredItems = items
          .filter(item => item.productId)
          .map(item => ({
            productId: item.productId,
            productName: item.productName,
            productCode: item.productCode,
            unit: item.unit || 'Cái',
            quantity: item.quantity,
            floor: item.floor || '',
            brandZone: item.brandZone || '',
            rackCode: item.rackCode || '',
          }));

        if (filteredItems.length === 0) {
          toast.error("Vui lòng chọn ít nhất một sản phẩm hợp lệ");
          return;
        }

        if (!selectedWarehouseId) {
          toast.error("Vui lòng chọn kho nhận");
          return;
        }

        const payload: any = {
          deliveredBy: deliveredBy || 'unknown',
          warehouseKeeper: warehouseKeeper || 'unknown',
          description: note,
          items: filteredItems
        };
        if (linkedTransferOrderCode) {
          payload.linkedTransferOrderCode = linkedTransferOrderCode;
        }
        await createStockIn(payload, selectedWarehouseId);
        toast.success("Tạo phiếu nhập kho thành công");
        router.push("/warehouse/stockin");
      }
      setIsEditing(false);
      setAction(ActionType.DETAIL);
    } catch (error) {
      toast.error("Lỗi khi lưu phiếu nhập kho");
    }
  };

  const handleCancel = () => {
    setAction(ActionType.DETAIL);
    setIsEditing(false);
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => {
      const sub = (item.quantity || 0) * (item.unitPrice || 0);
      return sum + sub + sub * ((item.taxRate || 0) / 100);
    }, 0);

  const addItem = () => {
    const newItem: StockInItem = {
      id: Date.now().toString(),
      productCode: '',
      productName: '',
      quantity: 1,
      unit: 'Cái',
      unitPrice: 0,
      taxRate: 10,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof StockInItem, value: any) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase">
            {action === ActionType.CREATE
              ? 'Tạo phiếu nhập kho'
              : 'Chi tiết phiếu nhập kho'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="rounded admin-btn-primary border-transparent">
                <Package className="w-4 h-4 mr-2" />
                Xác nhận nhập
              </Button>
              
              {action === ActionType.CREATE ? (
                <Link href="/warehouse/stockin">
                  <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={handleCancel} className="rounded text-gray-700 hover:bg-gray-50">
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              )}
            </>
          ) : (
            <>
              {/* Nút Xác nhận nhập đã được gộp vào luồng Tạo mới */}
              <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded text-gray-700 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Link href="/warehouse/stockin">
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
              <ClipboardList className="w-4 h-4" />
              <h4 className="text-sm font-medium">Thông tin cơ bản</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] w-2/5 font-semibold">Mã phiếu</td>
                  <td className="px-6 py-3 font-semibold text-gray-500 italic">
                    {action === ActionType.CREATE ? 'Hệ thống tự sinh' : stockInData.code}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor[stockInData.status]}`}>
                      {statusLabel[stockInData.status]}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Ngày nhập</td>
                  <td className="px-6 py-3">{new Date(stockInData.date).toLocaleDateString('vi-VN')}</td>
                </tr>
                {action === ActionType.CREATE ? (
                  <tr>
                    <td className="px-6 py-3 text-[#2B3674] font-semibold">Mã điều chuyển</td>
                    <td className="px-6 py-3">
                      <Input
                        value={linkedTransferOrderCode}
                        onChange={(e) => setLinkedTransferOrderCode(e.target.value)}
                        className="text-sm h-8 border-gray-300 rounded"
                        placeholder="Nhập mã (nếu có)"
                      />
                    </td>
                  </tr>
                ) : stockInData.transferOrderCode ? (
                  <tr>
                    <td className="px-6 py-3 text-[#2B3674] font-semibold">Mã điều chuyển</td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/warehouse/transfer-orders?search=${stockInData.transferOrderCode}`}
                        className="font-bold text-blue-600 hover:underline text-sm"
                      >
                        {stockInData.transferOrderCode}
                      </Link>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Thông tin nhà cung cấp */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Warehouse className="w-4 h-4" />
              <h4 className="text-sm font-medium">Thông tin nhà cung cấp & kho</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A3AED0] mb-2 uppercase">Kho nhận</label>
                <Input
                  disabled
                  value={warehouses.find(w => w.id === selectedWarehouseId)?.name || 'Đang tải...'}
                  className="text-sm h-9 border-gray-300 rounded bg-gray-50 text-gray-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A3AED0] mb-2 uppercase">Nhà cung cấp</label>
                <Input
                  disabled={!isEditing}
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="text-sm h-9 border-gray-300 rounded"
                  placeholder="Nhập tên nhà cung cấp"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A3AED0] mb-2 uppercase">Người giao hàng</label>
                <Input
                  disabled={!isEditing}
                  value={deliveredBy}
                  onChange={(e) => setDeliveredBy(e.target.value)}
                  className="text-sm h-9 border-gray-300 rounded"
                  placeholder="Nhập tên người giao"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#A3AED0] mb-2 uppercase">Thủ kho nhận</label>
                <Input
                  disabled={!isEditing}
                  value={warehouseKeeper}
                  onChange={(e) => setWarehouseKeeper(e.target.value)}
                  className="text-sm h-9 border-gray-300 rounded"
                  placeholder="Nhập tên thủ kho"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Danh sách hàng hóa */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <h4 className="text-sm font-medium">Danh sách hàng hóa</h4>
              </div>
              {isEditing && (
                <Button
                  onClick={addItem}
                  size="sm"
                  className="rounded admin-btn-primary border-transparent text-xs"
                >
                  + Thêm hàng hóa
                </Button>
              )}
            </div>
            <div className="p-6">
              <table className="w-full overflow-x-auto">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 admin-table-th text-left">Sản phẩm</th>
                    <th className="px-4 py-3 w-24 admin-table-th text-center">Số lượng</th>
                    <th className="px-3 py-3 admin-table-th text-center">Tầng</th>
                    <th className="px-3 py-3 admin-table-th text-center">Khu</th>
                    <th className="px-3 py-3 admin-table-th text-center">Kệ</th>
                    {isEditing && <th className="px-1 py-3 w-5" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => {
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <div className="min-w-[200px]">
                              <SearchableProductSelect
                                defaultValue={item.productCode}
                                defaultLabel={item.productName}
                                onSelect={(prod) => {
                                  updateItem(item.id, 'productId', prod.id);
                                  updateItem(item.id, 'productCode', prod.code || '');
                                  updateItem(item.id, 'productName', prod.name);
                                  updateItem(item.id, 'unit', prod.unitOfQuantityName || 'Cái');
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
                        <td className="px-4 py-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span className="font-medium">{item.quantity}</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.floor || ''}
                              onChange={(e) => updateItem(item.id, 'floor', e.target.value)}
                              placeholder="T1"
                              className="w-14 px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">{item.floor || '-'}</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.brandZone || ''}
                              onChange={(e) => updateItem(item.id, 'brandZone', e.target.value)}
                              placeholder="A"
                              className="w-14 px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">{item.brandZone || '-'}</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.rackCode || ''}
                              onChange={(e) => updateItem(item.id, 'rackCode', e.target.value)}
                              placeholder="R01"
                              className="w-14 px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">{item.rackCode || '-'}</span>
                          )}
                        </td>
                        {isEditing && (
                          <td className="px-1 py-3 text-center">
                            <Button
                              onClick={() => removeItem(item.id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:bg-red-50 h-6 w-6 p-0"
                            >
                              <Trash className="w-3 h-3" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={isEditing ? 8 : 5} className="px-6 py-10 text-center text-gray-400 italic text-xs">
                        Chưa có sản phẩm nào được chọn. Click "+ Thêm hàng hóa" để chọn sản phẩm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
 
          {/* Ghi chú */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <h4 className="text-sm font-medium">Ghi chú</h4>
            </div>
            <div className="p-6">
              <Textarea
                disabled={!isEditing}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-sm border-gray-300 rounded min-h-[100px]"
                placeholder="Nhập ghi chú..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
