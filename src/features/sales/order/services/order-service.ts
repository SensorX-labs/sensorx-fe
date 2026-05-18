import api from "@/shared/configs/axios-config";
import { Order, OrderListItem } from "../models/order";
import { OffsetPagedQuery, OffsetPagedResult } from "@/shared/models/offset-page.base";

export type OrderFilter = OffsetPagedQuery;

export const OrderService = {
  getListOrders: (params: OrderFilter) =>
    api.master.get<unknown, OffsetPagedResult<OrderListItem>>(`/orders`, { params }),

  getOrderById: (id: string) =>
    api.master.get<unknown, Order>(`/orders/${id}`),

  getMyOrders: (params: OrderFilter) =>
    api.master.get<unknown, OffsetPagedResult<OrderListItem>>(`/orders/my`, { params }),

  getMyOrderById: (id: string) =>
    api.master.get<unknown, Order>(`/orders/my/${id}`),
};

export default OrderService;
