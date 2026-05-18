'use client';

import React from 'react';
import {
  Package,
  MapPin,
  Truck,
  ChevronLeft,
  Download,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ExternalLink,
  XCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { OrderStatus } from '../../enums/order-status';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order-service';

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  [OrderStatus.PendingPayment]: {
    label: 'Cho thanh toan',
    icon: Clock,
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  [OrderStatus.Processing]: {
    label: 'Dang xu ly',
    icon: Truck,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [OrderStatus.Dispatched]: {
    label: 'Da giao hang',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  [OrderStatus.Cancelled]: {
    label: 'Da huy',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
  }
};

const formatMoney = (value?: number) => (value ?? 0).toLocaleString('vi-VN');

export function OrderDetailView({ orderId, onBack }: { orderId: string; onBack: () => void }) {
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await OrderService.getMyOrderById(orderId);
        setOrder(response);
      } catch (error) {
        console.error('>>> Loi khi fetch chi tiet don hang client:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-24 text-center bg-white border border-dashed border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto mb-4" />
        <p className="meta-label uppercase">Dang tai chi tiet don hang...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center bg-white border border-dashed border-gray-100">
        <p className="meta-label uppercase mb-6">Khong tim thay don hang.</p>
        <button onClick={onBack} className="tracking-label uppercase underline underline-offset-4">
          Quay lai danh sach don hang
        </button>
      </div>
    );
  }

  const items = order.items ?? order.orderItems ?? [];
  const config = statusConfig[order.status] ?? {
    label: order.status,
    icon: Clock,
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  const StatusIcon = config.icon;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 tracking-breadcrumb group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lai danh sach don hang
        </button>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-8 py-2.5 border border-gray-900 tracking-label uppercase btn-tracking transition-all hover:bg-gray-900 hover:text-white !text-[10px]">
            <Download className="w-4 h-4" />
            Tai hoa don (PDF)
          </button>
        </div>
      </div>

      <div className="bg-white p-10 border border-gray-100">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="tracking-title-xl">{order.code}</h1>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <span className="tracking-label uppercase whitespace-nowrap">
                Ngay dat hang: <span className="text-gray-900">{new Date(order.orderDate).toLocaleString('vi-VN')}</span>
              </span>
              <span className="tracking-label uppercase whitespace-nowrap">
                Thanh toan: <span className="text-gray-900">Theo bao gia</span>
              </span>
              <span className="tracking-label uppercase">
                Van chuyen: <span className="text-gray-900">Dang cap nhat</span>
              </span>
            </div>
          </div>
          <div className={cn("px-6 py-2 border-2 tracking-label uppercase font-bold text-[11px] whitespace-nowrap flex items-center gap-2", config.className)}>
            <StatusIcon className="w-4 h-4" />
            {config.label}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100">
        <div className="px-10 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-gray-400" />
            <h3 className="tracking-title uppercase text-lg">Danh sach san pham trong don hang</h3>
          </div>
        </div>

        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-100 uppercase">
              <th className="px-10 py-5 tracking-label border-r border-gray-50 w-[50%]">San pham</th>
              <th className="px-4 py-5 tracking-label border-r border-gray-50 text-center w-[10%]">SL</th>
              <th className="px-8 py-5 tracking-label border-r border-gray-50 text-right w-[20%]">Don gia</th>
              <th className="px-10 py-5 tracking-label text-right w-[20%] bg-gray-50/30">Thanh tien</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id ?? idx} className={cn("border-b border-gray-50 last:border-0", idx % 2 === 1 && "bg-gray-50/30")}>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 p-2 border border-gray-100 shrink-0 flex items-center justify-center">
                      <Package className="w-7 h-7 text-gray-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="breadcrumb-text uppercase">{item.productName || item.productCode}</p>
                      <span className="px-2 py-0.5 bg-gray-100 meta-label uppercase text-[9px] font-bold tracking-widest">{item.productCode}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-6 text-center qty-label">{item.quantity}</td>
                <td className="px-8 py-6 text-right meta-label font-bold">
                  {formatMoney(item.unitPrice)}
                </td>
                <td className="px-10 py-6 text-right qty-label bg-gray-50/20 text-base">
                  {formatMoney(item.totalLineAmount ?? item.lineAmount ?? item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end p-10 border-t border-gray-100">
          <div className="w-96 space-y-5">
            <div className="flex justify-between meta-label uppercase">
              <span className="text-gray-400 font-bold">Tam tinh:</span>
              <span className="qty-label">{formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex justify-between meta-label uppercase">
              <span className="text-gray-400 font-bold">Thue GTGT:</span>
              <span className="qty-label">{formatMoney(order.totalTax)}</span>
            </div>
            <div className="flex justify-between pt-6 border-t-2 border-gray-900 items-baseline">
              <span className="tracking-label uppercase text-sm">Tong:</span>
              <span className="tracking-title-xl text-3xl text-brand-green tracking-tighter">
                {formatMoney(order.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-10 border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <User className="w-4 h-4 text-gray-400" />
            <h4 className="tracking-label uppercase">Thong tin nguoi nhan</h4>
          </div>
          <div className="space-y-4 pt-2">
            <div>
              <p className="breadcrumb-text uppercase text-xl mb-1">{order.recipientName}</p>
              <p className="meta-label uppercase text-[#B48F4E]">{order.companyName}</p>
            </div>
            <div className="space-y-3 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-300" />
                <span className="qty-label tracking-widest text-sm">{order.recipientPhone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-300" />
                <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase">{order.email ?? order.customerEmail}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <MapPin className="w-4 h-4 text-gray-400" />
            <h4 className="tracking-label uppercase">Dia chi giao hang</h4>
          </div>
          <div className="space-y-6 pt-2">
            <p className="qty-label font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4 lowercase first-letter:uppercase">
              {order.address}
            </p>
            <div className="pt-10 flex flex-col gap-4">
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                Xem vi tri tren ban do
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
