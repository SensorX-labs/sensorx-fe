'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  FileText,
  Package,
  Send,
  Truck,
  User,
  XCircle
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { cn } from '@/shared/utils/cn';
import { OrderStatus } from '../../enums/order-status';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order-service';

interface OrderDetailProps {
  id: string;
}

const statusStyles: Record<string, string> = {
  [OrderStatus.PendingPayment]: 'bg-orange-50 text-orange-700 border-orange-200',
  [OrderStatus.Processing]: 'bg-blue-50 text-blue-700 border-blue-200',
  [OrderStatus.Dispatched]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [OrderStatus.Cancelled]: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  [OrderStatus.PendingPayment]: 'Chờ thanh toán',
  [OrderStatus.Processing]: 'Đang xử lý',
  [OrderStatus.Dispatched]: 'Đã xuất kho',
  [OrderStatus.Cancelled]: 'Đã hủy',
};

const statusIcons: Record<string, React.ElementType> = {
  [OrderStatus.PendingPayment]: FileText,
  [OrderStatus.Processing]: Truck,
  [OrderStatus.Dispatched]: CheckCircle,
  [OrderStatus.Cancelled]: XCircle,
};

const formatMoney = (value?: number) => `${(value ?? 0).toLocaleString('vi-VN')} d`;

export default function OrderDetail({ id }: OrderDetailProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await OrderService.getOrderById(id);
        setOrder(response);
      } catch (error) {
        console.error('>>> Loi khi fetch chi tiet don hang:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const items = useMemo(() => order?.items ?? order?.orderItems ?? [], [order]);
  const subtotal = order?.subtotal ?? items.reduce((acc, item) => acc + (item.lineAmount ?? item.quantity * item.unitPrice), 0);
  const totalTax = order?.totalTax ?? items.reduce((acc, item) => acc + (item.taxAmount ?? 0), 0);
  const grandTotal = order?.grandTotal ?? subtotal + totalTax;

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse text-blue-600 font-medium tracking-widest uppercase text-xs">
        Dang tai du lieu...
      </div>
    );
  }

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

  const StatusIcon = statusIcons[order.status] ?? FileText;

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold admin-title uppercase">Chi tiết đơn hàng</h2>
            <span className={cn(
              "px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
              statusStyles[order.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'
            )}>
              <StatusIcon className="w-3 h-3" />
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>
        </div>
        <Link href="/sales/orders">
          <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <h4 className="text-sm font-medium uppercase tracking-wider">Thông tin đơn hàng</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã đơn hàng</td>
                  <td className="px-6 py-3 font-bold">{order.code}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Ngày đặt</td>
                  <td className="px-6 py-3">
                    {new Date(order.orderDate).toLocaleString('vi-VN')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Từ báo giá</td>
                  <td className="px-6 py-3">
                    <Link href={`/sales/quotations/${order.quoteId}`} className="text-blue-600 hover:underline">
                      {order.quoteId}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <User className="w-4 h-4" />
              <h4 className="text-sm font-medium uppercase tracking-wider">Thông tin khách hàng</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Công ty</td>
                  <td className="px-6 py-3 break-words">{order.companyName}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Người nhận</td>
                  <td className="px-6 py-3">{order.recipientName}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Điện thoại</td>
                  <td className="px-6 py-3">{order.recipientPhone}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                  <td className="px-6 py-3 lowercase">{order.email ?? order.customerEmail}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ</td>
                  <td className="px-6 py-3">{order.address}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">MST</td>
                  <td className="px-6 py-3 tracking-widest uppercase">{order.taxCode}</td>
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
                  <td className="px-6 py-3">{order.senderName}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                  <td className="px-6 py-3 lowercase">{order.senderEmail}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <h4 className="text-sm font-medium uppercase tracking-wider">Danh mục sản phẩm</h4>
              </div>
              <span className="text-xs font-semibold text-gray-500">{items.length} dòng hàng</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 uppercase">
                    <th className="px-6 py-3 text-left admin-table-th">Sản phẩm</th>
                    <th className="px-4 py-3 text-center admin-table-th">DVT</th>
                    <th className="px-4 py-3 text-center admin-table-th w-24">SL</th>
                    <th className="px-6 py-3 text-right admin-table-th w-32">Đơn giá</th>
                    <th className="px-6 py-3 text-right admin-table-th w-24">Thuế</th>
                    <th className="px-6 py-3 text-right admin-table-th">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{item.productName || item.productCode}</p>
                          <p className="text-[10px] uppercase text-gray-500 mt-0.5">{item.productCode} - {item.manufacturer}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">{item.unit}</td>
                      <td className="px-4 py-4 text-center font-semibold">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">{formatMoney(item.unitPrice)}</td>
                      <td className="px-6 py-4 text-right">{item.taxRate}%</td>
                      <td className="px-6 py-4 text-right font-bold">{formatMoney(item.totalLineAmount ?? item.lineAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50/30 border-t border-gray-100">
              <div className="ml-auto w-full md:w-80 space-y-3">
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span>Tổng tiền hàng:</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span>Thuế GTGT:</span>
                  <span>{formatMoney(totalTax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 text-[var(--brand-green-600)]">
                  <span>TỔNG CỘNG:</span>
                  <span>{formatMoney(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
