import api from "@/shared/configs/axios-config";
import { Order, OrderListItem } from "../models/order";
import { OffsetPagedQuery, OffsetPagedResult } from "@/shared/models/offset-page.base";

export interface OrderFilter extends OffsetPagedQuery {
  searchTerm?: string;
  status?: string;
  code?: string;
  companyName?: string;
  recipientName?: string;
  recipientPhone?: string;
  senderName?: string;
  totalFrom?: number;
  totalTo?: number;
  orderDateFrom?: string;
  orderDateTo?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface OrderStatsResponse {
  totalCount: number;
  pendingPaymentCount: number;
  processingCount: number;
  dispatchedCount: number;
  cancelledCount: number;
}

export const OrderService = {
  getListOrders: (params: OrderFilter) =>
    api.master.get<unknown, OffsetPagedResult<OrderListItem>>(`/orders`, { params }),

  getOrderById: (id: string) =>
    api.master.get<unknown, Order>(`/orders/${id}`),

  getOrderStats: () =>
    api.master.get<unknown, OrderStatsResponse>(`/orders/stats`),

  getMyOrders: (params: OrderFilter) =>
    api.master.get<unknown, OffsetPagedResult<OrderListItem>>(`/orders/my`, { params }),

  getMyOrderById: (id: string) =>
    api.master.get<unknown, Order>(`/orders/my/${id}`),

  checkOrderPaymentStatus: (id: string) =>
    api.master.get<unknown, { orderId: string; isPaid: boolean; paymentStatus: string }>(`/orders/${id}/payment-status`),

  cancelOrder: (id: string) =>
    api.master.post<unknown, void>(`/orders/my/${id}/cancel`),
};

export default OrderService;
