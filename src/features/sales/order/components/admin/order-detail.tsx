'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, FileText, User, ShoppingCart, 
  Package, DollarSign, Mail, Phone, MapPin, 
  ClipboardList, Send, CheckCircle, Clock, Truck, XCircle, Edit,
  Save,
  X,
  Plus,
  Trash2,
  Search
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import { MOCK_ORDERS } from '../../mocks/order-mocks';
import { mockProducts } from '@/features/catalog/product/mocks/mock-product';
import { OrderStatus } from '../../enums/order-status';

interface OrderDetailProps {
  id: string;
}

function SearchableProductSelect({ defaultValue, defaultLabel, onSelect }: { defaultValue?: string, defaultLabel?: string, onSelect: (prod: any) => void }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCode, setSelectedCode] = React.useState(defaultValue || "");

  // Đồng bộ lại state khi prop defaultValue thay đổi
  React.useEffect(() => {
    setSelectedCode(defaultValue || "");
  }, [defaultValue]);

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProduct = mockProducts.find(p => p.code === selectedCode);
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
                    setSelectedCode(p.code);
                    onSelect(p);
                    setOpen(false);
                 }}
               >
                 <span className="text-xs font-bold text-gray-900">{p.name}</span>
                 <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-500 uppercase font-medium bg-gray-100 px-1 rounded">Mã: {p.code}</span>
                    <span className="text-[10px] text-brand-green font-bold italic">{p.manufacture}</span>
                 </div>
               </div>
             ))
           )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const statusColor: Record<OrderStatus, string> = {
  [OrderStatus.PendingPayment]: 'bg-orange-50 text-orange-700 border-orange-200',
  [OrderStatus.Processing]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  [OrderStatus.Dispatched]: 'bg-blue-50 text-blue-700 border-blue-200',
  [OrderStatus.Cancelled]: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabel: Record<OrderStatus, string> = {
  [OrderStatus.PendingPayment]: 'Chờ thanh toán',
  [OrderStatus.Processing]: 'Đang xử lý',
  [OrderStatus.Dispatched]: 'Đã xuất kho',
  [OrderStatus.Cancelled]: 'Đã hủy',
};

const statusIcon: Record<OrderStatus, any> = {
  [OrderStatus.PendingPayment]: Clock,
  [OrderStatus.Processing]: Truck,
  [OrderStatus.Dispatched]: CheckCircle,
  [OrderStatus.Cancelled]: XCircle,
};

export default function OrderDetail({ id }: OrderDetailProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialAction = searchParams.get('action');

  const [isEditing, setIsEditing] = React.useState(initialAction === 'edit');
  const order = MOCK_ORDERS.find(o => o.id === id || o.code === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Không tìm thấy thông tin đơn hàng.</p>
        <Link href="/sales/orders">
           <Button variant="link">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    router.push(`/sales/orders/${id}?action=edit`, { scroll: false });
  };

  const handleCancel = () => {
    setIsEditing(false);
    router.push(`/sales/orders/${id}`, { scroll: false });
  };

  const handleSave = () => {
    // Thực hiện logic lưu ở đây
    console.log("Saving changes for order:", id);
    setIsEditing(false);
    router.push(`/sales/orders/${id}`, { scroll: false });
  };

  const subTotal = order.orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxAmount = subTotal * 0.1;
  const grandTotal = subTotal + taxAmount;
  const StatusIcon = statusIcon[order.status];

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-bold admin-title uppercase">Chi tiết đơn hàng</h2>
             <span className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusColor[order.status]}`}>
                <StatusIcon className="w-3 h-3" />
                {statusLabel[order.status]}
             </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-brand-green hover:bg-brand-green-hover text-white rounded shadow-lg shadow-brand-green/20">
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
              <Button variant="outline" onClick={handleCancel} className="rounded text-gray-700">
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit} className="rounded text-gray-700 hover:bg-gray-100">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Link href="/sales/orders">
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
          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <h4 className="text-sm font-medium uppercase tracking-wider">Thông tin đơn hàng</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã đơn hàng</td>
                  <td className="px-6 py-3">{order.code}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Ngày đặt</td>
                  <td className="px-6 py-3">
                    {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Từ báo giá</td>
                  <td className="px-6 py-3 hover:underline cursor-pointer">
                    {order.quoteId}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Thông tin khách hàng */}
          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <User className="w-4 h-4" />
              <h4 className="text-sm font-medium uppercase tracking-wider">Thông tin khách hàng</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Công ty</td>
                  <td className="px-6 py-3 break-words">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={order.companyName}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green"
                      />
                    ) : (
                      <span>{order.companyName}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Người nhận</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={order.recipientName}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green"
                      />
                    ) : (
                      <span>{order.recipientName}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Điện thoại</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={order.recipientPhone}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green"
                      />
                    ) : (
                      <span>{order.recipientPhone}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                  <td className="px-6 py-3 lowercase">
                    {isEditing ? (
                      <input 
                        type="email" 
                        defaultValue={order.customerEmail}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green"
                      />
                    ) : (
                      <span>{order.customerEmail}</span>
                    )}
                  </td>
                </tr>
                <tr>
                   <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ</td>
                   <td className="px-6 py-3">
                    {isEditing ? (
                      <textarea 
                        defaultValue={order.address}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green resize-none"
                        rows={2}
                      />
                    ) : (
                      <span>{order.address}</span>
                    )}
                   </td>
                </tr>
                <tr>
                   <td className="px-6 py-3 admin-text-primary font-semibold">MST</td>
                   <td className="px-6 py-3 tracking-widest uppercase">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={order.taxCode}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green"
                      />
                    ) : (
                      <span>{order.taxCode}</span>
                    )}
                   </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Send className="w-4 h-4" />
              <h4 className="text-sm font-medium uppercase tracking-wider">Nhân viên phụ trách</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Họ tên</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={order.senderName}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green"
                      />
                    ) : (
                      <span>{order.senderName}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                  <td className="px-6 py-3 lowercase">
                    {isEditing ? (
                      <input 
                        type="email" 
                        defaultValue={order.senderEmail}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green"
                      />
                    ) : (
                      <span>{order.senderEmail}</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* danh sách sản phẩm */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <h4 className="text-sm font-medium uppercase tracking-wider">Danh mục sản phẩm</h4>
              </div>
              {isEditing && (
                <Button size="sm" className="admin-btn-primary rounded h-8 text-[10px]">
                   <Plus className="w-3 h-3 mr-1" /> Thêm sản phẩm
                </Button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 uppercase">
                    <th className="px-6 py-3 text-left admin-table-th">Sản phẩm</th>
                    <th className="px-4 py-3 text-center admin-table-th">ĐVT</th>
                    <th className="px-4 py-3 text-center admin-table-th w-24">SL</th>
                    <th className="px-6 py-3 text-right admin-table-th w-32">Đơn giá</th>
                    <th className="px-6 py-3 text-right admin-table-th">Thành tiền</th>
                    {isEditing && <th className="px-4 py-3 text-center admin-table-th w-16"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.orderItems.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="min-w-[220px]">
                            <SearchableProductSelect 
                              defaultValue={item.productCode} 
                              onSelect={(p) => {
                                // Logic cập nhật line item sẽ ở đây
                              }} 
                            />
                          </div>
                        ) : (
                          <div>
                            <p>{item.productCode}</p>
                            <p className="text-[10px] uppercase">{item.manufacturer}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isEditing ? (
                          <input 
                            type="text" 
                            defaultValue={item.unit}
                            className="w-16 px-1 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-brand-green"
                          />
                        ) : (
                          <span>{item.unit}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isEditing ? (
                          <input 
                            type="number" 
                            defaultValue={item.quantity}
                            className="w-16 px-1 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-brand-green"
                          />
                        ) : (
                          <span>{item.quantity}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <input 
                            type="number" 
                            defaultValue={item.unitPrice}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right focus:outline-none focus:border-brand-green"
                          />
                        ) : (
                          <span>{item.unitPrice.toLocaleString('vi-VN')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(item.quantity * item.unitPrice).toLocaleString('vi-VN')}
                      </td>
                      {isEditing && (
                        <td className="px-4 py-4 text-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50/30 border-t border-gray-100">
              <div className="ml-auto w-full md:w-80 space-y-3">
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span>Tổng tiền hàng:</span>
                  <span>{subTotal.toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span>Thuế GTGT (10%):</span>
                  <span>{taxAmount.toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 text-[var(--brand-green-600)]">
                  <span>TỔNG CỘNG:</span>
                  <span>{grandTotal.toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
