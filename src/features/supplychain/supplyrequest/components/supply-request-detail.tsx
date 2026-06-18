'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Package, Warehouse, Calendar,
  DollarSign, MessageSquare, Save, Edit, X, Trash,
  ClipboardList, Search, Plus, Loader2
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
import { toast } from 'sonner';
import { getSupplyRequestById, processSupplyRequest } from '../services/supply-request-service';
import { createTransferOrder } from '@/features/supplychain/transferorder/services/transfer-order-service';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { ProductService } from '@/features/catalog/product/services/product-service';
import { ProductLoadMoreForModal } from '@/features/catalog/product/models/product-load-more';
import { useUser } from '@/shared/hooks/use-user';

interface SupplyRequestDetailProps {
  id?: string;
}

interface RequestItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  requiredQuantity: number;
  unit?: string;
  manufacturerName?: string;
}

interface PurchasePlanItem {
  id: string; // Product Guid or Temp ID
  productId?: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface TransferPlanItem {
  id: string; // Product Guid or Temp ID
  productId?: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit?: string;
  manufacturerName?: string;
  note?: string;
}

interface TransferPlan {
  id: string;
  code?: string;
  sourceWarehouse: string; // Warehouse Guid ID
  items: TransferPlanItem[];
  status?: string;
  isNew?: boolean;
}

interface SupplyRequestData {
  id: string;
  code: string;
  date: string;
  totalRequired: number;
  status: 'Pending' | 'Completed' | string;
  requestItems: RequestItem[];
  purchasePlan: PurchasePlanItem[];
  transferPlans: TransferPlan[];
  note: string;
  warehouseId?: string;
  pickingNoteId?: string;
}

const statusColor: Record<string, string> = {
  'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Completed': 'bg-green-50 text-green-700 border-green-200',
};

const statusLabel: Record<string, string> = {
  'Pending': 'Chờ xử lý',
  'Completed': 'Hoàn thành',
};

const generateCode = (prefix: string) => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const fff = String(now.getMilliseconds()).padStart(3, '0');
  return `${prefix.toUpperCase()}-${yy}${MM}${dd}-${HH}${mm}${ss}${fff}`;
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

export default function SupplyRequestDetail({ id }: SupplyRequestDetailProps) {
  const { user } = useUser();
  const isWarehouseStaff = user?.role === 'WarehouseStaff';
  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams.get('action') === 'edit';

  const [isEditing, setIsEditing] = useState(editParam || false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  const [supplyData, setSupplyData] = useState<SupplyRequestData>({
    id: id || '',
    code: '',
    date: new Date().toISOString(),
    totalRequired: 0,
    status: 'Pending',
    requestItems: [],
    purchasePlan: [],
    transferPlans: [],
    note: '',
  });

  const [purchasePlan, setPurchasePlan] = useState<PurchasePlanItem[]>([]);
  const [transferPlans, setTransferPlans] = useState<TransferPlan[]>([]);
  const [note, setNote] = useState('');

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 1. Fetch supply request detail
      const data = await getSupplyRequestById(id);
      
      // 2. Fetch warehouse list
      const warehouseList = await getWarehouses();
      setWarehouses(warehouseList || []);

      // 3. Resolve request items
      const resolvedItems = await Promise.all((data.items || []).map(async (item: any) => {
        try {
          const p = await ProductService.getDetail(item.productId);
          return {
            id: item.id,
            productId: item.productId,
            productCode: p.code || '',
            productName: p.name || 'Sản phẩm không tên',
            requiredQuantity: item.requestedQuantity,
            unit: p.unitOfQuantityName || 'Cái',
            manufacturerName: p.supplierName || 'N/A'
          };
        } catch {
          return {
            id: item.id,
            productId: item.productId,
            productCode: 'Unknown',
            productName: 'Sản phẩm không rõ',
            requiredQuantity: item.requestedQuantity,
            unit: 'Cái',
            manufacturerName: 'N/A'
          };
        }
      }));

      // 4. Resolve purchase options
      const resolvedPurchase = await Promise.all((data.purchaseOptions || []).map(async (opt: any) => {
        try {
          const p = await ProductService.getDetail(opt.productId);
          return {
            id: opt.id,
            productId: opt.productId,
            productCode: p.code || '',
            productName: p.name || 'Sản phẩm không tên',
            quantity: opt.quantity,
            unitPrice: 0
          };
        } catch {
          return {
            id: opt.id,
            productId: opt.productId,
            productCode: 'Unknown',
            productName: 'Sản phẩm không rõ',
            quantity: opt.quantity,
            unitPrice: 0
          };
        }
      }));

      // 5. Resolve already created transfer orders
      const resolvedTransfers = (data.transferOrders || []).map((to: any) => ({
        id: to.id,
        code: to.code,
        sourceWarehouse: to.sourceWarehouseId,
        status: to.status,
        isNew: false,
        items: (to.items || []).map((toi: any) => ({
          id: toi.id,
          productId: toi.productId,
          productCode: toi.productCode,
          productName: toi.productName,
          quantity: toi.quantity,
          unit: toi.unit,
          manufacturerName: toi.manufacturerName,
          note: toi.note
        }))
      }));

      const resolvedData: SupplyRequestData = {
        id: data.id,
        code: data.code,
        date: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        totalRequired: resolvedItems.reduce((sum, item) => sum + item.requiredQuantity, 0),
        status: data.status,
        note: data.note || '',
        requestItems: resolvedItems,
        purchasePlan: resolvedPurchase,
        transferPlans: resolvedTransfers,
        warehouseId: data.warehouseId,
        pickingNoteId: data.pickingNoteId,
      };

      setSupplyData(resolvedData);
      setPurchasePlan(resolvedPurchase);
      setTransferPlans(resolvedTransfers);
      setNote(data.note || '');
    } catch (error) {
      console.error("Failed to load supply request detail:", error);
      toast.error("Không thể tải chi tiết yêu cầu cung ứng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Save purchase options
      await processSupplyRequest({
        supplyRequestId: id!,
        purchaseOptions: purchasePlan.map(x => ({
          productId: x.productId || x.id,
          quantity: x.quantity,
          note: `Mua ngoài bổ sung`
        })),
        completeRequest: false
      });

      // 2. Create new transfer orders
      const newPlans = transferPlans.filter(p => p.isNew);
      for (const plan of newPlans) {
        if (!plan.sourceWarehouse) {
          toast.error("Vui lòng chọn đầy đủ kho xuất cho các phương án điều chuyển");
          setSaving(false);
          return;
        }
        if (plan.items.length === 0) {
          toast.error("Vui lòng thêm sản phẩm cho các phương án điều chuyển mới");
          setSaving(false);
          return;
        }
        await createTransferOrder({
          code: generateCode('DC'),
          sourceWarehouseId: plan.sourceWarehouse,
          destinationWarehouseId: supplyData.warehouseId!,
          note: `Điều chuyển từ yêu cầu cung ứng ${supplyData.code}`,
          items: plan.items.map(toi => ({
            productId: toi.productId || toi.id,
            productCode: toi.productCode,
            productName: toi.productName,
            unit: toi.unit || 'Cái',
            quantity: toi.quantity,
            manufactureName: toi.manufacturerName || 'N/A',
            note: toi.note || ''
          })),
          pickingNoteId: supplyData.pickingNoteId || null,
          supplyRequestId: id!
        });
      }

      toast.success("Lưu phương án thành công");
      setIsEditing(false);
      loadData();
    } catch (error) {
      console.error("Failed to save supply request options:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await processSupplyRequest({
        supplyRequestId: id!,
        purchaseOptions: purchasePlan.map(x => ({
          productId: x.productId || x.id,
          quantity: x.quantity,
          note: `Mua ngoài bổ sung`
        })),
        completeRequest: true
      });
      toast.success("Đã duyệt hoàn tất yêu cầu cung ứng");
      router.push('/warehouse/supply-requests');
    } catch (error) {
      console.error("Failed to complete supply request:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPurchasePlan(supplyData.purchasePlan);
    setTransferPlans(supplyData.transferPlans);
    setNote(supplyData.note);
    setIsEditing(false);
  };

  const addPurchaseItem = () => {
    const newItem: PurchasePlanItem = {
      id: 'temp_' + Date.now().toString(),
      productCode: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
    };
    setPurchasePlan([...purchasePlan, newItem]);
  };

  const removePurchaseItem = (itemId: string) => {
    setPurchasePlan(purchasePlan.filter(item => item.id !== itemId));
  };

  const updatePurchaseItem = (itemId: string, updates: Partial<PurchasePlanItem>) => {
    setPurchasePlan(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const addTransferPlan = () => {
    const newPlan: TransferPlan = {
      id: 'temp_plan_' + Date.now().toString(),
      sourceWarehouse: '',
      items: [],
      isNew: true,
    };
    setTransferPlans([...transferPlans, newPlan]);
  };

  const removeTransferPlan = (planId: string) => {
    setTransferPlans(transferPlans.filter(plan => plan.id !== planId));
  };

  const addTransferItem = (planId: string) => {
    const newItem: TransferPlanItem = {
      id: 'temp_toi_' + Date.now().toString(),
      productCode: '',
      productName: '',
      quantity: 1,
    };
    setTransferPlans(transferPlans.map(plan =>
      plan.id === planId ? { ...plan, items: [...plan.items, newItem] } : plan
    ));
  };

  const removeTransferItem = (planId: string, itemId: string) => {
    setTransferPlans(transferPlans.map(plan =>
      plan.id === planId
        ? { ...plan, items: plan.items.filter(item => item.id !== itemId) }
        : plan
    ));
  };

  const updateTransferItem = (planId: string, itemId: string, updates: Partial<TransferPlanItem>) => {
    setTransferPlans(prev => prev.map(plan =>
      plan.id === planId
        ? {
          ...plan,
          items: plan.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        }
        : plan
    ));
  };

  const updateTransferWarehouse = (planId: string, warehouse: string) => {
    setTransferPlans(transferPlans.map(plan =>
      plan.id === planId ? { ...plan, sourceWarehouse: warehouse } : plan
    ));
  };

  const fillToPurchasePlan = () => {
    if (supplyData.requestItems.length === 0) {
      toast.error("Không có sản phẩm cần cung ứng nào để điền");
      return;
    }
    const items: PurchasePlanItem[] = supplyData.requestItems.map(item => ({
      id: 'temp_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      productId: item.productId,
      productCode: item.productCode,
      productName: item.productName,
      quantity: item.requiredQuantity,
      unitPrice: 0,
    }));
    setPurchasePlan(items);
    toast.success("Đã điền sản phẩm vào phương án mua hàng");
  };

  const fillToTransferPlan = () => {
    if (supplyData.requestItems.length === 0) {
      toast.error("Không có sản phẩm cần cung ứng nào để điền");
      return;
    }
    const newItems: TransferPlanItem[] = supplyData.requestItems.map(item => ({
      id: 'temp_toi_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      productId: item.productId,
      productCode: item.productCode,
      productName: item.productName,
      quantity: item.requiredQuantity,
      unit: item.unit || 'Cái',
      manufacturerName: item.manufacturerName || 'N/A',
      note: ''
    }));

    const newPlan: TransferPlan = {
      id: 'temp_plan_' + Date.now().toString(),
      sourceWarehouse: '',
      items: newItems,
      isNew: true,
    };

    setTransferPlans([...transferPlans, newPlan]);
    toast.success("Đã thêm phương án điều chuyển và điền toàn bộ sản phẩm");
  };

  const purchaseTotal = purchasePlan.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="space-y-6 w-full relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase">
            Chi tiết yêu cầu cung ứng
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && !isWarehouseStaff ? (
            <>
              <Button onClick={handleSave} disabled={saving} className="rounded admin-btn-primary border-transparent">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Lưu phương án
              </Button>
              <Button variant="outline" onClick={handleCancel} className="rounded text-gray-700 hover:bg-gray-50">
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </>
          ) : (
            <>
              {supplyData.status !== 'Completed' && !isWarehouseStaff && (
                <>
                  <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white rounded">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Package className="w-4 h-4 mr-2" />}
                    Duyệt hoàn tất
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded text-gray-700 hover:bg-gray-50">
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </>
              )}
              <Link href="/warehouse/supply-requests">
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

        <div className={isWarehouseStaff ? "md:col-span-3 space-y-6 max-w-4xl" : "md:col-span-1 space-y-6"}>
          {/* Thông tin cơ bản */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <h4 className="text-sm font-medium">Thông tin yêu cầu</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] w-2/5 font-semibold">Mã yêu cầu</td>
                  <td className="px-6 py-3">{supplyData.code}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Kho yêu cầu</td>
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    {warehouses.find(w => w.id === supplyData.warehouseId)?.name || supplyData.warehouseId}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor[supplyData.status] || 'bg-gray-100'}`}>
                      {statusLabel[supplyData.status] || supplyData.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Ngày tạo</td>
                  <td className="px-6 py-3">{new Date(supplyData.date).toLocaleDateString('vi-VN')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[#2B3674] font-semibold">Tổng SL yêu cầu</td>
                  <td className="px-6 py-3 font-bold text-[#FF6B35]">{supplyData.totalRequired}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Danh sách sản phẩm yêu cầu */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <h4 className="text-sm font-medium">Sản phẩm cần cung ứng</h4>
              </div>
              {isEditing && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" className="admin-btn-primary border-transparent text-xs h-7 py-1 px-3">
                      Tự động điền
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-1 bg-white border border-gray-200 shadow-lg rounded" align="end">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-xs font-normal hover:bg-gray-100 text-left h-8 px-2"
                        onClick={fillToPurchasePlan}
                      >
                        Điền vào Phương án mua hàng
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-xs font-normal hover:bg-gray-100 text-left h-8 px-2"
                        onClick={fillToTransferPlan}
                      >
                        Điền vào Phương án điều chuyển
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="p-6">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Sản phẩm</th>
                    <th className="px-3 py-2 text-center w-16">SL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {supplyData.requestItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="font-semibold text-gray-900">{item.productName}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Mã: {item.productCode}</div>
                      </td>
                      <td className="px-3 py-2 text-center font-semibold">{item.requiredQuantity}</td>
                    </tr>
                  ))}
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

        {!isWarehouseStaff && (
          <div className="md:col-span-2 space-y-6">
          {/* Phương án mua hàng */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <h4 className="text-sm font-medium">Phương án mua hàng</h4>
              </div>
              {isEditing && (
                <Button
                  onClick={addPurchaseItem}
                  size="sm"
                  className="admin-btn-primary border-transparent text-xs"
                >
                  + Thêm sản phẩm
                </Button>
              )}
            </div>
            <div className="p-6">
              <table className="w-full overflow-x-auto">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 admin-table-th text-left">Sản phẩm</th>
                    <th className="px-4 py-3 w-20 admin-table-th text-center">SL mua</th>
                    <th className="px-4 py-3 w-28 admin-table-th text-right">Đơn giá</th>
                    <th className="px-4 py-3 w-28 admin-table-th text-right">Tổng tiền</th>
                    {isEditing && <th className="px-1 py-3 w-5" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {purchasePlan.map((item) => {
                    const total = (item.quantity || 0) * (item.unitPrice || 0);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <div className="min-w-[200px]">
                              <SearchableProductSelect
                                defaultValue={item.productCode}
                                defaultLabel={item.productName}
                                onSelect={(prod) => {
                                  updatePurchaseItem(item.id, {
                                    productId: prod.id,
                                    productCode: prod.code || '',
                                    productName: prod.name
                                  });
                                }}
                              />
                            </div>
                          ) : (
                            <>
                              <div>{item.productName}</div>
                              {item.productCode && <div className="text-xs mt-0.5 text-gray-500">Mã: {item.productCode}</div>}
                            </>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updatePurchaseItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span>{item.quantity}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updatePurchaseItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                              placeholder="0"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-right focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                            />
                          ) : (
                            <span>{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {total.toLocaleString('vi-VN')}đ
                        </td>
                        {isEditing && (
                          <td className="px-1 py-3 text-center">
                            <Button
                              onClick={() => removePurchaseItem(item.id)}
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
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200 text-lg">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right font-semibold">
                      Tổng giá trị mua:
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-[var(--brand-green-600)]">
                      {purchaseTotal.toLocaleString('vi-VN')}đ
                    </td>
                    {isEditing && <td />}
                  </tr>
                </tfoot>
              </table>
              {purchasePlan.length === 0 && !isEditing && (
                <div className="py-8 text-center text-gray-500 text-sm">
                  Chưa có phương án mua hàng nào
                </div>
              )}
            </div>
          </div>

          {/* Phương án điều chuyển */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Warehouse className="w-4 h-4" />
                <h4 className="text-sm font-medium">Phương án điều chuyển</h4>
              </div>
              {isEditing && (
                <Button
                  onClick={addTransferPlan}
                  size="sm"
                  className="rounded admin-btn-primary border-transparent text-xs"
                >
                  + Thêm lệnh điều chuyển
                </Button>
              )}
            </div>
            <div className="p-6 space-y-6">
              {transferPlans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-[#A3AED0] mb-2 uppercase">Kho xuất (Kho nguồn)</label>
                      {plan.isNew ? (
                        <select
                          value={plan.sourceWarehouse}
                          onChange={(e) => updateTransferWarehouse(plan.id, e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green"
                        >
                          <option value="">-- Chọn kho xuất --</option>
                          {warehouses
                            .filter(w => w.id !== supplyData.warehouseId)
                            .map(w => (
                              <option key={w.id} value={w.id}>{w.name}</option>
                            ))
                          }
                        </select>
                      ) : (
                        <div className="text-sm font-bold text-gray-800 bg-gray-100 p-2 rounded border">
                          {warehouses.find(w => w.id === plan.sourceWarehouse)?.name || plan.sourceWarehouse}
                          {plan.code && <span className="text-xs font-medium text-gray-500 ml-2">({plan.code})</span>}
                          {plan.status && (
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 rounded px-1.5 py-0.5 ml-2 uppercase">
                              {plan.status}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {isEditing && plan.isNew && (
                      <Button
                        onClick={() => removeTransferPlan(plan.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 h-8 w-8 ml-2 mt-6"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Transfer items table */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-xs font-semibold text-gray-700">Sản phẩm cần chuyển</h5>
                      {isEditing && plan.isNew && (
                        <Button
                          onClick={() => addTransferItem(plan.id)}
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Thêm sản phẩm
                        </Button>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-white border-b border-gray-200 text-gray-600">
                          <tr>
                            <th className="px-3 py-2 text-left">Sản phẩm</th>
                            <th className="px-3 py-2 text-left">ĐV</th>
                            <th className="px-3 py-2 text-center w-24">SL</th>
                            <th className="px-3 py-2 text-left">Nhà SX</th>
                            <th className="px-3 py-2 text-left">Ghi chú</th>
                            {isEditing && plan.isNew && <th className="px-2 py-2 w-6" />}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {plan.items.map((item) => (
                            <tr key={item.id} className="hover:bg-white">
                              <td className="px-3 py-2">
                                {isEditing && plan.isNew ? (
                                  <div className="min-w-[180px]">
                                    <SearchableProductSelect
                                      defaultValue={item.productCode}
                                      defaultLabel={item.productName}
                                      onSelect={(prod) => {
                                        updateTransferItem(plan.id, item.id, {
                                          productId: prod.id,
                                          productCode: prod.code || '',
                                          productName: prod.name,
                                          unit: prod.unitOfQuantityName || 'Cái',
                                          manufacturerName: prod.supplierName || 'N/A'
                                        });
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="text-gray-900 font-semibold">{item.productName || '---'} ({item.productCode})</div>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <span className="text-gray-700">{item.unit || 'Cái'}</span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                {isEditing && plan.isNew ? (
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateTransferItem(plan.id, item.id, { quantity: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-blue-500"
                                  />
                                ) : (
                                  <span className="font-semibold">{item.quantity}</span>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                {isEditing && plan.isNew ? (
                                  <input
                                    type="text"
                                    value={item.manufacturerName || ''}
                                    onChange={(e) => updateTransferItem(plan.id, item.id, { manufacturerName: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                                    placeholder="Nhà SX"
                                  />
                                ) : (
                                  <span className="text-gray-600">{item.manufacturerName || 'N/A'}</span>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                {isEditing && plan.isNew ? (
                                  <input
                                    type="text"
                                    value={item.note || ''}
                                    onChange={(e) => updateTransferItem(plan.id, item.id, { note: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                                    placeholder="Ghi chú"
                                  />
                                ) : (
                                  <span className="text-gray-600 text-xs">{item.note || '---'}</span>
                                )}
                              </td>
                              {isEditing && plan.isNew && (
                                <td className="px-2 py-2 text-center">
                                  <Button
                                    onClick={() => removeTransferItem(plan.id, item.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:bg-red-50 h-5 w-5 p-0"
                                  >
                                    <Trash className="w-2.5 h-2.5" />
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {plan.items.length === 0 && (
                      <div className="py-4 text-center text-gray-500 text-sm">
                        Chưa có sản phẩm nào {isEditing && plan.isNew ? '- Nhấn "+ Thêm sản phẩm" để bắt đầu' : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {transferPlans.length === 0 && (
                <div className="py-8 text-center text-gray-500 text-sm">
                  Chưa có phương án điều chuyển nào {isEditing ? '- Nhấn "+ Thêm lệnh điều chuyển" để bắt đầu' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
}
