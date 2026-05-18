import api from "@/shared/configs/axios-config";
import { OffsetPagedResult } from "@/shared/models/base-response";
import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { Order, OrderListItem } from "../models/order";

export type OrderFilter = BaseQueryOffsetPagedList;

export const OrderService = {
  getListOrders: (params: OrderFilter) =>
    api.master.get<unknown, OffsetPagedResult<OrderListItem>>(`/orders`, { params }),

  getOrderById: (id: string) =>
    api.master.get<unknown, Order>(`/orders/${id}`),
};

export default OrderService;
